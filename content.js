// Inject injected.js to inspect main-world JS window variables
(function injectMainWorldScript() {
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("injected.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  } catch (e) {
    // Ignore injection restrictions if any
  }
})();

let injectedTechs = [];

window.addEventListener("message", (event) => {
  if (event.data && event.data.source === "stackscope-injected") {
    injectedTechs = event.data.data || [];
  }
});

const signatures = [
  // --- Frameworks & Meta-Frameworks ---
  {
    name: "Next.js",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("#__next, script[src*='_next/'], link[href*='_next/']")
      ),
    evidence: "Found #__next container or _next/ bundle assets",
  },
  {
    name: "React",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[data-reactroot], [data-reactid]") ||
        Array.from(document.querySelectorAll("*")).some(
          (el) =>
            el.className &&
            typeof el.className === "string" &&
            el.className.includes("react-")
        )
      ),
    evidence: "Found data-reactroot attribute or react- DOM class prefix",
  },
  {
    name: "Nuxt.js",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("#__nuxt, script[src*='_nuxt/'], link[href*='_nuxt/']")
      ),
    evidence: "Found #__nuxt container or _nuxt/ bundle assets",
  },
  {
    name: "Vue.js",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[data-v-], [data-vue-meta], script[src*='vue']")
      ),
    evidence: "Found data-v- scoped attribute or Vue script inclusion",
  },
  {
    name: "Angular",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[ng-version], [_nghost], [_ngcontent], script[src*='angular']")
      ),
    getVersion: () => document.querySelector("[ng-version]")?.getAttribute("ng-version") || null,
    evidence: "Found ng-version attribute or _ngcontent DOM markers",
  },
  {
    name: "Svelte / SvelteKit",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[class*='svelte-'], script[src*='svelte'], link[href*='_app/immutable']")
      ),
    evidence: "Found svelte- CSS class hashing or SvelteKit immutable assets",
  },
  {
    name: "Astro",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[data-astro-cid], [data-astro-id], meta[name='astro-view-transitions'], script[src*='astro']")
      ),
    evidence: "Found data-astro DOM scope attribute or Astro metadata",
  },
  {
    name: "Gatsby",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("#___gatsby, script[id='gatsby-script-loader']")
      ),
    evidence: "Found #___gatsby root element or Gatsby script loader",
  },
  {
    name: "Remix",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("script[src*='remix']") ||
        document.documentElement.innerHTML.includes("__remixContext")
      ),
    evidence: "Found Remix script bundle or __remixContext variable",
  },
  {
    name: "HTMX",
    category: "Library",
    test: () =>
      Boolean(
        document.querySelector("[hx-get], [hx-post], [hx-target], [hx-swap], script[src*='htmx']")
      ),
    evidence: "Found hx-get / hx-post reactive HTML attributes",
  },
  {
    name: "Alpine.js",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[x-data], [x-init], [x-show], [x-bind], script[src*='alpine']")
      ),
    evidence: "Found x-data or x-init reactive directives in DOM",
  },
  {
    name: "Solid.js",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[data-solid]") ||
        Array.from(document.scripts).some((s) => s.src.includes("solid"))
      ),
    evidence: "Found Solid.js DOM signature or script asset",
  },
  {
    name: "Preact",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("script[src*='preact']")
      ),
    evidence: "Found Preact script asset",
  },
  {
    name: "jQuery",
    category: "Library",
    test: () =>
      Boolean(
        document.querySelector("script[src*='jquery']")
      ),
    getVersion: () => {
      const match = document.documentElement.innerHTML.match(/jquery[.-](\d+\.\d+\.\d+)/i);
      return match ? match[1] : null;
    },
    evidence: "Found jQuery script asset inclusion in document body",
  },

  // --- UI & Styling ---
  {
    name: "Tailwind CSS",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("link[href*='tailwind']") ||
        document.querySelector("[class*='sm:'], [class*='md:'], [class*='lg:'], [class*='xl:']") ||
        (document.querySelector("[class*='flex-']") && document.querySelector("[class*='grid-']")) ||
        document.documentElement.innerHTML.includes("tailwind")
      ),
    evidence: "Found responsive utility classes (sm:, md:, lg:) or Tailwind link tag",
  },
  {
    name: "Bootstrap",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("link[href*='bootstrap'], script[src*='bootstrap']") ||
        (document.querySelector(".container, .container-fluid") && document.querySelector(".row, .col-md-12, .btn-primary"))
      ),
    getVersion: () => {
      const match = document.documentElement.innerHTML.match(/bootstrap[/-](\d+\.\d+\.\d+)/i);
      return match ? match[1] : null;
    },
    evidence: "Found Bootstrap stylesheet link tag or .container / .row grid structure",
  },
  {
    name: "Material UI (MUI)",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("[class*='MuiButton-'], [class*='MuiSvgIcon-'], [class*='MuiBox-'], [class*='MuiPaper-']")
      ),
    evidence: "Found MuiButton- / MuiSvgIcon- class structure in DOM elements",
  },
  {
    name: "Shadcn UI / Radix",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("[data-radix-portal], [data-radix-popper-content-wrapper], [data-state='open'], [data-state='closed']") &&
        document.querySelector("[class*='inline-flex'][class*='items-center']")
      ),
    evidence: "Found data-radix primitives with Tailwind CSS integration",
  },
  {
    name: "Chakra UI",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("[class*='chakra-']")
      ),
    evidence: "Found chakra- class prefix in HTML components",
  },
  {
    name: "Ant Design",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("[class*='ant-btn'], [class*='ant-layout'], [class*='ant-col']")
      ),
    evidence: "Found ant-btn / ant-layout component design classes",
  },
  {
    name: "Styled Components",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("style[data-styled]") ||
        document.querySelector("[class*='sc-']")
      ),
    evidence: "Found style[data-styled] injection tag in head",
  },
  {
    name: "Emotion",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("style[data-emotion]") ||
        document.querySelector("[class*='css-']")
      ),
    evidence: "Found style[data-emotion] tag in head",
  },
  {
    name: "Font Awesome",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("link[href*='fontawesome'], link[href*='font-awesome'], [class*='fa-'], [class*='fas '], [class*='fab ']")
      ),
    evidence: "Found Font Awesome icon class fa- or fontawesome link stylesheet",
  },
  {
    name: "Lucide Icons",
    category: "Styling & UI",
    test: () =>
      Boolean(
        document.querySelector("[class*='lucide-'], svg.lucide")
      ),
    evidence: "Found lucide SVG icon classes in markup",
  },

  // --- CMS & E-Commerce ---
  {
    name: "WordPress",
    category: "CMS & Commerce",
    test: () =>
      /wp-content|wp-includes/i.test(document.documentElement.innerHTML) ||
      /wordpress/i.test(document.querySelector("meta[name='generator']")?.content || "") ||
      Boolean(document.querySelector("#wpadminbar, link[href*='wp-content']")),
    getVersion: () => {
      const meta = document.querySelector("meta[name='generator']")?.content || "";
      const match = meta.match(/WordPress\s*([\d.]+)/i);
      return match ? match[1] : null;
    },
    evidence: "Found wp-content directory paths or meta generator tag",
  },
  {
    name: "Shopify",
    category: "CMS & Commerce",
    test: () =>
      /cdn\.shopify\.com/i.test(document.documentElement.innerHTML) ||
      Boolean(document.querySelector("meta[name='shopify-digital-wallet']")),
    evidence: "Found cdn.shopify.com assets or shopify meta tags",
  },
  {
    name: "Webflow",
    category: "CMS & Commerce",
    test: () =>
      Boolean(
        document.querySelector("html[data-wf-domain], html[data-wf-page]") ||
        /webflow/i.test(document.querySelector("meta[name='generator']")?.content || "")
      ),
    evidence: "Found data-wf-domain attribute or Webflow generator meta tag",
  },
  {
    name: "Wix",
    category: "CMS & Commerce",
    test: () =>
      /wix\.com|wixstatic\.com/i.test(document.documentElement.innerHTML) ||
      /wix/i.test(document.querySelector("meta[name='generator']")?.content || ""),
    evidence: "Found wixstatic.com assets or Wix generator tag",
  },
  {
    name: "Squarespace",
    category: "CMS & Commerce",
    test: () =>
      /squarespace/i.test(document.documentElement.innerHTML) ||
      /squarespace/i.test(document.querySelector("meta[name='generator']")?.content || ""),
    evidence: "Found Squarespace asset scripts or generator tag",
  },
  {
    name: "Ghost",
    category: "CMS & Commerce",
    test: () =>
      /ghost/i.test(document.querySelector("meta[name='generator']")?.content || "") ||
      Boolean(document.querySelector("script[src*='ghost']")),
    evidence: "Found Ghost meta generator or asset script",
  },
  {
    name: "WooCommerce",
    category: "CMS & Commerce",
    test: () =>
      Boolean(
        document.querySelector("body.woocommerce, link[href*='woocommerce'], script[src*='woocommerce']")
      ),
    evidence: "Found body.woocommerce class or woocommerce plugin scripts",
  },
  {
    name: "Strapi",
    category: "CMS & Commerce",
    test: () =>
      Boolean(
        document.querySelector("script[src*='strapi']") ||
        document.documentElement.innerHTML.includes("strapi")
      ),
    evidence: "Found Strapi CMS backend reference",
  },

  // --- Analytics & Marketing ---
  {
    name: "Google Analytics",
    category: "Analytics & Marketing",
    test: () =>
      Boolean(
        document.querySelector("script[src*='google-analytics.com'], script[src*='googletagmanager.com/gtag']")
      ),
    evidence: "Found Google Analytics script (gtag.js or ga.js)",
  },
  {
    name: "Google Tag Manager",
    category: "Analytics & Marketing",
    test: () =>
      Boolean(
        document.querySelector("script[src*='googletagmanager.com/gtm.js']")
      ),
    evidence: "Found Google Tag Manager script (gtm.js)",
  },
  {
    name: "Mixpanel",
    category: "Analytics & Marketing",
    test: () => Boolean(document.querySelector("script[src*='mixpanel.com']")),
    evidence: "Found mixpanel.com tracking script tag",
  },
  {
    name: "Hotjar",
    category: "Analytics & Marketing",
    test: () => Boolean(document.querySelector("script[src*='hotjar.com']")),
    evidence: "Found hotjar.com tracking snippet",
  },
  {
    name: "PostHog",
    category: "Analytics & Marketing",
    test: () => Boolean(document.querySelector("script[src*='posthog']")),
    evidence: "Found PostHog product analytics script tag",
  },
  {
    name: "Intercom",
    category: "Analytics & Marketing",
    test: () => Boolean(document.querySelector("script[src*='intercom'], #intercom-container")),
    evidence: "Found Intercom messenger widget container or script",
  },
  {
    name: "Segment",
    category: "Analytics & Marketing",
    test: () => Boolean(document.querySelector("script[src*='cdn.segment.com']")),
    evidence: "Found cdn.segment.com tracking script",
  },
  {
    name: "Sentry",
    category: "Analytics & Marketing",
    test: () => Boolean(document.querySelector("script[src*='sentry']")),
    evidence: "Found Sentry error monitoring script tag",
  },

  // --- Auth & Payments ---
  {
    name: "Stripe",
    category: "Auth & Payments",
    test: () => Boolean(document.querySelector("script[src*='js.stripe.com']")),
    evidence: "Found js.stripe.com script tag",
  },
  {
    name: "PayPal",
    category: "Auth & Payments",
    test: () => Boolean(document.querySelector("script[src*='paypal.com/sdk']")),
    evidence: "Found paypal.com/sdk script tag",
  },
  {
    name: "Clerk",
    category: "Auth & Payments",
    test: () => Boolean(document.querySelector("script[src*='clerk']")),
    evidence: "Found Clerk authentication script tag",
  },

  // --- Backend & BaaS ---
  {
    name: "Firebase",
    category: "Backend & BaaS",
    test: () => Boolean(document.querySelector("script[src*='firebase']")),
    evidence: "Found Firebase SDK script tag",
  },
  {
    name: "Supabase",
    category: "Backend & BaaS",
    test: () => Boolean(document.querySelector("script[src*='supabase']")),
    evidence: "Found Supabase client script asset",
  },

  // --- Build Tools & Bundlers ---
  {
    name: "Vite",
    category: "Build Tools",
    test: () => Boolean(document.querySelector("script[type='module'][src*='@vite']")),
    evidence: "Found @vite/client module script entry point",
  },
  {
    name: "Webpack",
    category: "Build Tools",
    test: () => Boolean(document.querySelector("script[src*='webpack']")),
    evidence: "Found webpack chunk script tag",
  },

  // --- Infrastructure & CDN ---
  {
    name: "Cloudflare",
    category: "Infrastructure & CDN",
    test: () =>
      Boolean(
        document.querySelector("script[src*='cloudflare'], meta[name='cf-ray']") ||
        /cdn-cgi/i.test(document.documentElement.innerHTML.slice(0, 8000))
      ),
    evidence: "Found Cloudflare cdn-cgi path or ray ID meta element",
  },
  {
    name: "Vercel",
    category: "Infrastructure & CDN",
    test: () =>
      Boolean(
        document.querySelector("meta[name='vercel']") ||
        /vercel/i.test(document.documentElement.innerHTML.slice(0, 5000))
      ),
    evidence: "Found Vercel deployment meta headers",
  },
  {
    name: "Netlify",
    category: "Infrastructure & CDN",
    test: () =>
      /netlify/i.test(document.querySelector("meta[name='generator']")?.content || "") ||
      Boolean(document.querySelector("[data-netlify]")),
    evidence: "Found Netlify generator tag or data-netlify attribute",
  }
];

function detectLanguages() {
  const languages = [];
  const html = document.documentElement.innerHTML;
  const scripts = [...document.scripts]
    .map((script) => `${script.src} ${script.type} ${script.textContent.slice(0, 500)}`)
    .join(" ");
  const source = `${location.href} ${html.slice(0, 25000)} ${scripts}`;

  if (/\.php(?:[?#]|$)|phpsessid|application\/x-httpd-php/i.test(source)) {
    languages.push({
      name: "PHP",
      category: "Languages",
      evidence: "Found .php endpoints or PHPSESSID cookie references",
    });
  }
  if (/\.aspx?(?:[?#]|$)|__VIEWSTATE|asp\.net/i.test(source)) {
    languages.push({
      name: "C# / ASP.NET",
      category: "Languages",
      evidence: "Found __VIEWSTATE hidden input or .aspx endpoint URLs",
    });
  }
  if (/_rails|ruby|\.rb(?:[?#]|$)/i.test(source)) {
    languages.push({
      name: "Ruby",
      category: "Languages",
      evidence: "Found Ruby / Rails asset naming patterns",
    });
  }
  if (/\.py(?:[?#]|$)|django|flask|csrftoken/i.test(source)) {
    languages.push({
      name: "Python",
      category: "Languages",
      evidence: "Found Python WSGI/Django CSRF token structures",
    });
  }
  if (/\.ts(?:[?#]|$)|typescript/i.test(source)) {
    languages.push({
      name: "TypeScript",
      category: "Languages",
      evidence: "Found TypeScript transpilation source markers",
    });
  }
  if (/\.js(?:[?#]|$)|javascript|type=["']module["']/i.test(source)) {
    languages.push({
      name: "JavaScript",
      category: "Languages",
      evidence: "Found ECMAScript module script tags or .js bundles",
    });
  }
  if (document.querySelector("style, link[rel='stylesheet'], [style]")) {
    languages.push({
      name: "HTML / CSS",
      category: "Languages",
      evidence: "Found HTML markup and CSS style declarations",
    });
  }

  return languages;
}

function scanPage() {
  const domTechnologies = [];

  signatures.forEach((sig) => {
    try {
      if (sig.test()) {
        const version = sig.getVersion ? sig.getVersion() : null;
        domTechnologies.push({
          name: sig.name,
          category: sig.category,
          version: version || null,
          confidence: "Medium",
          evidence: sig.evidence || "DOM signature match",
        });
      }
    } catch (e) {
      // Safe execution
    }
  });

  const techMap = new Map();

  domTechnologies.forEach((item) => {
    techMap.set(item.name, item);
  });

  injectedTechs.forEach((item) => {
    const existing = techMap.get(item.name) || {};
    techMap.set(item.name, {
      ...existing,
      ...item,
      version: item.version || existing.version || null,
      confidence: "High",
    });
  });

  const finalTechnologies = Array.from(techMap.values());

  const languages = detectLanguages();
  const totalCount = finalTechnologies.length + languages.length;

  try {
    chrome.runtime.sendMessage({ type: "update-badge", count: totalCount });
  } catch (e) {
    // Ignore context invalidated error
  }

  return {
    url: location.href,
    title: document.title || "Untitled page",
    hostname: location.hostname,
    technologies: finalTechnologies,
    languages,
    scannedAt: new Date().toISOString(),
  };
}

// Auto-scan on idle to populate toolbar badge count
setTimeout(() => {
  try {
    scanPage();
  } catch (e) {}
}, 1000);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "scan-page") {
    const data = scanPage();
    sendResponse(data);
  }
  return true;
});
