const TECH_ICONS = {
  // --- Frameworks ---
  React: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="4.2" ry="10" transform="rotate(30 12 12)" stroke="#61DAFB" stroke-width="1.6"/>
    <ellipse cx="12" cy="12" rx="4.2" ry="10" transform="rotate(90 12 12)" stroke="#61DAFB" stroke-width="1.6"/>
    <ellipse cx="12" cy="12" rx="4.2" ry="10" transform="rotate(150 12 12)" stroke="#61DAFB" stroke-width="1.6"/>
    <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
  </svg>`,

  "Next.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#000" stroke="#333" stroke-width="1.2"/>
    <path d="M14.9 16.5L9.5 9v7.5H8V7.5h1.8l5.4 7.6V7.5h1.5v9h-1.8z" fill="#FFF"/>
    <path d="M14.5 12l2-2.5" stroke="#FFF" stroke-width="1.5"/>
  </svg>`,

  "Vue.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3h4l6 10.5L18 3h4L12 21 2 3z" fill="#4FC08D"/>
    <path d="M6 3h3.5L12 8.5 14.5 3H18L12 13.5 6 3z" fill="#35495E"/>
  </svg>`,

  "Nuxt.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 19l8.5-14 8.5 14H1.5z" fill="#00DC82"/>
    <path d="M8 19l6.5-11L21 19H8z" fill="#00C58E"/>
  </svg>`,

  Angular: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5L2 6l1.5 13L12 22.5 20.5 19 22 6 12 2.5z" fill="#DD0031"/>
    <path d="M12 2.5v19.9l8.5-3.5L22 6 12 2.5z" fill="#C3002F"/>
    <path d="M12 5.5L6.5 17h2.2l1.1-2.8h4.4l1.1 2.8h2.2L12 5.5zm-1.2 6.8l1.2-3 1.2 3h-2.4z" fill="#FFF"/>
  </svg>`,

  "Svelte / SvelteKit": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.8 4.6a5.5 5.5 0 0 0-7.6 1.8l-1.4 2.3a.5.5 0 0 0 .1.6l2 1.3a.5.5 0 0 0 .6-.1l1.4-2.3a2.5 2.5 0 0 1 3.4-.8 2.5 2.5 0 0 1 1 3.4l-4.5 7.4a2.5 2.5 0 0 1-3.4.8 2.5 2.5 0 0 1-1-3.4l.7-1.1a.5.5 0 0 0-.1-.6l-2-1.3a.5.5 0 0 0-.6.1l-.7 1.1a5.5 5.5 0 0 0 1.8 7.6 5.5 5.5 0 0 0 7.6-1.8l4.5-7.4a5.5 5.5 0 0 0-1.8-7.6z" fill="#FF3E00"/>
  </svg>`,

  Remix: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17l6-10 5 6 7-9" stroke="#E8F1F5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 17l4-5 3 4" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  Astro: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 20h4l1.8-4.5h4.4L16 20h4L12 2zm-1 9.5l1-2.5 1 2.5h-2z" fill="#FF5D01"/>
    <path d="M12 2a10 10 0 0 1 8 4" stroke="#BC52EE" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  Gatsby: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#663399"/>
    <path d="M17.5 16.5A7.5 7.5 0 1 1 19.5 12h-7.5v2.5h5a5 5 0 1 1-1.2 3.8l1.7 1.2z" fill="#FFF"/>
  </svg>`,

  "Alpine.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 12l4.5 4.5H13L17.5 12zM6.5 7.5L15.5 16.5H6.5V7.5z" fill="#77C1D2"/>
  </svg>`,

  "Ember.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 7.5c-1 0-2.5 1-3.5 2.5L12 17l-4.5-6C6.5 9.5 5 8.5 4 8.5" stroke="#E04E39" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  Preact: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#673AB8"/>
    <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(30 12 12)" stroke="#FFF" stroke-width="1.2"/>
    <ellipse cx="12" cy="12" rx="4" ry="8" transform="rotate(-30 12 12)" stroke="#FFF" stroke-width="1.2"/>
  </svg>`,

  "Solid.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16l8-4 8 4-8 4-8-4z" fill="#446B9E"/>
    <path d="M4 8l8-4 8 4-8 4-8-4z" fill="#76ADDB"/>
  </svg>`,

  HTMX: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#336699"/>
    <text x="4" y="16" font-family="sans-serif" font-weight="bold" font-size="10" fill="#FFF">htmx</text>
  </svg>`,

  jQuery: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#0769AD"/>
    <path d="M6 8h4.5v1.8H8v6.4H6V8zm6 0h5v1.8h-3v1.8h2.6v1.7H14v1.2h3.2V16H12V8z" fill="#FFF"/>
  </svg>`,

  // --- State & Libraries ---
  Redux: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" fill="#764ABC"/>
  </svg>`,

  Zustand: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#443E38"/>
    <circle cx="9" cy="10" r="2" fill="#FFF"/>
    <circle cx="15" cy="10" r="2" fill="#FFF"/>
    <path d="M9 15s1.5 2 3 2 3-2 3-2" stroke="#FFF" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  MobX: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l9 5v9l-9 5-9-5V8l9-5z" fill="#FF6F00"/>
    <circle cx="12" cy="12" r="4" fill="#FFF"/>
  </svg>`,

  "Apollo Client": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#311C87"/>
    <path d="M12 4l6 14H6l6-14z" fill="#E535AB"/>
  </svg>`,

  "Socket.io": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#000" stroke="#FFF" stroke-width="1"/>
    <path d="M13 5l-5 8h4l-1 6 5-8h-4l1-6z" fill="#FFF"/>
  </svg>`,

  Axios: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#5A29E4"/>
    <path d="M7 16l5-8 5 8H7z" fill="#FFF"/>
  </svg>`,

  Lodash: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#3492FF"/>
    <path d="M7 6v12h10" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  "Moment.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#00D2B4"/>
    <path d="M12 7v5l3 3" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  // --- Styling & UI ---
  "Tailwind CSS": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 1 .2 1.6 1 2.3 1.7C13.6 11.8 15 13.2 18 13.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-1-.2-1.6-1-2.3-1.7C16.4 7.4 15 6 12 6zm-6 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 1 .2 1.6 1 2.3 1.7C7.6 17.8 9 19.2 12 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-1-.2-1.6-1-2.3-1.7C10.4 13.4 9 12 6 12z" fill="#38BDF8"/>
  </svg>`,

  Bootstrap: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#7952B3"/>
    <path d="M7 6h5.3c2.4 0 3.7 1.1 3.7 2.7 0 1.3-.8 2.2-2 2.5v.1c1.5.3 2.4 1.3 2.4 2.8 0 1.8-1.5 2.9-4 2.9H7V6zm3 4.2h2.1c1 0 1.6-.4 1.6-1.1 0-.7-.6-1.1-1.6-1.1H10v2.2zm0 4.8h2.4c1.1 0 1.8-.4 1.8-1.2 0-.8-.7-1.2-1.8-1.2H10v2.4z" fill="#FFF"/>
  </svg>`,

  "Material UI (MUI)": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 2.472l12 6.919V24L0 17.081V2.472z" fill="#0081CB"/>
    <path d="M12 9.391l12-6.919v14.609L12 24V9.391z" fill="#00B0FF"/>
    <path d="M12 9.391l6-3.46v6.919l-6 3.46V9.391z" fill="#FFF" fill-opacity="0.4"/>
  </svg>`,

  "Shadcn UI / Radix": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#000" stroke="#333" stroke-width="1"/>
    <path d="M6 18L18 6M6 6h12v12" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  "Chakra UI": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#319795"/>
    <path d="M12 6a6 6 0 1 0 6 6h-6V6z" fill="#FFF"/>
  </svg>`,

  "Ant Design": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l6.5 6.5-6.5 6.5-6.5-6.5L12 6.5z" fill="#1890FF"/>
  </svg>`,

  "Styled Components": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#DB7093"/>
    <text x="6" y="16" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFF">💅</text>
  </svg>`,

  Emotion: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#D26AC2"/>
    <circle cx="8.5" cy="9.5" r="1.5" fill="#FFF"/>
    <circle cx="15.5" cy="9.5" r="1.5" fill="#FFF"/>
    <path d="M8 14.5s1.5 2.5 4 2.5 4-2.5 4-2.5" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  "Font Awesome": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7l10 15 10-15-10-5z" fill="#339AF0"/>
  </svg>`,

  "Lucide Icons": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#F43F5E"/>
    <path d="M12 6v12M6 12h12" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  // --- CMS & Commerce ---
  WordPress: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#21759B"/>
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-6.6 9c0-1.4.5-2.7 1.3-3.7l3.8 10.4A9 9 0 0 1 5.4 12zm6.6 8a8.9 8.9 0 0 1-2.4-.3l2-5.7 2 5.5a9 9 0 0 1-1.6.5zm1.5-4l2.5-7.2a9 9 0 0 1 3.1 6.2c0 2.3-.9 4.3-2.3 5.8L13.5 16z" fill="#FFF"/>
  </svg>`,

  Shopify: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8 4.2c-.1-.1-.3 0-.4.1l-1.3 1.3s-.9-.8-2-1c0 0-1.7-.3-2.3 1.2 0 0-.5 1.1-.1 2.7l-4.1.8-1 3.2 2.7.5s-1.8 6.9 5.3 7c0 0 5.4.2 6.4-5.2.8-4.4-1.9-9-3.2-10.6z" fill="#95BF47"/>
    <path d="M15.4 6.6L12.3 16s-2.1.2-3.1-1.5c0 0 2.8-.7 3.3-3.5l1.6-6.4 1.3 2z" fill="#5E8E3E"/>
  </svg>`,

  Webflow: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 6.5L13 17.5h-3L7 11.5 4 17.5H1L6 6.5h3l3 6 3.5-6h2z" fill="#146EF5"/>
    <path d="M23 6.5l-5 11h-3l3.5-6-3.5-5H18l2 3.5 2-3.5h1z" fill="#146EF5"/>
  </svg>`,

  Wix: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#000"/>
    <text x="4" y="16" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FFF">WiX</text>
  </svg>`,

  Squarespace: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#111"/>
    <path d="M7 15l5-5 5 5M7 9l5 5 5-5" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  Ghost: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#15171A"/>
    <path d="M12 4a6 6 0 0 0-6 6v8l3-2 3 2 3-2 3 2v-8a6 6 0 0 0-6-6z" fill="#15171A" stroke="#738A94" stroke-width="1.8"/>
  </svg>`,

  WooCommerce: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#96588A"/>
    <path d="M5 9h14v6H5V9z" fill="#FFF"/>
  </svg>`,

  Strapi: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 10l8 8 8-8-8-8z" fill="#4945FF"/>
  </svg>`,

  // --- Analytics & Marketing ---
  "Google Analytics": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#E37400"/>
    <path d="M18 19V9h-3v10h3zm-5 0V5h-3v14h3zM8 19v-6H5v6h3z" fill="#FFF"/>
  </svg>`,

  "Google Tag Manager": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#246FDB"/>
    <path d="M12 4L4 12l8 8 8-8-8-8zm0 4l4 4-4 4-4-4 4-4z" fill="#FFF"/>
  </svg>`,

  Mixpanel: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#7856FF"/>
    <circle cx="8" cy="12" r="2" fill="#FFF"/>
    <circle cx="13" cy="12" r="1.5" fill="#FFF"/>
    <circle cx="17" cy="12" r="1" fill="#FFF"/>
  </svg>`,

  Hotjar: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 6 5 6 9c0 5 6 13 6 13s6-8 6-13c0-4-2-7-6-7z" fill="#FF3C00"/>
    <circle cx="12" cy="9" r="3" fill="#FFF"/>
  </svg>`,

  PostHog: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#1D4ED8"/>
    <path d="M6 16V8l6 4 6-4v8l-6 4-6-4z" fill="#F59E0B"/>
  </svg>`,

  Intercom: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#1F8CEB"/>
    <path d="M7 8h10v6H7V8zm2 8h6v2H9v-2z" fill="#FFF"/>
  </svg>`,

  Segment: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#52BD95"/>
    <circle cx="12" cy="12" r="5" stroke="#FFF" stroke-width="2"/>
  </svg>`,

  Sentry: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L2 19h20L12 3z" stroke="#362D59" fill="#FB4226" stroke-width="1.5"/>
  </svg>`,

  // --- Auth & Payments ---
  Stripe: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#635BFF"/>
    <path d="M13.8 10.5c0-.6-.5-1-1.3-1-1.2 0-2.3.4-3.1.9V8c.9-.4 2.1-.7 3.3-.7 2.3 0 3.8 1.1 3.8 2.9 0 2.8-3.8 2.9-3.8 4.3 0 .7.6 1 1.5 1 1.3 0 2.6-.5 3.5-1.1v2.5c-1 .5-2.4.8-3.7.8-2.5 0-4-1.2-4-3 0-2.9 3.8-3 3.8-4.2z" fill="#FFF"/>
  </svg>`,

  PayPal: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#003087"/>
    <path d="M7 6h5c2 0 3.5 1 3 3s-2.5 3-4.5 3H8.5L7 18H5L7 6z" fill="#0079C1"/>
  </svg>`,

  Clerk: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#6C47FF"/>
    <circle cx="12" cy="9" r="3" fill="#FFF"/>
    <path d="M6 18c0-3 3-4 6-4s6 1 6 4" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  Auth0: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" fill="#EB5424"/>
  </svg>`,

  // --- Backend & BaaS ---
  Firebase: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.8 17.7L7.5 3.2a.8.8 0 0 1 1.5.1l2.4 4.8 2.2-4.1a.8.8 0 0 1 1.4.1l5.2 13.6-8.2 4.6a2 2 0 0 1-2 0l-6-4.6z" fill="#FFCA28"/>
    <path d="M11.4 8.2l-2.4-4.9a.8.8 0 0 0-1.5-.1L3.8 17.7l7.6-9.5z" fill="#FFA000"/>
    <path d="M12 22.4a2 2 0 0 0 1-.3l7.2-4.4-5.2-13.6a.8.8 0 0 0-1.4-.1L12 8.2v14.2z" fill="#F57C00"/>
  </svg>`,

  Supabase: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.4 2.3c-.6-.7-1.8-.3-1.8.7v8.5H3.8c-.8 0-1.3.9-.8 1.5l8.4 10c.6.7 1.8.3 1.8-.7v-8.5h7.8c.8 0 1.3-.9.8-1.5l-8.4-10z" fill="#3ECF8E"/>
  </svg>`,

  // --- Build Tools & Infra ---
  Vite: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 4L12 21 3 4l9 3 9-3z" fill="#646CFF"/>
    <path d="M13 7l-5 8h4l-1 5 6-9h-4l1-4z" fill="#FFD43B"/>
  </svg>`,

  Webpack: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l8.7 5v10L12 22 3.3 17V7L12 2z" fill="#8ED6FB"/>
    <path d="M12 4.3L6.5 7.5v6.4L12 17.1l5.5-3.2V7.5L12 4.3z" fill="#1C78C0"/>
  </svg>`,

  Cloudflare: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.4 12.5A4.5 4.5 0 0 0 11 11a6 6 0 0 0-5.8 4.6A4 4 0 0 0 6 23h13.5a3.5 3.5 0 0 0 0-7h-.1z" fill="#F38020"/>
    <path d="M18.5 16.5l2-2.5h-5l1 2.5z" fill="#FAAE40"/>
  </svg>`,

  Vercel: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L22 20H2L12 2z" fill="#FFF"/>
  </svg>`,

  Netlify: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#00C7B7"/>
    <path d="M12 4l6 6-6 6-6-6 6-6zm0 16l-4-4 4-4 4 4-4 4z" fill="#FFF"/>
  </svg>`,

  "Google Cloud / Infrastructure": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
    <path d="M19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" fill="#FFF"/>
  </svg>`,

  "Google Workspace": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#1A73E8"/>
    <path d="M6 16.5l4-7.5h8l-4 7.5H6z" fill="#EA4335"/>
    <path d="M6 7.5l4 7.5h8l-4-7.5H6z" fill="#34A853"/>
  </svg>`,

  "Google Closure Library": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#4285F4"/>
    <text x="12" y="16" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FFF" text-anchor="middle">goog</text>
  </svg>`,

  "Google Wiz UI Framework": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#34A853"/>
    <text x="12" y="16" font-family="sans-serif" font-weight="bold" font-size="10" fill="#FFF" text-anchor="middle">Wiz</text>
  </svg>`,

  "GitHub Pages": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#24292E"/>
    <path d="M12 4a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.7 7.7 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.7 4 .3.3.6.8.6 1.6v2.4c0 .2.1.5.6.4A8 8 0 0 0 12 4z" fill="#FFF"/>
  </svg>`,

  "Cloudflare Pages": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#F38020"/>
    <path d="M12 4l7 12H5l7-12z" fill="#FFF"/>
  </svg>`,

  "Amazon Web Services (AWS)": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#232F3E"/>
    <path d="M6 14.5c3 2 8 2 12 0" stroke="#FF9900" stroke-width="2" stroke-linecap="round"/>
    <path d="M16 13.5l3 1.5-1.5-3" fill="#FF9900"/>
  </svg>`,

  "Firebase Hosting": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.8 17.7L7.5 3.2a.8.8 0 0 1 1.5.1l2.4 4.8 2.2-4.1a.8.8 0 0 1 1.4.1l5.2 13.6-8.2 4.6a2 2 0 0 1-2 0l-6-4.6z" fill="#FFCA28"/>
  </svg>`,

  Render: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#46E3B7"/>
    <path d="M7 17V7h5a3 3 0 0 1 0 6H7v4h3" stroke="#000" stroke-width="2"/>
  </svg>`,

  "Fly.io": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#24185B"/>
    <path d="M6 16L12 6l6 10H6z" fill="#7B3FE4"/>
  </svg>`,

  Heroku: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#430098"/>
    <path d="M7 6v12M17 6v12M7 12h10" stroke="#FFF" stroke-width="2.5"/>
  </svg>`,

  "Microsoft Azure": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19h7.5L16.5 5H10L4 19zm8.5-7.5L18.5 19H20L15.5 8l-3 3.5z" fill="#0089D6"/>
  </svg>`,

  "WP Engine": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#00CCB4"/>
    <text x="12" y="16" font-family="sans-serif" font-weight="bold" font-size="11" fill="#000" text-anchor="middle">WPE</text>
  </svg>`,

  Kinsta: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#5340FF"/>
    <text x="12" y="16" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FFF" text-anchor="middle">K</text>
  </svg>`,

  Pantheon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#EF443B"/>
    <circle cx="12" cy="12" r="6" stroke="#FFF" stroke-width="2"/>
  </svg>`,

  Nginx: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#009639"/>
    <path d="M7 17V7l10 10V7" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  Apache: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#D22128"/>
    <path d="M12 4c-3 4-5 8-5 12h10c0-4-2-8-5-12z" fill="#FFF"/>
  </svg>`,

  LiteSpeed: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#003566"/>
    <path d="M6 14l6-8 6 8h-4v4h-4v-4H6z" fill="#00A8E8"/>
  </svg>`,

  Caddy: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#222"/>
    <circle cx="12" cy="12" r="6" stroke="#00D2FF" stroke-width="2.5"/>
  </svg>`,

  "Express.js": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#000"/>
    <text x="12" y="16" font-family="sans-serif" font-weight="bold" font-size="9" fill="#FFF" text-anchor="middle">express</text>
  </svg>`,


  // --- Languages ---
  JavaScript: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
    <path d="M12 18.5c.8.5 1.7.8 2.7.8 1.4 0 2.2-.7 2.2-1.7 0-1.2-1-1.6-2.5-2.2l-.7-.3c-2.1-.9-3.4-2-3.4-4.3 0-2.4 1.9-4.1 4.9-4.1 1.3 0 2.4.3 3.3.8l-1 2.3c-.7-.4-1.6-.7-2.4-.7-1.2 0-1.9.6-1.9 1.4 0 1 1 1.4 2.5 2l.7.3c2.4 1 3.5 2.1 3.5 4.5 0 2.7-2.1 4.3-5.4 4.3-1.6 0-3-.4-4-1l1-2.3zm-6.2-.2c.8.5 1.8.8 2.8.8 1.4 0 2.1-.6 2.1-2.3V6.8H13.6V17c0 3.3-1.8 4.7-4.7 4.7-1.4 0-2.6-.3-3.5-.9l.4-2.5z" fill="#000"/>
  </svg>`,

  TypeScript: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#3178C6"/>
    <path d="M12.8 18.5c.8.5 1.7.8 2.7.8 1.4 0 2.2-.7 2.2-1.7 0-1.2-1-1.6-2.5-2.2l-.7-.3c-2.1-.9-3.4-2-3.4-4.3 0-2.4 1.9-4.1 4.9-4.1 1.3 0 2.4.3 3.3.8l-1 2.3c-.7-.4-1.6-.7-2.4-.7-1.2 0-1.9.6-1.9 1.4 0 1 1 1.4 2.5 2l.7.3c2.4 1 3.5 2.1 3.5 4.5 0 2.7-2.1 4.3-5.4 4.3-1.6 0-3-.4-4-1l1-2.3zM4 9.2h3.5v12.2h2.8V9.2h3.5V6.8H4v2.4z" fill="#FFF"/>
  </svg>`,

  PHP: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4"/>
    <path d="M6 9h2.5c1 0 1.5.4 1.5 1.2S9.5 11.5 8.5 11.5H7V14H6V9zm1 1.6h1.2c.4 0 .7-.2.7-.5s-.3-.5-.7-.5H7v1zm4.5-1.6h1v2h1.5V9h1v5h-1v-2H12.5v2h-1V9zm6 0h2.5c1 0 1.5.4 1.5 1.2s-.5 1.3-1.5 1.3H18.5V14h-1V9zm1 1.6h1.2c.4 0 .7-.2.7-.5s-.3-.5-.7-.5H18.5v1z" fill="#FFF"/>
  </svg>`,

  Python: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.8 2c-4 0-3.8 1.7-3.8 1.7v1.8h3.9v.6H6.1S3.8 5.9 3.8 10s2 3.9 2 3.9h1.2v-1.7s-.1-2 2-2h3.4s1.9 0 1.9-1.9V4c0-2-2.5-2-2.5-2zm-1.7 1.3a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z" fill="#3776AB"/>
    <path d="M12.2 22c4 0 3.8-1.7 3.8-1.7v-1.8h-3.9v-.6h5.8s2.3.2 2.3-3.9-2-3.9-2-3.9h-1.2v1.7s.1 2-2 2h-3.4s-1.9 0-1.9 1.9V20c0 2 2.5 2 2.5 2zm1.7-1.3a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4z" fill="#FFD43B"/>
  </svg>`,

  Ruby: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.5 7L13 2H8.5L3 8.5 11.5 21.5 21 12.5 18.5 7z" fill="#CC342D"/>
    <path d="M13 2l5.5 5L12 12 6.5 7 13 2z" fill="#E86256"/>
    <path d="M3 8.5L8.5 7 12 12 6.5 17 3 8.5z" fill="#A8201A"/>
  </svg>`,

  "C# / ASP.NET": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#512BD4"/>
    <path d="M11 8a4 4 0 1 0 0 8 4 4 0 0 0 4-4h-2a2 2 0 1 1-2-2h4V8h-4zm5 1h1v2h-1V9zm2 0h1v2h-1V9zm-2 4h1v2h-1v-2zm2 0h1v2h-1v-2z" fill="#FFF"/>
  </svg>`,

  "HTML / CSS": `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3l1.6 17.5L12 22.5l7.4-2L21 3H3zm14.7 4.5l-.3 3.5H9.2l.3 3.5h7.6l-.6 6.5-4.5 1.2-4.5-1.2-.3-3.5h2.5l.1 1.7 2.2.6 2.2-.6.2-2.2H6.6L5.8 7.5h11.9z" fill="#E34F26"/>
  </svg>`
};

const TECH_METADATA = {
  React: {
    description: "A popular open-source JavaScript library for building user interfaces based on components.",
    url: "https://react.dev"
  },
  "Next.js": {
    description: "The React framework for the web, providing server-side rendering, static site generation, and routing.",
    url: "https://nextjs.org"
  },
  "Vue.js": {
    description: "A progressive JavaScript framework for building user interfaces and single-page applications.",
    url: "https://vuejs.org"
  },
  "Nuxt.js": {
    description: "An intuitive Vue framework for building hybrid rendering & server-side rendered web apps.",
    url: "https://nuxt.com"
  },
  Angular: {
    description: "A web application framework developed by Google for building scalable single-page web applications.",
    url: "https://angular.dev"
  },
  "Svelte / SvelteKit": {
    description: "A cybernetically enhanced web framework that compiles components into efficient vanilla JS at build time.",
    url: "https://svelte.dev"
  },
  Remix: {
    description: "A full stack web framework that lets you focus on user interface and work back through web standards.",
    url: "https://remix.run"
  },
  Astro: {
    description: "The web framework for content-driven websites, delivering fast speed with island architecture.",
    url: "https://astro.build"
  },
  Gatsby: {
    description: "A React-based open source framework for creating fast, static websites and applications.",
    url: "https://www.gatsbyjs.com"
  },
  "Alpine.js": {
    description: "A rugged, minimal framework for composing JavaScript behavior directly in HTML markup.",
    url: "https://alpinejs.dev"
  },
  Preact: {
    description: "Fast 3kB alternative to React with the same modern ES6 API.",
    url: "https://preactjs.com"
  },
  jQuery: {
    description: "A fast, small, and feature-rich JavaScript library for DOM manipulation and AJAX.",
    url: "https://jquery.com"
  },
  "Tailwind CSS": {
    description: "A utility-first CSS framework packed with classes that can be composed to build any design.",
    url: "https://tailwindcss.com"
  },
  Bootstrap: {
    description: "A powerful, feature-packed frontend toolkit for building responsive mobile-first sites.",
    url: "https://getbootstrap.com"
  },
  "Material UI (MUI)": {
    description: "An open-source React component library that implements Google's Material Design system.",
    url: "https://mui.com"
  },
  "Shadcn UI / Radix": {
    description: "Beautifully designed accessible unstyled UI primitives combined with Tailwind CSS.",
    url: "https://ui.shadcn.com"
  },
  "Chakra UI": {
    description: "A simple, modular and accessible component library that gives you the building blocks for React apps.",
    url: "https://chakra-ui.com"
  },
  "Ant Design": {
    description: "An enterprise-class UI design language and React UI library.",
    url: "https://ant.design"
  },
  "Font Awesome": {
    description: "The web's most popular icon set and toolkit.",
    url: "https://fontawesome.com"
  },
  WordPress: {
    description: "The world's most popular open-source content management system (CMS).",
    url: "https://wordpress.org"
  },
  Shopify: {
    description: "A leading e-commerce platform that powers online stores around the globe.",
    url: "https://www.shopify.com"
  },
  Webflow: {
    description: "A visual web development platform for building responsive custom websites without code.",
    url: "https://webflow.com"
  },
  Wix: {
    description: "A cloud-based website development platform with drag-and-drop visual building.",
    url: "https://www.wix.com"
  },
  Squarespace: {
    description: "An all-in-one content management system and store builder platform.",
    url: "https://www.squarespace.com"
  },
  WooCommerce: {
    description: "An open-source e-commerce plugin built for WordPress sites.",
    url: "https://woocommerce.com"
  },
  "Google Analytics": {
    description: "Google's web analytics service that tracks and reports website traffic.",
    url: "https://analytics.google.com"
  },
  "Google Tag Manager": {
    description: "A tag management system to manage marketing and analytics scripts.",
    url: "https://tagmanager.google.com"
  },
  VWO: {
    description: "An experimentation platform for A/B testing, personalization, and conversion optimization.",
    url: "https://vwo.com"
  },
  Sentry: {
    description: "Application monitoring that captures errors, traces, and performance issues.",
    url: "https://sentry.io"
  },
  hCaptcha: {
    description: "A privacy-focused CAPTCHA service used to protect forms and sign-in flows.",
    url: "https://www.hcaptcha.com"
  },
  "Microsoft Advertising": {
    description: "Microsoft's advertising platform and UET conversion tracking service.",
    url: "https://about.ads.microsoft.com"
  },
  "Howler.js": {
    description: "A JavaScript audio library for cross-browser playback and audio controls.",
    url: "https://howlerjs.com"
  },
  "Framer Motion": {
    description: "A motion library for animations and interactions in React applications.",
    url: "https://motion.dev"
  },
  "Base UI": {
    description: "An open-source library of unstyled, accessible React components.",
    url: "https://base-ui.com"
  },
  Cookiebot: {
    description: "A consent management platform for cookie consent and privacy compliance.",
    url: "https://www.cookiebot.com"
  },
  "Cookie Control": {
    description: "A consent management tool from Civic for controlling website cookies.",
    url: "https://www.civicuk.com/cookie-control"
  },
  PartnerStack: {
    description: "A platform for managing partner, affiliate, and referral programs.",
    url: "https://partnerstack.com"
  },
  PWA: {
    description: "A Progressive Web App uses browser capabilities to provide an installable, app-like experience.",
    url: "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"
  },
  "Open Graph": {
    description: "Metadata that controls how pages are represented when shared on social platforms.",
    url: "https://ogp.me"
  },
  "HTTP/3": {
    description: "The third major version of HTTP, transported over QUIC.",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/HTTP_3"
  },
  "Priority Hints": {
    description: "A browser hint that lets pages communicate the relative fetch priority of resources.",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/fetchpriority"
  },
  Mixpanel: {
    description: "Product analytics tool that helps track user interactions and conversion funnels.",
    url: "https://mixpanel.com"
  },
  PostHog: {
    description: "An open-source product analytics suite built for modern web applications.",
    url: "https://posthog.com"
  },
  Hotjar: {
    description: "Behavior analytics tool providing heatmaps, session recordings, and surveys.",
    url: "https://www.hotjar.com"
  },
  Intercom: {
    description: "A customer messaging platform for live chat, marketing automation, and support.",
    url: "https://www.intercom.com"
  },
  Stripe: {
    description: "Financial infrastructure and online payment processing platform for internet businesses.",
    url: "https://stripe.com"
  },
  PayPal: {
    description: "Global online payment processing and digital wallet platform.",
    url: "https://www.paypal.com"
  },
  Clerk: {
    description: "Complete user management and authentication solution for modern web applications.",
    url: "https://clerk.com"
  },
  Auth0: {
    description: "Flexible, drop-in solution to add authentication and authorization services to applications.",
    url: "https://auth0.com"
  },
  Firebase: {
    description: "Google's app development platform offering authentication, Firestore databases, and hosting.",
    url: "https://firebase.google.com"
  },
  Supabase: {
    description: "An open-source Firebase alternative with PostgreSQL databases, Auth, and real-time subscriptions.",
    url: "https://supabase.com"
  },
  Vite: {
    description: "Next generation frontend tooling with instant server start and lightning fast HMR.",
    url: "https://vitejs.dev"
  },
  Webpack: {
    description: "A static module bundler for modern JavaScript applications.",
    url: "https://webpack.js.org"
  },
  Cloudflare: {
    description: "Global cloud network platform providing CDN, DNS, DDoS protection, and edge compute.",
    url: "https://www.cloudflare.com"
  },
  Vercel: {
    description: "Cloud platform for static sites and Serverless Functions tailored for Next.js and frontend frameworks.",
    url: "https://vercel.com"
  },
  Netlify: {
    description: "Web development platform that multiplies productivity with automated CI/CD and edge deployments.",
    url: "https://www.netlify.com"
  },
  JavaScript: {
    description: "The core programming language of the Web, powering client-side interactive functionality.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  },
  TypeScript: {
    description: "A strongly typed programming language that builds on JavaScript, giving you better tooling at scale.",
    url: "https://www.typescriptlang.org"
  },
  PHP: {
    description: "A widely-used open source general-purpose scripting language tailored for web development.",
    url: "https://www.php.net"
  },
  Python: {
    description: "High-level programming language widely used for backend web development (Django/Flask) and data analysis.",
    url: "https://www.python.org"
  },
  Ruby: {
    description: "A dynamic, open source programming language with a focus on simplicity and productivity.",
    url: "https://www.ruby-lang.org"
  },
  "C# / ASP.NET": {
    description: "Microsoft's modern framework for building web applications and API services with C#.",
    url: "https://dotnet.microsoft.com/apps/aspnet"
  },
  "HTML / CSS": {
    description: "Standard markup and styling languages used to structure and present web documents.",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML"
  }
};

function getTechIcon(name) {
  if (TECH_ICONS[name]) return TECH_ICONS[name];

  // Partial match matching
  for (const key in TECH_ICONS) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return TECH_ICONS[key];
    }
  }

  // Dynamic SVG badge generator fallback
  const firstLetter = (name || "T").charAt(0).toUpperCase();
  const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];
  const bg = colors[name.length % colors.length];

  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="${bg}"/>
    <text x="12" y="16" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFF" text-anchor="middle">${firstLetter}</text>
  </svg>`;
}

function getTechMeta(name) {
  if (TECH_METADATA[name]) return TECH_METADATA[name];

  for (const key in TECH_METADATA) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return TECH_METADATA[key];
    }
  }

  return {
    description: `${name} is a technology detected on this webpage.`,
    url: `https://www.google.com/search?q=${encodeURIComponent(name + " technology")}`
  };
}
