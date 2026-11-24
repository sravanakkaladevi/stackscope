// Background Service Worker for StackScope
// Powered by Wappalyzer Engine with 3,700+ Technologies & Response Header Inspection

/* globals chrome, importScripts, self */

try {
  importScripts('data/categories.js', 'data/technologies.js', 'wappalyzerEngine.js');
} catch (e) {
  console.error('Failed to import Wappalyzer engine scripts:', e);
}

if (self.WappalyzerEngine && self.TECHNOLOGIES && self.CATEGORIES) {
  self.WappalyzerEngine.init(self.TECHNOLOGIES, self.CATEGORIES);
}

const tabHeaders = new Map();
const tabResults = new Map();

// 1. Capture HTTP Response Headers (Server, X-Powered-By, CDN, etc.)
if (chrome.webRequest && chrome.webRequest.onHeadersReceived) {
  chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
      if (details.tabId < 0) return;
      // ONLY main_frame responses represent the host website's server/framework stack.
      // Subresources (fonts, external scripts, images, CDNs) must NOT contaminate the page host headers.
      if (details.type === 'main_frame') {
        const headers = {};
        if (details.responseHeaders) {
          for (let i = 0; i < details.responseHeaders.length; i++) {
            const h = details.responseHeaders[i];
            const key = h.name.toLowerCase();
            if (!headers[key]) headers[key] = [];
            if (h.value && !headers[key].includes(h.value)) {
              headers[key].push(h.value);
            }
          }
        }
        tabHeaders.set(details.tabId, headers);
      }
    },
    { urls: ['http://*/*', 'https://*/*'] },
    ['responseHeaders']
  );
}

// 2. Toolbar Badge Counter
function updateBadge(tabId, count) {
  if (!tabId || tabId < 0) return;
  if (count && count > 0) {
    const text = String(count);
    chrome.action.setBadgeText({ text, tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#6366F1', tabId });
    if (chrome.action.setBadgeTextColor) {
      chrome.action.setBadgeTextColor({ color: '#FFFFFF', tabId });
    }
  } else {
    chrome.action.setBadgeText({ text: '', tabId });
  }
}

// 3. Process Page Signals with Wappalyzer Engine
function analyzePageData(tabId, data) {
  if (!self.WappalyzerEngine) return null;

  const headers = tabHeaders.get(tabId) || {};
  const fullData = { ...data, headers };
  const analysis = self.WappalyzerEngine.analyzeAndResolve(fullData);

  // Incorporate custom heuristics if not already detected
  if (data.customTechs && Array.isArray(data.customTechs)) {
    for (const custom of data.customTechs) {
      const exists = analysis.technologies.some((t) => t.name.toLowerCase() === custom.name.toLowerCase());
      if (!exists) {
        const baseTech = self.WappalyzerEngine.getTechnology(custom.name);
        const categories = baseTech ? (baseTech.categories || []).map((id) => self.WappalyzerEngine.getCategory(id)) : [];
        const primaryCat = categories[0] || { name: 'Framework', priority: 5 };

        analysis.technologies.push({
          name: custom.name,
          slug: custom.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          category: primaryCat.name,
          categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
          uiCategory: custom.uiCategory || 'Framework',
          version: custom.version || null,
          confidence: 'High',
          confidenceScore: 100,
          icon: baseTech?.icon || `${custom.name}.svg`,
          description: baseTech?.description || '',
          website: baseTech?.website || '',
          evidence: custom.evidence || 'DOM signature heuristic match',
          priority: primaryCat.priority || 5,
        });
      }
    }
  }

  tabResults.set(tabId, analysis);
  const total = analysis.technologies.length + (analysis.languages?.length || 0);
  updateBadge(tabId, total);

  return analysis;
}

// 4. Runtime Message Handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Received analysis payload from content script
  if (message.type === 'page-analyzed') {
    const tabId = sender.tab?.id || message.data?.tabId;
    if (tabId) {
      const result = analyzePageData(tabId, message.data);
      sendResponse({ status: 'ok', count: result?.technologies?.length || 0 });
    }
    return true;
  }

  // Popup requesting current tab technologies
  if (message.type === 'get-page-stack') {
    const tabId = message.tabId;
    if (tabResults.has(tabId)) {
      sendResponse(tabResults.get(tabId));
      return true;
    }

    // If not cached, query active tab content script
    chrome.tabs.sendMessage(tabId, { type: 'scan-page' }, (pageData) => {
      if (chrome.runtime.lastError || !pageData) {
        sendResponse(null);
        return;
      }
      const result = analyzePageData(tabId, pageData);
      sendResponse(result);
    });
    return true;
  }

  // Popup requesting on-demand rescan
  if (message.type === 'rescan-page') {
    const tabId = message.tabId;
    chrome.tabs.sendMessage(tabId, { type: 'scan-page' }, (pageData) => {
      if (chrome.runtime.lastError || !pageData) {
        sendResponse(null);
        return;
      }
      const result = analyzePageData(tabId, pageData);
      sendResponse(result);
    });
    return true;
  }

  return true;
});

// 5. Clean up memory on tab closure
chrome.tabs.onRemoved.addListener((tabId) => {
  tabHeaders.delete(tabId);
  tabResults.delete(tabId);
  updateBadge(tabId, 0);
});
