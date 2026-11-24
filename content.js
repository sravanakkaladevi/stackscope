// StackScope Content Script - Page Signature & DOM Evidence Collector
(function () {
  'use strict';

  // 1. Inject injected.js to inspect main-world JS window variables
  function injectMainWorldScript() {
    try {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('injected.js');
      script.onload = () => script.remove();
      (document.head || document.documentElement).appendChild(script);
    } catch (e) {
      // Ignore injection restrictions if any
    }
  }
  injectMainWorldScript();

  let injectedJsHits = [];
  let injectedReactFiber = false;

  window.addEventListener('message', (event) => {
    if (event.data && event.data.source === 'stackscope-injected') {
      if (Array.isArray(event.data.js)) {
        injectedJsHits = event.data.js;
      }
      if (typeof event.data.reactFiber === 'boolean') {
        injectedReactFiber = event.data.reactFiber;
      }
      // Notify background with latest data
      sendDataToBackground();
    }
  });

  // 2. Collect Script URLs (from DOM and Performance API)
  function getScriptSources() {
    const sources = new Set();
    try {
      document.querySelectorAll('script[src]').forEach((s) => {
        if (s.src && !s.src.startsWith('data:')) {
          sources.add(s.src);
        }
      });
    } catch (e) {}

    try {
      if (typeof performance !== 'undefined' && performance.getEntriesByType) {
        const entries = performance.getEntriesByType('resource');
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const name = entry.name;
          if (
            entry.initiatorType === 'script' ||
            name.includes('.js') ||
            name.includes('/chunks/') ||
            name.includes('_next') ||
            name.includes('_nuxt')
          ) {
            sources.add(name);
          }
        }
      }
    } catch (e) {}

    return Array.from(sources);
  }

  // 3. Collect Inline Scripts
  function getInlineScripts() {
    const scripts = [];
    try {
      document.querySelectorAll('script:not([src])').forEach((s) => {
        const text = s.textContent ? s.textContent.trim() : '';
        if (text && text.length < 50000) {
          scripts.push(text);
        }
      });
    } catch (e) {}
    return scripts;
  }

  // 4. Collect Meta Tags
  function getMetaTags() {
    const meta = {};
    try {
      document.querySelectorAll('meta').forEach((el) => {
        const key = (el.getAttribute('name') || el.getAttribute('property') || '').toLowerCase().trim();
        const content = el.getAttribute('content');
        if (key && content) {
          if (!meta[key]) meta[key] = [];
          meta[key].push(content);
        }
      });
    } catch (e) {}
    return meta;
  }

  // 5. Collect Cookies
  function getCookies() {
    const cookies = {};
    try {
      if (document.cookie) {
        const pairs = document.cookie.split(';');
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i].trim();
          if (!pair) continue;
          const eqIdx = pair.indexOf('=');
          if (eqIdx !== -1) {
            const name = pair.slice(0, eqIdx).trim();
            const val = pair.slice(eqIdx + 1).trim();
            if (name) {
              if (!cookies[name]) cookies[name] = [];
              cookies[name].push(val);
            }
          }
        }
      }
    } catch (e) {}
    return cookies;
  }

  // 6. Collect HTML Snippets
  function getHtmlContent() {
    try {
      const head = document.head ? document.head.innerHTML : '';
      const bodySlice = document.body ? document.body.innerHTML.slice(0, 100000) : '';
      return head + '\n' + bodySlice;
    } catch (e) {
      return '';
    }
  }

  // 7. Collect CSS Text and Stylesheet URLs
  function getCssContent() {
    try {
      const links = [];
      document.querySelectorAll('link[rel="stylesheet"][href]').forEach((link) => {
        if (link.href) links.push(link.href);
      });
      return links.join('\n');
    } catch (e) {
      return '';
    }
  }

  // 8. Evaluate Wappalyzer DOM Rules
  function evaluateDomRules() {
    const matches = [];
    const rules = window.WAPPA_DOM_RULES || self.WAPPA_DOM_RULES;
    if (!Array.isArray(rules)) return matches;

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      try {
        const nodes = document.querySelectorAll(rule.selector);
        if (!nodes || !nodes.length) continue;

        const firstNode = nodes[0];
        let matched = false;
        let matchVal = '';

        // 1. Element presence check (only if rule explicitly specified exists: true)
        if (rule.exists) {
          matched = true;
        }

        // 2. Element text check
        if (rule.text && firstNode.innerText) {
          const text = firstNode.innerText.slice(0, 500).trim();
          try {
            const cleanPattern = String(rule.text).split('\\;')[0];
            if (!cleanPattern || new RegExp(cleanPattern, 'i').test(text)) {
              matched = true;
              matchVal = text;
            }
          } catch (e) {}
        }

        // 3. Element attributes check
        if (rule.attributes && typeof rule.attributes === 'object') {
          for (const [attr, rawPattern] of Object.entries(rule.attributes)) {
            if (firstNode.hasAttribute(attr)) {
              const attrVal = firstNode.getAttribute(attr) || '';
              const cleanPattern = String(rawPattern).split('\\;')[0];
              try {
                if (!cleanPattern || new RegExp(cleanPattern, 'i').test(attrVal)) {
                  matched = true;
                  matchVal = attrVal;
                  break;
                }
              } catch (e) {}
            }
          }
        }

        // 4. Element properties check
        if (rule.properties && typeof rule.properties === 'object') {
          for (const [prop, rawPattern] of Object.entries(rule.properties)) {
            if (prop in firstNode) {
              const propVal = String(firstNode[prop] || '');
              const cleanPattern = String(rawPattern).split('\\;')[0];
              try {
                if (!cleanPattern || new RegExp(cleanPattern, 'i').test(propVal)) {
                  matched = true;
                  matchVal = propVal;
                  break;
                }
              } catch (e) {}
            }
          }
        }

        if (matched) {
          matches.push({
            name: rule.name,
            selector: rule.selector,
            value: matchVal,
          });
        }
      } catch (e) {
        // Safe execution against complex/invalid selectors
      }
    }

    return matches;
  }

  // 9. Detect Special Framework Heuristics (Tailwind, React Fiber, Radix, etc.)
  function getCustomDetections() {
    const custom = [];

    // React Fiber
    if (injectedReactFiber) {
      custom.push({
        name: 'React',
        confidence: 100,
        evidence: 'Detected active React Fiber root in DOM',
      });
    }

    // Tailwind CSS Utility Classes Heuristic
    try {
      const twSample = document.querySelectorAll('[class*="flex"], [class*="grid"], [class*="bg-"], [class*="text-"]');
      let twScore = 0;
      const twRegex = /\b(flex|grid|hidden|block|inline-flex|justify-|items-|p-|px-|py-|m-|mx-|my-|bg-|text-|rounded-|border-|shadow-|w-|h-|max-w-|transition-)\b/;
      for (let i = 0; i < Math.min(twSample.length, 30); i++) {
        const cls = twSample[i].className;
        if (typeof cls === 'string' && twRegex.test(cls)) {
          twScore++;
        }
      }
      if (twScore >= 6) {
        custom.push({
          name: 'Tailwind CSS',
          confidence: 100,
          evidence: `Detected Tailwind utility class patterns across ${twScore} DOM nodes`,
        });
      }
    } catch (e) {}

    // Radix UI / Shadcn
    try {
      if (document.querySelector('[data-radix-collection-item], [data-state], [data-slot]')) {
        custom.push({
          name: 'Radix UI',
          confidence: 90,
          evidence: 'Found data-radix-* or data-state primitive attributes',
        });
      }
    } catch (e) {}

    return custom;
  }

  // 10. Detect Programming Languages
  function detectLanguages(scriptSrc) {
    const languages = [];
    const sourceStr = (scriptSrc || []).join(' ') + ' ' + location.pathname;

    // Only detect server-side languages if explicit server endpoints or assets are present
    if (/\.php(?:[?#]|$)/i.test(sourceStr)) {
      languages.push({
        name: 'PHP',
        category: 'Languages',
        uiCategory: 'Languages',
        version: null,
        confidence: 'High',
        icon: 'PHP.svg',
        evidence: 'Found .php server asset endpoints',
      });
    }

    if (/_rails|ruby|\.rb(?:[?#]|$)/i.test(sourceStr)) {
      languages.push({
        name: 'Ruby',
        category: 'Languages',
        uiCategory: 'Languages',
        version: null,
        confidence: 'High',
        icon: 'Ruby.svg',
        evidence: 'Found Ruby on Rails asset structures',
      });
    }

    if (/\.py(?:[?#]|$)/i.test(sourceStr)) {
      languages.push({
        name: 'Python',
        category: 'Languages',
        uiCategory: 'Languages',
        version: null,
        confidence: 'High',
        icon: 'Python.svg',
        evidence: 'Found Python WSGI/asset endpoints',
      });
    }

    if (/\.ts(?:[?#]|$)|typescript/i.test(sourceStr)) {
      languages.push({
        name: 'TypeScript',
        category: 'Languages',
        uiCategory: 'Languages',
        version: null,
        confidence: 'High',
        icon: 'TypeScript.svg',
        evidence: 'Found TypeScript transpilation source paths',
      });
    }

    // Default web languages
    languages.push({
      name: 'JavaScript',
      category: 'Languages',
      uiCategory: 'Languages',
      version: null,
      confidence: 'High',
      icon: 'JavaScript.svg',
      evidence: 'Active ECMAScript execution and JS script modules',
    });

    languages.push({
      name: 'HTML / CSS',
      category: 'Languages',
      uiCategory: 'Languages',
      version: null,
      confidence: 'High',
      icon: 'HTML5.svg',
      evidence: 'HTML5 document structure and CSS stylesheets',
    });

    return languages;
  }

  // Gather Full Page Payload
  function collectPageData() {
    const scriptSrc = getScriptSources();
    const scripts = getInlineScripts();
    const meta = getMetaTags();
    const cookies = getCookies();
    const html = getHtmlContent();
    const css = getCssContent();
    const dom = evaluateDomRules();
    const custom = getCustomDetections();
    const languages = detectLanguages(scriptSrc);

    return {
      url: location.href,
      hostname: location.hostname,
      title: document.title || location.hostname || 'Untitled Page',
      scriptSrc,
      scripts,
      meta,
      cookies,
      html,
      css,
      dom,
      js: injectedJsHits,
      customTechs: custom,
      languages,
      scannedAt: new Date().toISOString(),
    };
  }

  function sendDataToBackground() {
    try {
      const data = collectPageData();
      chrome.runtime.sendMessage({
        type: 'page-analyzed',
        data,
      });
    } catch (e) {
      // Ignore extension context invalidation
    }
  }

  // Scan immediately on idle
  setTimeout(() => {
    sendDataToBackground();
  }, 300);

  // Scan again after 2 seconds to catch late-mounted SPA components
  setTimeout(() => {
    sendDataToBackground();
  }, 2000);

  // Handle on-demand scan request from popup
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'scan-page') {
      const data = collectPageData();
      sendResponse(data);
    }
    return true;
  });
})();
