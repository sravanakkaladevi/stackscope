# 🚀 StackScope - Deep Tech Stack Inspector Chrome Extension

<p align="center">
  <img src="logo.png" alt="StackScope Logo" width="120" />
</p>

<p align="center">
  <b>Discover what powers the web.</b> A privacy-first, local-engine Chrome Extension that detects 70+ web technologies, frameworks, UI libraries, analytics tools, CDNs, and programming languages with version extraction and crisp vector SVG logos.
</p>

---

## ✨ Key Features

- **🔍 70+ Technology Signatures**: Detects React, Next.js, Vue, Nuxt, Angular, Svelte, Astro, Remix, Tailwind CSS, Bootstrap, Material UI, Shadcn/Radix, WordPress, Shopify, Webflow, Firebase, Supabase, Stripe, Clerk, PostHog, Mixpanel, Vite, Webpack, Cloudflare, Vercel, Netlify, and more!
- **🔢 Real-time Toolbar Badge Overlay**: Shows the live count of detected technologies on your browser toolbar icon (e.g., `13`, `8`, `5`) automatically as you browse.
- **🏷️ Version Extraction & Evidence**: Captures exact version numbers (e.g., `React v18.2.0`, `jQuery v3.6.0`) and detection evidence (DOM attributes, window objects, global scripts).
- **🎨 Wappalyzer-Inspired 2-Column UI**: Beautiful 2-column category grid layout (`Frameworks`, `UI & Styling`, `CMS & Commerce`, `Analytics & Marketing`, `Backend & Infra`, `Languages`).
- **🔍 Detailed Tech Inspector Drawer**: Click any detected technology to open a rich detail modal showing description, evidence, confidence level, and official documentation links.
- **🌓 Light & Dark Theme Support**: Instant theme switching with preference persistence (`localStorage`) and automatic system theme detection.
- **📥 Export Capabilities**: Easily copy a formatted Markdown tech stack report or download a complete JSON stack analysis.
- **🛡️ 100% Privacy-First & Local**: Performs all scanning directly on your machine inside Chrome. No remote servers, no tracking, zero network dependencies.

### Detection Scope

StackScope reports technologies only when it can find browser-visible evidence, such as page markup, loaded resource URLs, or JavaScript globals. Versions are shown only when the page exposes them. Server fingerprints such as Nginx versions and CDN response headers are not inferred because this extension does not request broad network-inspection permissions; HTTP/3 is reported only when the browser exposes `h3` through Resource Timing.

---

## 📸 Screenshots & UI Layout

| Wappalyzer-Style 2-Column Grid | Detailed Tech Inspector Modal |
|---|---|
| Categorized 2-column grid layout with logos & clickable tech names | Comprehensive overview, version, evidence & documentation link |

---

## 🛠️ Installation Guide

### Load Unpacked Extension in Chrome / Edge

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/sravanakkaladevi/stackscope.git
   ```
2. Open **Google Chrome** or **Microsoft Edge** and go to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable **Developer mode** (toggle in top-right corner).
4. Click **Load unpacked** button.
5. Select the `stackscope` folder directory.
6. Open any public website (e.g., [Shopify](https://shopify.com), [Vercel](https://vercel.com), [Next.js](https://nextjs.org)) and click the **StackScope** toolbar icon!

---

## 📁 Repository File Architecture

```
stackscope/
├── manifest.json       # Manifest V3 configuration & permissions
├── logo.png            # StackScope official brand icon
├── background.js       # Background service worker (toolbar badge counter)
├── content.js          # DOM, script tag & HTML signature scanner
├── injected.js         # Main-world window global variables inspector
├── techIcons.js        # SVG logo dictionary & technology metadata
├── popup.html          # Extension popup UI structure
├── popup.css           # Modern glassmorphism UI styles (Light & Dark themes)
├── popup.js            # Popup interaction logic, filtering & exports
└── package.json        # Validation scripts & package config
```

---

## 🧪 Development & Validation

To test and validate project file syntax:

```bash
npm run validate
```

This runs JSON validation on `manifest.json` and syntax checks on all JavaScript files (`content.js`, `popup.js`, `injected.js`, `techIcons.js`, `background.js`).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed by **[sravanakkaladevi](https://github.com/sravanakkaladevi)**.
