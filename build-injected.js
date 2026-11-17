const fs = require('fs');
const path = require('path');

const jsChains = fs.readFileSync(
  path.join(__dirname, 'data', 'jsChains.js'),
  'utf8'
).replace('self.WAPPA_JS_CHAINS = ', '').replace(/;$/, '');

const code = `(function () {
  if (window.__stackscope_injected) return;
  window.__stackscope_injected = true;

  const WAPPA_JS_CHAINS = ${jsChains};

  function evaluateChains() {
    const hits = [];
    for (let i = 0; i < WAPPA_JS_CHAINS.length; i++) {
      const item = WAPPA_JS_CHAINS[i];
      const parts = item.chain.split('.');
      let val = window;
      let ok = true;
      for (let j = 0; j < parts.length; j++) {
        const part = parts[j];
        try {
          if (val && (typeof val === 'object' || typeof val === 'function') && part in val) {
            val = val[part];
          } else {
            ok = false;
            break;
          }
        } catch (e) {
          ok = false;
          break;
        }
      }
      if (ok && typeof val !== 'undefined') {
        let cleanVal = '';
        if (typeof val === 'string' || typeof val === 'number') {
          cleanVal = String(val).slice(0, 50);
        }
        hits.push({
          name: item.name,
          chain: item.chain,
          value: cleanVal,
        });
      }
    }
    return hits;
  }

  function checkReactFiber() {
    try {
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        return true;
      }
      const candidates = document.querySelectorAll('#root, #__next, #app, [data-reactroot], body > div');
      for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i];
        for (const k in el) {
          if (k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$') || k === '_reactRootContainer') {
            return true;
          }
        }
      }
    } catch (e) {}
    return false;
  }

  function scanAndPost() {
    try {
      const jsHits = evaluateChains();
      const hasFiber = checkReactFiber();
      window.postMessage({
        source: 'stackscope-injected',
        js: jsHits,
        reactFiber: hasFiber,
      }, '*');
    } catch (e) {}
  }

  // Scan immediately
  scanAndPost();

  // Also scan after a short delay for late-mounting SPAs
  setTimeout(scanAndPost, 1200);
})();
`;

fs.writeFileSync(path.join(__dirname, 'injected.js'), code, 'utf8');
console.log('injected.js generated successfully! Length:', code.length);
