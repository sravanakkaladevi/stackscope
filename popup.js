let currentData = null;
let activeCategory = "All";
let searchQuery = "";

const elements = {
  // Navigation Tabs
  mainTabs: document.querySelectorAll(".main-tab"),
  tabTech: document.querySelector("#tab-tech"),
  tabDetails: document.querySelector("#tab-details"),
  
  // Status Bar
  status: document.querySelector("#status"),
  statusText: document.querySelector("#status-text"),
  scanTime: document.querySelector("#scan-time"),

  // Technologies Tab
  gridContainer: document.querySelector("#tech-categories-grid"),
  searchInput: document.querySelector("#search-input"),
  filterTabsContainer: document.querySelector(".filter-tabs-container"),
  filterTabs: document.querySelector("#filter-tabs"),

  // Details Tab
  pageTitle: document.querySelector("#page-title"),
  pageHost: document.querySelector("#page-host"),
  pageFavicon: document.querySelector("#page-favicon"),
  detailsUrl: document.querySelector("#details-url"),
  detailsTimestamp: document.querySelector("#details-timestamp"),
  technologyCount: document.querySelector("#technology-count"),
  highConfidenceCount: document.querySelector("#high-confidence-count"),
  versionCount: document.querySelector("#version-count"),

  // Top Actions
  themeToggle: document.querySelector("#theme-toggle"),
  themeIconSun: document.querySelector("#theme-icon-sun"),
  themeIconMoon: document.querySelector("#theme-icon-moon"),
  rescanBtn: document.querySelector("#rescan"),
  exportDropdownBtn: document.querySelector("#export-dropdown-btn"),

  // Export Modal
  exportModal: document.querySelector("#export-modal"),
  exportModalClose: document.querySelector("#export-modal-close"),
  optCopyMd: document.querySelector("#opt-copy-md"),
  optExportJson: document.querySelector("#opt-export-json"),

  // Tech Inspection Modal
  modal: document.querySelector("#tech-modal"),
  modalClose: document.querySelector("#modal-close"),
  modalIcon: document.querySelector("#modal-icon"),
  modalName: document.querySelector("#modal-name"),
  modalCategory: document.querySelector("#modal-category"),
  modalVersion: document.querySelector("#modal-version"),
  modalConfidence: document.querySelector("#modal-confidence"),
  modalDesc: document.querySelector("#modal-desc"),
  modalEvidence: document.querySelector("#modal-evidence"),
  modalLink: document.querySelector("#modal-link"),

  toast: document.querySelector("#toast"),
};

function openTechModal(item) {
  const iconSvg = typeof getTechIcon === "function" ? getTechIcon(item.name) : "";
  const meta = typeof getTechMeta === "function" ? getTechMeta(item.name) : { description: "", url: "#" };

  elements.modalIcon.innerHTML = iconSvg;
  elements.modalName.textContent = item.name;
  elements.modalCategory.textContent = item.category;

  if (item.version) {
    elements.modalVersion.textContent = item.version.startsWith("v") ? item.version : `v${item.version}`;
    elements.modalVersion.style.display = "inline-block";
  } else {
    elements.modalVersion.style.display = "none";
  }

  elements.modalConfidence.textContent = `${item.confidence || "High"} Confidence`;
  elements.modalDesc.textContent = meta.description;
  elements.modalEvidence.textContent = item.evidence || "DOM/Global JS variable signature detected.";
  elements.modalLink.href = meta.url;

  elements.modal.classList.remove("hidden");
}

function closeTechModal() {
  elements.modal.classList.add("hidden");
}

function renderWappalyzerGrid() {
  if (!currentData) return;

  const languageRows = (currentData.languages || []).map((lang) => ({
    name: lang.name || lang,
    category: "Languages",
    version: null,
    confidence: "High",
    evidence: lang.evidence || "Document language signature",
  }));

  const allItems = [...currentData.technologies, ...languageRows];

  // Category filter
  let filtered = allItems.filter((item) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Framework")
      return item.category === "Framework" || item.category === "Library";
    if (activeCategory === "Styling & UI")
      return item.category === "Styling & UI" || item.category === "Styling";
    if (activeCategory === "Backend / BaaS")
      return item.category === "Backend & BaaS" || item.category === "Build Tools" || item.category === "Infrastructure & CDN" || item.category === "Infrastructure & Hosting";
    if (activeCategory === "CMS & Store")
      return item.category === "CMS & Commerce" || item.category === "CMS" || item.category === "Commerce";
    if (activeCategory === "Analytics")
      return item.category === "Analytics & Marketing" || item.category === "Analytics";
    if (activeCategory === "Marketing")
      return ["A/B Testing", "Advertising", "Affiliate Programs", "Cookie Compliance"].includes(item.category);
    if (activeCategory === "Libraries")
      return item.category === "Library" || item.category === "JavaScript Libraries";
    if (activeCategory === "Security")
      return item.category === "Security" || item.category === "Issue Trackers";
    if (activeCategory === "Site Signals")
      return ["Miscellaneous", "Network Protocols", "Performance"].includes(item.category);
    if (activeCategory === "Languages")
      return item.category === "Languages" || item.category === "Language";

    return item.category === activeCategory;
  });

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.version && item.version.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    elements.gridContainer.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 30px; color: var(--text-muted); font-size: 11px;">
        No matching tech signatures found.
      </div>
    `;
    return;
  }

  // Group items by Category name
  const categoryGroups = new Map();
  filtered.forEach((item) => {
    const cat = item.category || "Other";
    if (!categoryGroups.has(cat)) {
      categoryGroups.set(cat, []);
    }
    categoryGroups.get(cat).push(item);
  });

  elements.gridContainer.innerHTML = "";

  // Render each category section as a grid block
  categoryGroups.forEach((items, categoryName) => {
    const block = document.createElement("div");
    block.className = "cat-block";

    const titleEl = document.createElement("div");
    titleEl.className = "cat-title";
    titleEl.textContent = categoryName;

    const listEl = document.createElement("div");
    listEl.className = "cat-items-list";

    items.forEach((item) => {
      const iconSvg = typeof getTechIcon === "function" ? getTechIcon(item.name) : "";
      const versionStr = item.version ? item.version : "";

      const itemEl = document.createElement("div");
      itemEl.className = "wappa-item";
      itemEl.innerHTML = `
        <div class="wappa-icon">${iconSvg}</div>
        <div class="wappa-name-group">
          <span class="wappa-name">${item.name}</span>
          ${versionStr ? `<span class="wappa-version">${versionStr}</span>` : ""}
        </div>
      `;

      itemEl.addEventListener("click", () => openTechModal(item));
      listEl.appendChild(itemEl);
    });

    block.appendChild(titleEl);
    block.appendChild(listEl);
    elements.gridContainer.appendChild(block);
  });
}

function updateMetrics(data) {
  const languageRows = data.languages || [];
  const totalCount = data.technologies.length + languageRows.length;
  elements.technologyCount.textContent = totalCount;

  const highConf = data.technologies.filter((t) => t.confidence === "High").length + languageRows.length;
  elements.highConfidenceCount.textContent = highConf;

  const versionsFound = data.technologies.filter((t) => Boolean(t.version)).length;
  elements.versionCount.textContent = versionsFound;

  if (elements.detailsUrl) elements.detailsUrl.textContent = data.url || data.hostname;
  if (elements.detailsTimestamp) elements.detailsTimestamp.textContent = new Date(data.scannedAt).toLocaleString();
}

function renderResults(data, tabFavicon) {
  currentData = data;
  elements.status.className = "status-bar status-ready";
  elements.statusText.textContent = "Deep scan complete";

  elements.pageTitle.textContent = data.title || "Untitled page";
  elements.pageHost.textContent = data.hostname || "Local page";

  if (tabFavicon || data.hostname) {
    const iconUrl =
      tabFavicon ||
      `https://www.google.com/s2/favicons?domain=${data.hostname}&sz=32`;
    elements.pageFavicon.src = iconUrl;
    elements.pageFavicon.style.display = "block";
  }

  elements.scanTime.textContent = new Date(data.scannedAt).toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  );

  updateMetrics(data);
  renderWappalyzerGrid();
}

function fallbackDomainScan(tab) {
  const urlObj = new URL(tab.url || "https://localhost");
  const host = urlObj.hostname.toLowerCase();
  const techs = [];

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
    techs.push({
      name: "Google Closure Library",
      category: "Framework",
      confidence: "Medium",
      evidence: "Google Workspace Closure framework architecture",
    });
  } else if (/(?:^|\.)vercel\.(?:app|dev)$/i.test(host)) {
    techs.push({ name: "Vercel", category: "Infrastructure & Hosting", confidence: "High", evidence: `Vercel domain match: ${host}` });
  } else if (/(?:^|\.)netlify\.(?:app|com)$/i.test(host)) {
    techs.push({ name: "Netlify", category: "Infrastructure & Hosting", confidence: "High", evidence: `Netlify domain match: ${host}` });
  } else if (/(?:^|\.)github\.io$/i.test(host)) {
    techs.push({ name: "GitHub Pages", category: "Infrastructure & Hosting", confidence: "High", evidence: `GitHub Pages domain match: ${host}` });
  } else if (/(?:^|\.)pages\.dev$/i.test(host)) {
    techs.push({ name: "Cloudflare Pages", category: "Infrastructure & Hosting", confidence: "High", evidence: `Cloudflare Pages domain match: ${host}` });
    techs.push({ name: "Cloudflare", category: "Infrastructure & CDN", confidence: "High", evidence: "Cloudflare network infrastructure" });
  } else if (/(?:^|\.)firebaseapp\.com$|(?:^|\.)web\.app$/i.test(host)) {
    techs.push({ name: "Firebase Hosting", category: "Infrastructure & Hosting", confidence: "High", evidence: `Firebase Hosting domain match: ${host}` });
  } else if (/(?:^|\.)myshopify\.com$/i.test(host)) {
    techs.push({ name: "Shopify", category: "CMS & Commerce", confidence: "High", evidence: `Shopify domain match: ${host}` });
  }

  const languages = [
    { name: "JavaScript", category: "Languages", evidence: "ECMAScript client runtime signature" },
    { name: "HTML / CSS", category: "Languages", evidence: "Document markup and stylesheet signature" }
  ];

  return {
    url: tab.url,
    title: tab.title || host,
    hostname: host,
    technologies: techs,
    languages,
    scannedAt: new Date().toISOString(),
  };
}

function scanActiveTab() {
  elements.status.className = "status-bar status-scanning";
  elements.statusText.textContent = "Scanning signatures...";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.id) return;

    const tabFavicon = tab.favIconUrl;

    chrome.tabs.sendMessage(tab.id, { type: "scan-page" }, (data) => {
      if (chrome.runtime.lastError || !data) {
        if (tab.url && (tab.url.startsWith("http://") || tab.url.startsWith("https://"))) {
          const fallbackData = fallbackDomainScan(tab);
          renderResults(fallbackData, tabFavicon);
          return;
        }

        elements.status.className = "status-bar";
        elements.statusText.textContent = "Restricted browser page";
        elements.pageTitle.textContent = "System / Store Page";
        elements.pageHost.textContent = tab.url ? new URL(tab.url).hostname : "chrome://";
        elements.technologyCount.textContent = "0";
        elements.highConfidenceCount.textContent = "0";
        elements.versionCount.textContent = "0";
        elements.gridContainer.innerHTML = `
          <div style="grid-column: span 2; text-align: center; padding: 25px; color: var(--text-muted); font-size: 11px;">
            Chrome restricts extensions on local browser pages. Open a standard website to detect its technologies.
          </div>
        `;
        return;
      }

      renderResults(data, tabFavicon);
    });
  });
}


function copyStackToClipboard() {
  if (!currentData) return;

  const techLines = currentData.technologies.map(
    (t) => `- **${t.name}** (${t.category})${t.version ? ` v${t.version}` : ""} [${t.confidence || "High"} Confidence]`
  );
  const langLines = (currentData.languages || []).map((l) => `- **${l.name || l}** (Languages)`);

  const markdown = [
    `### 🚀 StackScope Report for ${currentData.hostname || "Webpage"}`,
    `*Page:* ${currentData.title}`,
    `*URL:* ${currentData.url}`,
    "",
    "**Detected Technology Stack:**",
    ...techLines,
    ...langLines,
    "",
    `*Scanned with StackScope at ${new Date(currentData.scannedAt).toLocaleString()}*`,
  ].join("\n");

  navigator.clipboard.writeText(markdown).then(() => {
    showToast("Report copied to clipboard!");
    elements.exportModal.classList.add("hidden");
  });
}

function exportAsJson() {
  if (!currentData) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `stackscope-${currentData.hostname || "report"}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast("JSON report downloaded!");
  elements.exportModal.classList.add("hidden");
}

function showToast(msg = "Copied to clipboard!") {
  elements.toast.textContent = msg;
  elements.toast.classList.add("show");
  setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2000);
}

// Main Navigation Tab Switching
elements.mainTabs.forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    elements.mainTabs.forEach((b) => b.classList.remove("active"));
    tabBtn.classList.add("active");

    const targetTab = tabBtn.dataset.tab;
    if (targetTab === "tech") {
      elements.tabTech.classList.add("active");
      elements.tabDetails.classList.remove("active");
    } else {
      elements.tabDetails.classList.add("active");
      elements.tabTech.classList.remove("active");
    }
  });
});

// Search and Category Filter Listeners
if (elements.searchInput) {
  elements.searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderWappalyzerGrid();
  });
}

if (elements.filterTabs) {
  elements.filterTabs.addEventListener("click", (e) => {
    if (!e.target.classList.contains("tab-btn")) return;
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    activeCategory = e.target.dataset.category;
    renderWappalyzerGrid();
  });
}

if (elements.filterTabsContainer) {
  elements.filterTabsContainer.addEventListener("wheel", (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      elements.filterTabsContainer.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

// Export Dropdown Modal
if (elements.exportDropdownBtn) {
  elements.exportDropdownBtn.addEventListener("click", () => {
    elements.exportModal.classList.remove("hidden");
  });
}

if (elements.exportModalClose) {
  elements.exportModalClose.addEventListener("click", () => {
    elements.exportModal.classList.add("hidden");
  });
}

if (elements.optCopyMd) elements.optCopyMd.addEventListener("click", copyStackToClipboard);
if (elements.optExportJson) elements.optExportJson.addEventListener("click", exportAsJson);

// Tech Modal Listeners
if (elements.modalClose) elements.modalClose.addEventListener("click", closeTechModal);
if (elements.modal) {
  elements.modal.addEventListener("click", (e) => {
    if (e.target === elements.modal) closeTechModal();
  });
}

// Rescan Button
if (elements.rescanBtn) {
  elements.rescanBtn.addEventListener("click", () => {
    const icon = document.querySelector("#rescan-icon");
    if (icon) {
      icon.style.transition = "transform 0.5s ease";
      icon.style.transform = "rotate(360deg)";
      setTimeout(() => {
        icon.style.transform = "rotate(0deg)";
      }, 500);
    }
    scanActiveTab();
  });
}

// Theme Switcher Functions
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    elements.themeIconSun.style.display = "block";
    elements.themeIconMoon.style.display = "none";
  } else {
    document.documentElement.removeAttribute("data-theme");
    elements.themeIconSun.style.display = "none";
    elements.themeIconMoon.style.display = "block";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("stackscope-theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  localStorage.setItem("stackscope-theme", newTheme);
  applyTheme(newTheme);
}

if (elements.themeToggle) {
  elements.themeToggle.addEventListener("click", toggleTheme);
}

// Initial setup on open
initTheme();
scanActiveTab();
