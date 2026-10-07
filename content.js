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

function hasScriptOrResource(pattern) {
  const scripts = Array.from(document.scripts).some((script) => pattern.test(script.src));
  if (scripts) return true;

  try {
    return performance.getEntriesByType("resource").some((entry) => pattern.test(entry.name));
  } catch (e) {
    return false;
  }
}

function hasTailwindSignatures() {
  if (Array.from(document.querySelectorAll("style")).some((style) => style.textContent.includes("--tw-"))) {
    return true;
  }

  return Array.from(document.querySelectorAll("[class]")).slice(0, 2000).some((element) => {
    const classes = Array.from(element.classList);
    const utilities = classes.filter((className) =>
      /^(?:-?(?:flex|grid|block|hidden|items-|justify-|text-(?:xs|sm|base|lg|xl|[2-9]xl)|bg-|rounded|p-|px-|py-|m-|mx-|my-|w-|h-|gap-|space-|font-|leading-|border|shadow|ring-))/.test(className)
    );
    const responsive = classes.some((className) => /^(?:sm|md|lg|xl|2xl):/.test(className));
    return utilities.length >= 3 || (responsive && utilities.length > 0);
  });
}

const signatures = [
  // --- Frameworks & Meta-Frameworks ---
  {
    name: "Google Closure Library",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[jsaction], [jscontroller], [jsmodel], [jsname], [data-wiz-name]") ||
        /goog\.base|goog\.provide|goog\.require/i.test(document.documentElement.innerHTML.slice(0, 10000))
      ),
    evidence: "Found Google Closure Library DOM attributes or goog object structure",
  },
  {
    name: "Google Wiz UI Framework",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[data-wiz-name], [jsaction]")
      ),
    evidence: "Found Google Wiz component action/controller attributes",
  },
  {
    name: "Next.js",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("#__next, script[src*='_next/'], link[href*='_next/'], meta[name='next-size-adjust']")
      ),
    evidence: "Found #__next container, Next.js metadata, or _next/ bundle assets",
  },
  {
    name: "React",
    category: "Framework",
    test: () =>
      Boolean(
        document.querySelector("[data-reactroot], [data-reactid], #__next, script[src*='_next/'], link[href*='_next/']")
      ) ||
      Array.from(document.querySelectorAll("*"))
        .slice(0, 200)
        .some((el) => Object.keys(el).some((k) => k.startsWith("__reactFiber$") || k.startsWith("__reactContainer$"))),
    evidence: "Found React root markers, fiber properties, or Next.js application assets",
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
        hasScriptOrResource(/tailwind(?:css)?(?:\.com|\/|[-.])/i) ||
        hasTailwindSignatures()
      ),
    evidence: "Found Tailwind stylesheet/resource or generated utility CSS signatures",
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
    category: "Issue Trackers",
    test: () => hasScriptOrResource(/(?:sentry|@sentry)/i),
    evidence: "Found a Sentry SDK or Sentry-hosted resource",
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
  },
  {
    name: "VWO",
    category: "A/B Testing",
    test: () =>
      hasScriptOrResource(/(?:visualwebsiteoptimizer|vwo\.com|vwo\/)/i) ||
      Boolean(document.querySelector("script[id*='vwo'], [data-vwo]")),
    evidence: "Found a Visual Website Optimizer script, resource, or page marker",
  },
  {
    name: "hCaptcha",
    category: "Security",
    test: () =>
      hasScriptOrResource(/hcaptcha\.com/i) ||
      Boolean(document.querySelector(".h-captcha, iframe[src*='hcaptcha.com'], [data-hcaptcha]")),
    evidence: "Found hCaptcha script, iframe, or widget marker",
  },
  {
    name: "Microsoft Advertising",
    category: "Advertising",
    test: () => hasScriptOrResource(/bat\.bing\.com\/(?:bat\.js|action\/)/i),
    evidence: "Found the Microsoft Advertising UET tracking resource",
  },
  {
    name: "Howler.js",
    category: "JavaScript Libraries",
    test: () => hasScriptOrResource(/(?:howler(?:\.min)?\.js|howler\.js)/i),
    evidence: "Found a Howler.js script or loaded resource",
  },
  {
    name: "Framer Motion",
    category: "JavaScript Libraries",
    test: () => hasScriptOrResource(/(?:framer-motion|motion\/dist\/)/i),
    evidence: "Found a Framer Motion package or runtime resource",
  },
  {
    name: "Cookiebot",
    category: "Cookie Compliance",
    test: () =>
      hasScriptOrResource(/consent\.cookiebot\.com|consentcdn\.cookiebot\.com/i) ||
      Boolean(window.Cookiebot || document.querySelector("#Cookiebot")),
    evidence: "Found Cookiebot consent script or widget",
  },
  {
    name: "Cookie Control",
    category: "Cookie Compliance",
    test: () =>
      hasScriptOrResource(/cookiecontrol|civicuk\.com/i) ||
      Boolean(document.querySelector("#ccc, [data-cookie-control]")),
    evidence: "Found Civic Cookie Control script or widget marker",
  },
  {
    name: "PartnerStack",
    category: "Affiliate Programs",
    test: () => hasScriptOrResource(/(?:partnerstack|ps-st\.com)/i),
    evidence: "Found a PartnerStack script or resource",
  },
  {
    name: "PWA",
    category: "Miscellaneous",
    test: () =>
      Boolean(document.querySelector("link[rel='manifest']")) ||
      Boolean(navigator.serviceWorker && navigator.serviceWorker.controller),
    evidence: "Found a web app manifest link or an active service worker controller",
  },
  {
    name: "Open Graph",
    category: "Miscellaneous",
    test: () => Boolean(document.querySelector("meta[property='og:title'], meta[property='og:type']")),
    evidence: "Found Open Graph title or type metadata",
  },
  {
    name: "HTTP/3",
    category: "Network Protocols",
    test: () => {
      try {
        return performance.getEntriesByType("resource").some((entry) => entry.nextHopProtocol === "h3");
      } catch (e) {
        return false;
      }
    },
    evidence: "A loaded resource reported h3 through the Resource Timing API",
  },
  {
    name: "Priority Hints",
    category: "Performance",
    test: () => Boolean(document.querySelector("[fetchpriority], [fetchPriority]")),
    evidence: "Found fetchpriority attributes on page resources",
  },
  {
    name: "Base UI",
    category: "Styling & UI",
    test: () =>
      hasScriptOrResource(/(?:@base-ui|base-ui(?:\/|[-.]|$))/i) ||
      Boolean(document.querySelector("[data-base-ui]")),
    evidence: "Found a Base UI package resource or explicit DOM marker",
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

let headerTechs = [];
function fetchHeaderTechs() {
  try {
    chrome.runtime.sendMessage({ type: "get-header-techs" }, (response) => {
      if (response && response.techs) {
        headerTechs = response.techs;
      }
    });
  } catch (e) {}
}
fetchHeaderTechs();

function detectHostingByDomain() {
  const host = location.hostname.toLowerCase();
  const html = document.documentElement.innerHTML.slice(0, 20000);
  const techs = [];

  // Google domain / services
  if (/(?:^|\.)google\.com$|(?:^|\.)google\.co\.|mail\.google\.com|docs\.google\.com|drive\.google\.com|youtube\.com/i.test(host)) {
    techs.push({
      name: "Google Cloud / Infrastructure",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Domain hostname match: ${host}`,
    });
    techs.push({
      name: "Google Workspace",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Google Workspace web application: ${host}`,
    });
  } else if (/gstatic\.com|storage\.googleapis\.com|googleusercontent\.com/i.test(html)) {
    techs.push({
      name: "Google Cloud / Infrastructure",
      category: "Infrastructure & Hosting",
      confidence: "Medium",
      evidence: "Found assets loaded from Google Cloud / gstatic CDN",
    });
  }

  // Vercel
  if (/(?:^|\.)vercel\.(?:app|dev)$/i.test(host)) {
    techs.push({
      name: "Vercel",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Vercel sub-domain host match: ${host}`,
    });
  }

  // Netlify
  if (/(?:^|\.)netlify\.(?:app|com)$/i.test(host)) {
    techs.push({
      name: "Netlify",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Netlify sub-domain host match: ${host}`,
    });
  }

  // GitHub Pages
  if (/(?:^|\.)github\.io$/i.test(host)) {
    techs.push({
      name: "GitHub Pages",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `GitHub Pages sub-domain host match: ${host}`,
    });
  }

  // Cloudflare Pages
  if (/(?:^|\.)pages\.dev$/i.test(host)) {
    techs.push({
      name: "Cloudflare Pages",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Cloudflare Pages sub-domain host match: ${host}`,
    });
    techs.push({
      name: "Cloudflare",
      category: "Infrastructure & CDN",
      confidence: "High",
      evidence: "Cloudflare Pages infrastructure match",
    });
  }

  // Firebase Hosting
  if (/(?:^|\.)firebaseapp\.com$|(?:^|\.)web\.app$/i.test(host)) {
    techs.push({
      name: "Firebase Hosting",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Firebase Hosting domain match: ${host}`,
    });
  }

  // Render
  if (/(?:^|\.)onrender\.com$/i.test(host)) {
    techs.push({
      name: "Render",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Render host match: ${host}`,
    });
  }

  // Fly.io
  if (/(?:^|\.)fly\.dev$/i.test(host)) {
    techs.push({
      name: "Fly.io",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Fly.io host match: ${host}`,
    });
  }

  // Heroku
  if (/(?:^|\.)herokuapp\.com$/i.test(host)) {
    techs.push({
      name: "Heroku",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Heroku host match: ${host}`,
    });
  }

  // Azure
  if (/(?:^|\.)azurewebsites\.net$|(?:^|\.)azureedge\.net$/i.test(host)) {
    techs.push({
      name: "Microsoft Azure",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Microsoft Azure host match: ${host}`,
    });
  }

  // AWS asset matching
  if (/s3\.amazonaws\.com|cloudfront\.net/i.test(html)) {
    techs.push({
      name: "Amazon Web Services (AWS)",
      category: "Infrastructure & Hosting",
      confidence: "Medium",
      evidence: "Found AWS S3 or CloudFront asset URL in page markup",
    });
  }

  // WP Engine
  if (/(?:^|\.)wpengine\.com$/i.test(host)) {
    techs.push({
      name: "WP Engine",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `WP Engine host match: ${host}`,
    });
  }

  // Kinsta
  if (/(?:^|\.)kinsta\.cloud$/i.test(host)) {
    techs.push({
      name: "Kinsta",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Kinsta host match: ${host}`,
    });
  }

  // Pantheon
  if (/(?:^|\.)pantheonsite\.io$/i.test(host)) {
    techs.push({
      name: "Pantheon",
      category: "Infrastructure & Hosting",
      confidence: "High",
      evidence: `Pantheon host match: ${host}`,
    });
  }

  // Shopify
  if (/(?:^|\.)myshopify\.com$/i.test(host) || /cdn\.shopify\.com/i.test(html)) {
    techs.push({
      name: "Shopify",
      category: "CMS & Commerce",
      confidence: "High",
      evidence: `Shopify domain or CDN asset signature: ${host}`,
    });
  }

  // Wix
  if (/(?:^|\.)wixsite\.com$|(?:^|\.)wix\.com$/i.test(host)) {
    techs.push({
      name: "Wix",
      category: "CMS & Commerce",
      confidence: "High",
      evidence: `Wix domain match: ${host}`,
    });
  }

  // Squarespace
  if (/(?:^|\.)squarespace\.com$/i.test(host) || /static1\.squarespace\.com/i.test(html)) {
    techs.push({
      name: "Squarespace",
      category: "CMS & Commerce",
      confidence: "High",
      evidence: `Squarespace host or static asset match: ${host}`,
    });
  }

  // Webflow
  if (/(?:^|\.)webflow\.io$/i.test(host) || /assets\.website-files\.com/i.test(html)) {
    techs.push({
      name: "Webflow",
      category: "CMS & Commerce",
      confidence: "High",
      evidence: `Webflow host or CDN asset match: ${host}`,
    });
  }

  return techs;
}

function scanPage() {
  fetchHeaderTechs();
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

  const domainHostingTechs = detectHostingByDomain();
  const techMap = new Map();

  domTechnologies.forEach((item) => {
    techMap.set(item.name, item);
  });

  domainHostingTechs.forEach((item) => {
    techMap.set(item.name, item);
  });

  headerTechs.forEach((item) => {
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
    fetchHeaderTechs();
    setTimeout(() => {
      const data = scanPage();
      sendResponse(data);
    }, 50);
    return true;
  }
  return true;
});

