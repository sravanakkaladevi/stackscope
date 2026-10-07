// Background Service Worker for StackScope Extension Badge Updates & Response Header Tech Inspection

const tabHeaderTechs = new Map();

// Capture HTTP response headers to detect hosting, web servers, & backend tech
if (chrome.webRequest && chrome.webRequest.onHeadersReceived) {
  try {
    chrome.webRequest.onHeadersReceived.addListener(
      (details) => {
        if (details.type !== "main_frame" || !details.responseHeaders) return;

        const headers = details.responseHeaders;
        const techs = [];

        const getHeader = (name) => {
          const h = headers.find((item) => item.name.toLowerCase() === name.toLowerCase());
          return h ? h.value : null;
        };

        const server = getHeader("server");
        const poweredBy = getHeader("x-powered-by");
        const vercelId = getHeader("x-vercel-id");
        const netlifyId = getHeader("x-netlify-request-id");
        const githubId = getHeader("x-github-request-id");
        const cfRay = getHeader("cf-ray");
        const cfCache = getHeader("cf-cache-status");
        const amzCfId = getHeader("x-amz-cf-id");
        const firebaseSite = getHeader("x-firebase-hosting-site");
        const renderServer = getHeader("x-render-origin-server");
        const kinstaCache = getHeader("x-kinsta-cache");

        // Server / Hosting Provider checks
        if (server) {
          if (/gws|gse|google/i.test(server)) {
            techs.push({
              name: "Google Cloud / Infrastructure",
              category: "Infrastructure & Hosting",
              confidence: "High",
              evidence: `HTTP Server response header: ${server}`,
            });
          }
          if (/vercel/i.test(server) || vercelId) {
            techs.push({
              name: "Vercel",
              category: "Infrastructure & Hosting",
              confidence: "High",
              evidence: "HTTP Vercel deployment headers",
            });
          }
          if (/netlify/i.test(server) || netlifyId) {
            techs.push({
              name: "Netlify",
              category: "Infrastructure & Hosting",
              confidence: "High",
              evidence: "HTTP Netlify response headers",
            });
          }
          if (/github/i.test(server) || githubId) {
            techs.push({
              name: "GitHub Pages",
              category: "Infrastructure & Hosting",
              confidence: "High",
              evidence: "HTTP GitHub Pages response headers",
            });
          }
          if (/cloudflare/i.test(server) || cfRay || cfCache) {
            techs.push({
              name: "Cloudflare",
              category: "Infrastructure & CDN",
              confidence: "High",
              evidence: `HTTP Cloudflare header (${cfRay ? "CF-Ray" : "Server"})`,
            });
          }
          if (/amazons3|aws/i.test(server) || amzCfId) {
            techs.push({
              name: "Amazon Web Services (AWS)",
              category: "Infrastructure & Hosting",
              confidence: "High",
              evidence: "HTTP AWS / CloudFront response headers",
            });
          }
          if (/nginx/i.test(server)) {
            techs.push({
              name: "Nginx",
              category: "Infrastructure & CDN",
              confidence: "High",
              evidence: `HTTP Server header: ${server}`,
            });
          }
          if (/apache/i.test(server)) {
            techs.push({
              name: "Apache",
              category: "Infrastructure & CDN",
              confidence: "High",
              evidence: `HTTP Server header: ${server}`,
            });
          }
          if (/litespeed/i.test(server)) {
            techs.push({
              name: "LiteSpeed",
              category: "Infrastructure & CDN",
              confidence: "High",
              evidence: `HTTP Server header: ${server}`,
            });
          }
          if (/caddy/i.test(server)) {
            techs.push({
              name: "Caddy",
              category: "Infrastructure & CDN",
              confidence: "High",
              evidence: `HTTP Server header: ${server}`,
            });
          }
          if (/microsoft-iis/i.test(server)) {
            techs.push({
              name: "Microsoft IIS",
              category: "Infrastructure & CDN",
              confidence: "High",
              evidence: `HTTP Server header: ${server}`,
            });
          }
        }

        if (firebaseSite) {
          techs.push({
            name: "Firebase Hosting",
            category: "Infrastructure & Hosting",
            confidence: "High",
            evidence: "HTTP Firebase hosting response header",
          });
        }

        if (renderServer) {
          techs.push({
            name: "Render",
            category: "Infrastructure & Hosting",
            confidence: "High",
            evidence: "HTTP Render response header",
          });
        }

        if (kinstaCache) {
          techs.push({
            name: "Kinsta",
            category: "Infrastructure & Hosting",
            confidence: "High",
            evidence: "HTTP Kinsta cache response header",
          });
        }

        if (poweredBy) {
          if (/express/i.test(poweredBy)) {
            techs.push({
              name: "Express.js",
              category: "Backend & BaaS",
              confidence: "High",
              evidence: `HTTP X-Powered-By header: ${poweredBy}`,
            });
          }
          if (/php/i.test(poweredBy)) {
            techs.push({
              name: "PHP",
              category: "Languages",
              confidence: "High",
              evidence: `HTTP X-Powered-By header: ${poweredBy}`,
            });
          }
          if (/next\.js/i.test(poweredBy)) {
            techs.push({
              name: "Next.js",
              category: "Framework",
              confidence: "High",
              evidence: `HTTP X-Powered-By header: ${poweredBy}`,
            });
          }
          if (/wp engine/i.test(poweredBy)) {
            techs.push({
              name: "WP Engine",
              category: "Infrastructure & Hosting",
              confidence: "High",
              evidence: "HTTP WP Engine header",
            });
          }
        }

        tabHeaderTechs.set(details.tabId, techs);
      },
      { urls: ["<all_urls>"] },
      ["responseHeaders"]
    );
  } catch (e) {}
}

function updateBadge(tabId, count) {
  if (!tabId) return;

  try {
    if (count && count > 0) {
      const text = String(count);
      const res = chrome.action.setBadgeText({ text, tabId });
      if (res && res.catch) res.catch(() => {});

      const bgRes = chrome.action.setBadgeBackgroundColor({ color: "#6366F1", tabId });
      if (bgRes && bgRes.catch) bgRes.catch(() => {});

      if (chrome.action.setBadgeTextColor) {
        const textRes = chrome.action.setBadgeTextColor({ color: "#FFFFFF", tabId });
        if (textRes && textRes.catch) textRes.catch(() => {});
      }
    } else {
      const res = chrome.action.setBadgeText({ text: "", tabId });
      if (res && res.catch) res.catch(() => {});
    }
  } catch (e) {
    // Ignore closed or invalid tab errors
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "update-badge") {
    const tabId = message.tabId || sender.tab?.id;
    if (tabId) {
      updateBadge(tabId, message.count);
    }
  } else if (message.type === "get-header-techs") {
    const tabId = sender.tab?.id;
    const techs = tabHeaderTechs.get(tabId) || [];
    sendResponse({ techs });
    return true;
  }
  return true;
});

// Clear tab data on tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  tabHeaderTechs.delete(tabId);
});


