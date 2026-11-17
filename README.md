# 🚀 StackScope - Deep Tech Stack Inspector Chrome Extension

<p align="center">
  <img src="logo.png" alt="StackScope Logo" width="120" />
</p>

<p align="center">
  <b>Discover what powers the web.</b> A privacy-first, local-engine Chrome Extension powered by the <b>Wappalyzer detection engine</b> with <b>3,700+ web technology signatures</b>, 3,300+ authentic logos, HTTP response header analysis, version extraction, and dependency tree resolution.
</p>

---

## ✨ Key Features

- **🔍 3,700+ Technology Signatures**: Comprehensive coverage powered by Wappalyzer's open-source database (React, Next.js, Vue, Nuxt, Angular, Svelte, Astro, Remix, Tailwind CSS, Bootstrap, WordPress, Shopify, Cloudflare, Vercel, Netlify, AWS, Google Analytics, Stripe, Clerk, and thousands more).
- **🌐 HTTP Response Header Inspection**: Detects servers, hosting providers, caching layers, and web frameworks directly from HTTP response headers (e.g. `Server: Vercel`, `X-Powered-By: Next.js`, `Server: cloudflare`, `X-Drupal-Cache`).
- **🎨 3,300+ Authentic Vector & High-Res Logos**: Crisp SVG/PNG logos for detected technologies rendered directly in the popup and inspector drawer.
- **🔢 Real-time Toolbar Badge Overlay**: Shows the live count of detected technologies on your browser toolbar icon automatically as you browse.
- **🏷️ Version Extraction & Evidence**: Captures exact version numbers (e.g. `Next.js v14.2.3`, `React v18.2.0`, `WordPress v6.4.2`) with transparent detection evidence (HTTP headers, scripts, DOM, window variables, or implications).
- **🌳 Implication Tree Resolution**: Understands technology relationships (e.g., Next.js automatically implies React, Node.js, and Webpack; WordPress implies PHP and MySQL).
- **🎨 Wappalyzer-Inspired 2-Column UI**: Categorized grid layout (`Frameworks`, `UI & Styling`, `CMS & Store`, `Analytics`, `Backend & Infra`, `Languages`).
- **🔍 Detailed Tech Inspector Drawer**: Click any detected technology to open a modal showing description, evidence, confidence level, and official documentation links.
- **🌓 Light & Dark Theme Support**: Instant theme switching with preference persistence (`localStorage`) and automatic system theme detection.
- **📥 Export Capabilities**: Easily copy a formatted Markdown tech stack report or download a complete JSON stack analysis.
- **🛡️ 100% Privacy-First & Local**: Performs all scanning directly on your machine inside Chrome. No remote servers, no tracking, zero network dependencies.

---

## 📸 Screenshots & UI Layout

| Wappalyzer-Style 2-Column Grid | Detailed Tech Inspector Modal |
|---|---|
| Categorized 2-column grid layout with logos & clickable tech names | Comprehensive overview, version, evidence & documentation link |

---

## 🛠️ Installation Guide

### Load Unpacked Extension in Chrome / Edge

1. Open **Google Chrome** or **Microsoft Edge** and go to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
2. Enable **Developer mode** (toggle in top-right corner).
3. Click **Load unpacked** button.
4. Select the `stackscope-main` folder directory:
   ```
   C:\Users\srava\Downloads\stackscope-main\stackscope-main
   ```
5. Open any website (e.g. [Vercel](https://vercel.com), [Shopify](https://shopify.com), [Next.js](https://nextjs.org), [GitHub](https://github.com)) and click the **StackScope** toolbar icon!

---

## 📁 Repository File Architecture

```
stackscope/
├── manifest.json       # Manifest V3 configuration, permissions & resources
├── logo.png            # StackScope official brand icon
├── background.js       # Service worker (HTTP headers inspector & badge updater)
├── wappalyzerEngine.js # Core Wappalyzer detection, regex matching & resolution engine
├── content.js          # DOM, script URLs, meta tags & cookies collector
├── injected.js         # Main-world window global variables & fiber inspector
├── techIcons.js        # SVG logo dictionary, icon resolver & metadata
├── popup.html          # Extension popup UI structure
├── popup.css           # Modern glassmorphism UI styles (Light & Dark themes)
├── popup.js            # Popup interaction logic, category filtering & exports
├── data/               # Precompiled technology definitions & rules
│   ├── categories.json # 108 Wappalyzer category definitions
│   ├── categories.js   # Fast-loading categories dataset
│   ├── technologies.json # 3,774 technology definitions & patterns
│   ├── technologies.js   # Fast-loading technologies dataset
│   ├── domRules.js     # Extracted DOM selector rules
│   └── jsChains.js     # Extracted window property chains
├── icons/              # 3,300+ authentic technology SVG & PNG icons
├── test-e2e.js         # Multi-scenario detection test suite
└── package.json        # Validation and test scripts
```

---

## 🧪 Development & Validation

To test and validate project file syntax and run the detection test suite:

```bash
# Validate manifest and all script syntax
npm run validate

# Run multi-scenario detection tests
npm test
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed by **[sravanakkaladevi](https://github.com/sravanakkaladevi)**.
