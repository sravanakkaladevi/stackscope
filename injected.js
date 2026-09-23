(function () {
  if (window.__stackscope_injected) return;
  window.__stackscope_injected = true;

  function getWindowTechs() {
    const detected = [];

    const checks = [
      // --- Frameworks & Meta-Frameworks ---
      {
        name: "React",
        category: "Framework",
        test: () => window.React || document.querySelector("[data-reactroot]"),
        getVersion: () => window.React?.version || null,
        evidence: "window.React or data-reactroot DOM element",
      },
      {
        name: "Next.js",
        category: "Framework",
        test: () => window.__NEXT_DATA__ || window.next,
        getVersion: () => window.__NEXT_DATA__?.version || null,
        evidence: "window.__NEXT_DATA__ object",
      },
      {
        name: "Vue.js",
        category: "Framework",
        test: () => window.Vue || window.__VUE__ || document.querySelector("[data-v-]"),
        getVersion: () => window.Vue?.version || (window.__VUE__ ? "3.x" : null),
        evidence: "window.Vue or window.__VUE__ global",
      },
      {
        name: "Nuxt.js",
        category: "Framework",
        test: () => window.__NUXT__ || window.$nuxt,
        getVersion: () => window.__NUXT__?.config?.version || null,
        evidence: "window.__NUXT__ or window.$nuxt global",
      },
      {
        name: "Angular",
        category: "Framework",
        test: () => window.angular || window.ng,
        getVersion: () => window.angular?.version?.full || null,
        evidence: "window.angular or window.ng global",
      },
      {
        name: "Svelte / SvelteKit",
        category: "Framework",
        test: () => window.__svelte || Boolean(document.querySelector("[class*='svelte-']")),
        getVersion: () => null,
        evidence: "window.__svelte or svelte DOM class markers",
      },
      {
        name: "Astro",
        category: "Framework",
        test: () => window.astro || Boolean(document.querySelector("[data-astro-id]")),
        getVersion: () => null,
        evidence: "window.astro global or data-astro-id attributes",
      },
      {
        name: "Gatsby",
        category: "Framework",
        test: () => window.___gatsby,
        getVersion: () => null,
        evidence: "window.___gatsby global",
      },
      {
        name: "Remix",
        category: "Framework",
        test: () => window.__remixContext,
        getVersion: () => null,
        evidence: "window.__remixContext global",
      },
      {
        name: "Alpine.js",
        category: "Framework",
        test: () => window.Alpine,
        getVersion: () => window.Alpine?.version || null,
        evidence: "window.Alpine global",
      },
      {
        name: "Ember.js",
        category: "Framework",
        test: () => window.Ember || window.Em,
        getVersion: () => window.Ember?.VERSION || null,
        evidence: "window.Ember global",
      },
      {
        name: "Preact",
        category: "Framework",
        test: () => window.preact,
        getVersion: () => null,
        evidence: "window.preact global",
      },

      // --- Libraries & State ---
      {
        name: "jQuery",
        category: "Library",
        test: () => window.jQuery || (window.$ && window.$.fn && window.$.fn.jquery),
        getVersion: () => (window.jQuery || window.$)?.fn?.jquery || null,
        evidence: "window.jQuery or window.$",
      },
      {
        name: "Redux",
        category: "State Management",
        test: () => window.__REDUX_DEVTOOLS_EXTENSION__ || window.__REDUX_STORE__,
        getVersion: () => null,
        evidence: "window.__REDUX_DEVTOOLS_EXTENSION__",
      },
      {
        name: "Zustand",
        category: "State Management",
        test: () => window.__ZUSTAND_STORE__ || Boolean(window.zustand),
        getVersion: () => null,
        evidence: "Zustand state store detected",
      },
      {
        name: "MobX",
        category: "State Management",
        test: () => window.__mobxGlobal || window.mobx,
        getVersion: () => window.mobx?.version || null,
        evidence: "window.__mobxGlobal or window.mobx",
      },
      {
        name: "Apollo Client",
        category: "State Management",
        test: () => window.__APOLLO_CLIENT__,
        getVersion: () => window.__APOLLO_CLIENT__?.version || null,
        evidence: "window.__APOLLO_CLIENT__ object",
      },
      {
        name: "Socket.io",
        category: "Library",
        test: () => window.io && window.io.connect,
        getVersion: () => window.io?.protocol ? `v${window.io.protocol}` : null,
        evidence: "window.io global function",
      },
      {
        name: "Axios",
        category: "Library",
        test: () => window.axios,
        getVersion: () => window.axios?.VERSION || null,
        evidence: "window.axios global object",
      },
      {
        name: "Lodash",
        category: "Library",
        test: () => window._ && typeof window._.map === "function" && window._.VERSION,
        getVersion: () => window._?.VERSION || null,
        evidence: "window._ (Lodash)",
      },
      {
        name: "Moment.js",
        category: "Library",
        test: () => window.moment && typeof window.moment.isMoment === "function",
        getVersion: () => window.moment?.version || null,
        evidence: "window.moment object",
      },

      // --- Styling & UI ---
      {
        name: "Tailwind CSS",
        category: "Styling & UI",
        test: () => window.tailwind,
        getVersion: () => window.tailwind?.version || null,
        evidence: "window.tailwind global script",
      },
      {
        name: "Bootstrap",
        category: "Styling & UI",
        test: () => window.bootstrap || (window.jQuery && window.jQuery.fn && window.jQuery.fn.tooltip && window.jQuery.fn.tooltip.Constructor),
        getVersion: () => window.bootstrap?.Tooltip?.VERSION || window.jQuery?.fn?.tooltip?.Constructor?.VERSION || null,
        evidence: "window.bootstrap object",
      },

      // --- CMS & Commerce ---
      {
        name: "WordPress",
        category: "CMS & Commerce",
        test: () => window.wp || window.wpApiSettings,
        getVersion: () => null,
        evidence: "window.wp / window.wpApiSettings",
      },
      {
        name: "Shopify",
        category: "CMS & Commerce",
        test: () => window.Shopify,
        getVersion: () => null,
        evidence: "window.Shopify global object",
      },
      {
        name: "Webflow",
        category: "CMS & Commerce",
        test: () => window.Webflow,
        getVersion: () => null,
        evidence: "window.Webflow global object",
      },
      {
        name: "Wix",
        category: "CMS & Commerce",
        test: () => window.wixBiSession || window.wixDeveloperAnalytics,
        getVersion: () => null,
        evidence: "window.wixBiSession",
      },
      {
        name: "WooCommerce",
        category: "CMS & Commerce",
        test: () => window.woocommerce_params || window.wc_single_product_params,
        getVersion: () => null,
        evidence: "window.woocommerce_params",
      },

      // --- Analytics & Marketing ---
      {
        name: "Google Analytics",
        category: "Analytics & Marketing",
        test: () => window.google_tag_manager || window.ga || window.gtag || window.GoogleAnalyticsObject,
        getVersion: () => null,
        evidence: "window.ga, window.gtag, or google_tag_manager",
      },
      {
        name: "Google Tag Manager",
        category: "Analytics & Marketing",
        test: () => window.google_tag_manager,
        getVersion: () => null,
        evidence: "window.google_tag_manager object",
      },
      {
        name: "Mixpanel",
        category: "Analytics & Marketing",
        test: () => window.mixpanel,
        getVersion: () => window.mixpanel?.__version || null,
        evidence: "window.mixpanel global",
      },
      {
        name: "PostHog",
        category: "Analytics & Marketing",
        test: () => window.posthog,
        getVersion: () => window.posthog?.__version || null,
        evidence: "window.posthog global",
      },
      {
        name: "Hotjar",
        category: "Analytics & Marketing",
        test: () => window.hj,
        getVersion: () => null,
        evidence: "window.hj function",
      },
      {
        name: "Intercom",
        category: "Analytics & Marketing",
        test: () => window.Intercom,
        getVersion: () => null,
        evidence: "window.Intercom global",
      },
      {
        name: "Segment",
        category: "Analytics & Marketing",
        test: () => window.analytics && typeof window.analytics.track === "function",
        getVersion: () => null,
        evidence: "window.analytics (Segment)",
      },
      {
        name: "Crisp",
        category: "Analytics & Marketing",
        test: () => window.$crisp,
        getVersion: () => null,
        evidence: "window.$crisp global",
      },

      // --- Auth & Payments ---
      {
        name: "Stripe",
        category: "Auth & Payments",
        test: () => window.Stripe,
        getVersion: () => window.Stripe?.version || null,
        evidence: "window.Stripe global",
      },
      {
        name: "PayPal",
        category: "Auth & Payments",
        test: () => window.paypal,
        getVersion: () => window.paypal?.version || null,
        evidence: "window.paypal global",
      },
      {
        name: "Clerk",
        category: "Auth & Payments",
        test: () => window.Clerk || window.__clerk_db_jwt,
        getVersion: () => window.Clerk?.version || null,
        evidence: "window.Clerk object",
      },
      {
        name: "Auth0",
        category: "Auth & Payments",
        test: () => window.Auth0 || window.auth0,
        getVersion: () => null,
        evidence: "window.Auth0 object",
      },

      // --- Backend & BaaS ---
      {
        name: "Firebase",
        category: "Backend & BaaS",
        test: () => window.firebase,
        getVersion: () => window.firebase?.SDK_VERSION || null,
        evidence: "window.firebase object",
      },
      {
        name: "Supabase",
        category: "Backend & BaaS",
        test: () => window.supabase || window.__SUPABASE__,
        getVersion: () => null,
        evidence: "window.supabase object",
      },

      // --- Build Tools & Infrastructure ---
      {
        name: "Vite",
        category: "Build Tools",
        test: () => window.__vite_plugin_react_preamble_installed__ || window.__VITE__ || Boolean(document.querySelector("script[type='module'][src*='/@vite/client']")),
        getVersion: () => null,
        evidence: "Vite dev client script / preamble signature",
      },
      {
        name: "Webpack",
        category: "Build Tools",
        test: () => window.webpackChunk || window.webpackJsonp || window.__webpack_require__,
        getVersion: () => null,
        evidence: "window.webpackChunk / __webpack_require__",
      },
      {
        name: "Parcel",
        category: "Build Tools",
        test: () => window.parcelRequire,
        getVersion: () => null,
        evidence: "window.parcelRequire",
      }
    ];

    checks.forEach(({ name, category, test, getVersion, evidence }) => {
      try {
        if (test()) {
          const version = getVersion ? getVersion() : null;
          detected.push({
            name,
            category,
            version: version ? String(version) : null,
            confidence: "High",
            evidence: evidence || "JavaScript window signature",
          });
        }
      } catch (e) {
        // Safe check execution
      }
    });

    return detected;
  }

  // Post detected technologies to content script
  window.postMessage(
    { source: "stackscope-injected", data: getWindowTechs() },
    "*"
  );
})();
