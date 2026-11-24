/**
 * Wappalyzer Detection & Categorization Engine for StackScope
 * Integrates 3,700+ Wappalyzer technology definitions, regex patterns, version extraction,
 * implication tree resolution, and StackScope UI category mappings.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WappalyzerEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function toArray(value) {
    if (value === null || value === undefined) return [];
    return Array.isArray(value) ? value : [value];
  }

  function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function slugify(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/(?:^-|-$)/g, '');
  }

  // Map Wappalyzer category IDs to StackScope filter categories
  const UI_CATEGORY_MAP = {
    // Frameworks & Meta-Frameworks
    12: 'Framework', // JavaScript frameworks
    18: 'Framework', // Web frameworks
    26: 'Framework', // Mobile frameworks
    57: 'Framework', // Static site generator
    59: 'Framework', // JavaScript libraries
    108: 'Framework', // Ecommerce frontends

    // Styling & UI Libraries
    17: 'Styling & UI', // Font scripts
    25: 'Styling & UI', // JavaScript graphics
    51: 'Styling & UI', // Page builders
    66: 'Styling & UI', // UI frameworks

    // Backend, Infrastructure, Hosting, Cloud & Servers
    3: 'Backend / BaaS', // Database managers
    9: 'Backend / BaaS', // Hosting panels
    22: 'Backend / BaaS', // Web servers
    23: 'Backend / BaaS', // Caching
    31: 'Backend / BaaS', // CDN
    33: 'Backend / BaaS', // Web server extensions
    34: 'Backend / BaaS', // Databases
    44: 'Backend / BaaS', // CI
    47: 'Backend / BaaS', // Development
    60: 'Backend / BaaS', // Containers
    62: 'Backend / BaaS', // PaaS
    63: 'Backend / BaaS', // IaaS
    64: 'Backend / BaaS', // Reverse proxies
    65: 'Backend / BaaS', // Load balancers
    69: 'Backend / BaaS', // Authentication
    88: 'Backend / BaaS', // Hosting
    92: 'Backend / BaaS', // Performance

    // CMS, E-Commerce & Stores
    1: 'CMS & Store', // CMS
    2: 'CMS & Store', // Message boards
    6: 'CMS & Store', // Ecommerce
    7: 'CMS & Store', // Photo galleries
    8: 'CMS & Store', // Wikis
    11: 'CMS & Store', // Blogs
    21: 'CMS & Store', // LMS
    41: 'CMS & Store', // Payment processors
    80: 'CMS & Store', // WordPress themes
    81: 'CMS & Store', // Shopify themes
    82: 'CMS & Store', // Drupal themes
    87: 'CMS & Store', // WordPress plugins
    91: 'CMS & Store', // Buy now pay later
    98: 'CMS & Store', // Cart abandonment
    99: 'CMS & Store', // Shipping carriers
    100: 'CMS & Store', // Shopify apps
    106: 'CMS & Store', // Cross border ecommerce
    107: 'CMS & Store', // Fulfilment

    // Analytics, Marketing & CRM
    10: 'Analytics', // Analytics
    13: 'Analytics', // Issue trackers
    16: 'Analytics', // Security
    32: 'Analytics', // Marketing automation
    36: 'Analytics', // Advertising
    42: 'Analytics', // Tag managers
    52: 'Analytics', // Live chat
    53: 'Analytics', // CRM
    54: 'Analytics', // SEO
    73: 'Analytics', // Surveys
    74: 'Analytics', // A/B Testing
    76: 'Analytics', // Personalisation
    77: 'Analytics', // Retargeting
    78: 'Analytics', // RUM
    84: 'Analytics', // Loyalty & rewards
    85: 'Analytics', // Feature management
    86: 'Analytics', // Segmentation
    90: 'Analytics', // Reviews
    94: 'Analytics', // Referral marketing
    97: 'Analytics', // Customer data platform

    // Languages
    27: 'Languages', // Programming languages
  };

  class WappalyzerEngine {
    constructor() {
      this.technologies = [];
      this.categories = new Map();
      this.techMap = new Map();
      this.isInitialized = false;
    }

    init(technologiesData, categoriesData) {
      if (categoriesData) {
        this.setCategories(categoriesData);
      }
      if (technologiesData) {
        this.setTechnologies(technologiesData);
      }
      this.isInitialized = true;
    }

    setCategories(categories) {
      this.categories.clear();
      for (const [idStr, cat] of Object.entries(categories)) {
        const id = parseInt(idStr, 10);
        this.categories.set(id, {
          id,
          name: cat.name,
          priority: cat.priority || 5,
          slug: slugify(cat.name),
        });
      }
    }

    getCategory(id) {
      return this.categories.get(id) || { id, name: 'Other', priority: 10, slug: 'other' };
    }

    parsePattern(rawPattern, isRegex = true) {
      if (typeof rawPattern === 'object' && rawPattern !== null) {
        const result = {};
        for (const [k, v] of Object.entries(rawPattern)) {
          result[k] = this.parsePattern(v, isRegex);
        }
        return result;
      }

      const str = String(rawPattern);
      const parts = str.split('\\;');
      const value = parts[0];
      let confidence = 100;
      let version = '';

      for (let i = 1; i < parts.length; i++) {
        const attr = parts[i].split(':');
        if (attr.length >= 2) {
          const key = attr[0];
          const val = attr.slice(1).join(':');
          if (key === 'confidence') confidence = parseInt(val, 10) || 100;
          if (key === 'version') version = val;
        }
      }

      let regex = null;
      if (isRegex && value) {
        try {
          const safePattern = value
            .replace(/\//g, '\\/')
            .replace(/\\\+/g, '__ESCAPED_PLUS__')
            .replace(/\+/g, '{1,250}')
            .replace(/\*/g, '{0,250}')
            .replace(/__ESCAPED_PLUS__/g, '\\+');
          regex = new RegExp(safePattern, 'i');
        } catch (e) {
          try {
            regex = new RegExp(escapeRegex(value), 'i');
          } catch (e2) {
            regex = null;
          }
        }
      }

      return {
        value,
        regex,
        confidence,
        version,
      };
    }

    transformPatterns(patterns, isRegex = true) {
      if (!patterns) return [];
      if (typeof patterns === 'string' || typeof patterns === 'number' || Array.isArray(patterns)) {
        return toArray(patterns).map((p) => this.parsePattern(p, isRegex));
      }

      const parsed = {};
      for (const [key, val] of Object.entries(patterns)) {
        parsed[key.toLowerCase()] = toArray(val).map((p) => this.parsePattern(p, isRegex));
      }
      return parsed;
    }

    setTechnologies(techs) {
      this.technologies = [];
      this.techMap.clear();

      for (const [name, tech] of Object.entries(techs)) {
        const parsedTech = {
          name,
          slug: slugify(name),
          categories: tech.cats || [],
          description: tech.description || '',
          website: tech.website || '',
          icon: tech.icon || `${name}.svg`,
          implies: toArray(tech.implies).map((imp) => {
            if (typeof imp === 'object') return imp;
            const parts = String(imp).split('\\;');
            let impConfidence = 100;
            let impVersion = '';
            for (let i = 1; i < parts.length; i++) {
              const [k, v] = parts[i].split(':');
              if (k === 'confidence') impConfidence = parseInt(v, 10) || 100;
              if (k === 'version') impVersion = v;
            }
            return { name: parts[0], confidence: impConfidence, version: impVersion };
          }),
          requires: toArray(tech.requires).map((req) => (typeof req === 'string' ? req : req.name)),
          requiresCategory: toArray(tech.requiresCategory).map((rc) => parseInt(rc, 10)),
          excludes: toArray(tech.excludes).map((ex) => (typeof ex === 'string' ? ex : ex.name)),
          url: this.transformPatterns(tech.url),
          headers: this.transformPatterns(tech.headers),
          cookies: this.transformPatterns(tech.cookies),
          meta: this.transformPatterns(tech.meta),
          scriptSrc: this.transformPatterns(tech.scriptSrc),
          scripts: this.transformPatterns(tech.scripts),
          html: this.transformPatterns(tech.html),
          css: this.transformPatterns(tech.css),
          dom: tech.dom || null,
          js: tech.js || null,
        };

        this.technologies.push(parsedTech);
        this.techMap.set(name, parsedTech);
      }
    }

    getTechnology(name) {
      return this.techMap.get(name) || null;
    }

    resolveVersion(pattern, match) {
      if (!pattern || !pattern.version) return '';
      let resolved = pattern.version;

      if (pattern.regex && match) {
        const matches = pattern.regex.exec(match);
        if (matches) {
          matches.forEach((m, idx) => {
            if (String(m).length > 20) return;
            // Parse ternary: \1?trueVal:falseVal
            const ternary = new RegExp(`\\\\${idx}\\?([^:]+):(.*)$`).exec(resolved);
            if (ternary && ternary.length === 3) {
              resolved = resolved.replace(ternary[0], m ? ternary[1] : ternary[2]);
            }
            resolved = resolved.replace(new RegExp(`\\\\${idx}`, 'g'), m || '');
          });
          resolved = resolved.replace(/\\\d+/g, '').trim();
        }
      }

      return resolved;
    }

    analyze(data = {}) {
      const detections = [];
      const {
        url = '',
        html = '',
        css = '',
        scriptSrc = [],
        scripts = [],
        meta = {},
        headers = {},
        cookies = {},
        dom = [],
        js = [],
      } = data;

      // 1. URL Matching
      if (url) {
        for (const tech of this.technologies) {
          if (!tech.url || !tech.url.length) continue;
          for (const pattern of tech.url) {
            if (pattern.regex && pattern.regex.test(url)) {
              detections.push({
                tech,
                confidence: pattern.confidence,
                version: this.resolveVersion(pattern, url),
                evidence: `Matched URL pattern: ${pattern.value}`,
              });
            }
          }
        }
      }

      // 2. HTTP Response Headers
      if (headers && Object.keys(headers).length) {
        for (const tech of this.technologies) {
          if (!tech.headers || typeof tech.headers !== 'object') continue;
          for (const [headerName, patterns] of Object.entries(tech.headers)) {
            const headerVals = headers[headerName] || headers[headerName.toLowerCase()];
            if (!headerVals) continue;
            for (const val of toArray(headerVals)) {
              for (const pattern of patterns) {
                if (pattern.regex && pattern.regex.test(val)) {
                  detections.push({
                    tech,
                    confidence: pattern.confidence,
                    version: this.resolveVersion(pattern, val),
                    evidence: `HTTP header "${headerName}: ${val.slice(0, 100)}"`,
                  });
                }
              }
            }
          }
        }
      }

      // 3. Cookies
      if (cookies && Object.keys(cookies).length) {
        const isLocalhost =
          /(?:^https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::|\/|$)/i.test(url) ||
          Boolean(data.hostname && /(?:localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(data.hostname));
        const backendCats = [18, 22, 27]; // 18: Web frameworks, 22: Web servers, 27: Programming languages

        for (const tech of this.technologies) {
          if (!tech.cookies || typeof tech.cookies !== 'object') continue;

          // On localhost, cookies are shared across all ports (RFC 6265).
          // Leftover cookies from other local servers (e.g. JSESSIONID from Java on :8080, csrftoken/django_language on :8000)
          // must not falsely identify backend frameworks or languages on a different local port.
          if (isLocalhost && (tech.categories || []).some((c) => backendCats.includes(c))) {
            continue;
          }

          for (const [cookieName, patterns] of Object.entries(tech.cookies)) {
            const cookieVals = cookies[cookieName] || cookies[cookieName.toLowerCase()];
            if (!cookieVals) continue;
            for (const val of toArray(cookieVals)) {
              for (const pattern of patterns) {
                if (!pattern.regex || pattern.regex.test(val)) {
                  detections.push({
                    tech,
                    confidence: pattern.confidence,
                    version: this.resolveVersion(pattern, val),
                    evidence: `Cookie name "${cookieName}"`,
                  });
                }
              }
            }
          }
        }
      }

      // 4. Meta Tags
      if (meta && Object.keys(meta).length) {
        for (const tech of this.technologies) {
          if (!tech.meta || typeof tech.meta !== 'object') continue;
          for (const [metaName, patterns] of Object.entries(tech.meta)) {
            const metaVals = meta[metaName] || meta[metaName.toLowerCase()];
            if (!metaVals) continue;
            for (const val of toArray(metaVals)) {
              for (const pattern of patterns) {
                if (!pattern.regex || pattern.regex.test(val)) {
                  detections.push({
                    tech,
                    confidence: pattern.confidence,
                    version: this.resolveVersion(pattern, val),
                    evidence: `Meta tag <meta name="${metaName}" content="${val.slice(0, 80)}">`,
                  });
                }
              }
            }
          }
        }
      }

      // 5. Script Sources (Script URLs)
      if (scriptSrc && scriptSrc.length) {
        for (const tech of this.technologies) {
          if (!tech.scriptSrc || !tech.scriptSrc.length) continue;
          for (const src of scriptSrc) {
            for (const pattern of tech.scriptSrc) {
              if (pattern.regex && pattern.regex.test(src)) {
                detections.push({
                  tech,
                  confidence: pattern.confidence,
                  version: this.resolveVersion(pattern, src),
                  evidence: `Script URL: ${src.slice(0, 120)}`,
                });
                break; // One hit per script tag is enough
              }
            }
          }
        }
      }

      // 6. Inline Scripts
      if (scripts && scripts.length) {
        for (const tech of this.technologies) {
          if (!tech.scripts || !tech.scripts.length) continue;
          for (const scriptContent of scripts) {
            for (const pattern of tech.scripts) {
              if (pattern.regex && pattern.regex.test(scriptContent)) {
                detections.push({
                  tech,
                  confidence: pattern.confidence,
                  version: this.resolveVersion(pattern, scriptContent),
                  evidence: `Inline script pattern match`,
                });
                break;
              }
            }
          }
        }
      }

      // 7. HTML Content
      if (html) {
        for (const tech of this.technologies) {
          if (!tech.html || !tech.html.length) continue;
          for (const pattern of tech.html) {
            if (pattern.regex && pattern.regex.test(html)) {
              detections.push({
                tech,
                confidence: pattern.confidence,
                version: this.resolveVersion(pattern, html),
                evidence: `HTML markup signature match`,
              });
            }
          }
        }
      }

      // 8. CSS Content
      if (css) {
        for (const tech of this.technologies) {
          if (!tech.css || !tech.css.length) continue;
          for (const pattern of tech.css) {
            if (pattern.regex && pattern.regex.test(css)) {
              detections.push({
                tech,
                confidence: pattern.confidence,
                version: this.resolveVersion(pattern, css),
                evidence: `CSS stylesheet pattern match`,
              });
            }
          }
        }
      }

      // 9. Window JS Globals from page inspection
      if (js && js.length) {
        for (const item of js) {
          const tech = this.getTechnology(item.name);
          if (!tech) continue;
          let version = item.value || '';
          let matched = true;
          if (tech.js && tech.js[item.chain]) {
            const raw = tech.js[item.chain];
            const pattern = this.parsePattern(raw);
            if (pattern.regex) {
              if (!item.value || !pattern.regex.test(String(item.value))) {
                matched = false;
              } else {
                version = this.resolveVersion(pattern, String(item.value)) || version;
              }
            }
          }
          if (matched) {
            detections.push({
              tech,
              confidence: 100,
              version: version && version !== 'true' ? String(version) : '',
              evidence: `Window variable "window.${item.chain}"`,
            });
          }
        }
      }

      // 10. DOM Matches from content script
      if (dom && dom.length) {
        for (const item of dom) {
          const tech = this.getTechnology(item.name);
          if (!tech) continue;
          let evidence = `DOM selector "${item.selector}"`;
          let version = item.value || '';
          if (item.property) {
            evidence += ` (property: ${item.property})`;
          } else if (item.attribute) {
            evidence += ` (attribute: ${item.attribute}="${item.value || ''}")`;
          }
          detections.push({
            tech,
            confidence: 90,
            version: version && version !== 'true' ? String(version) : '',
            evidence,
          });
        }
      }

      return detections;
    }

    resolve(detections = []) {
      const techMap = new Map();

      // Deduplicate and aggregate confidence & version
      for (const d of detections) {
        if (!d.tech) continue;
        const name = d.tech.name;
        if (!techMap.has(name)) {
          techMap.set(name, {
            tech: d.tech,
            confidence: d.confidence || 100,
            version: d.version || '',
            evidence: d.evidence ? [d.evidence] : [],
          });
        } else {
          const existing = techMap.get(name);
          existing.confidence = Math.min(100, existing.confidence + (d.confidence || 50));
          if (d.version && (!existing.version || d.version.length > existing.version.length)) {
            existing.version = d.version;
          }
          if (d.evidence && !existing.evidence.includes(d.evidence)) {
            existing.evidence.push(d.evidence);
          }
        }
      }

      // Resolve implies
      let changed = true;
      let iterations = 0;
      while (changed && iterations < 10) {
        changed = false;
        iterations++;
        for (const [name, item] of Array.from(techMap.entries())) {
          if (!item.tech.implies || !item.tech.implies.length) continue;
          for (const imp of item.tech.implies) {
            const impTech = this.getTechnology(imp.name);
            if (!impTech) continue;

            if (!techMap.has(imp.name)) {
              techMap.set(imp.name, {
                tech: impTech,
                confidence: Math.min(item.confidence, imp.confidence || 100),
                version: imp.version || '',
                evidence: [`Implied by ${name}`],
              });
              changed = true;
            } else {
              const existingImp = techMap.get(imp.name);
              if (!existingImp.evidence.some((e) => e.includes(name))) {
                existingImp.evidence.push(`Implied by ${name}`);
              }
              if (imp.version && !existingImp.version) {
                existingImp.version = imp.version;
              }
            }
          }
        }
      }

      // Resolve requires (prerequisites must be met)
      let reqChanged = true;
      let reqIterations = 0;
      while (reqChanged && reqIterations < 10) {
        reqChanged = false;
        reqIterations++;
        for (const [name, item] of Array.from(techMap.entries())) {
          if (item.tech.requires && item.tech.requires.length) {
            const hasAll = item.tech.requires.every((req) => techMap.has(req));
            if (!hasAll) {
              techMap.delete(name);
              reqChanged = true;
              continue;
            }
          }
          if (item.tech.requiresCategory && item.tech.requiresCategory.length) {
            const hasCat = item.tech.requiresCategory.some((catId) => {
              for (const other of techMap.values()) {
                if ((other.tech.categories || []).includes(catId)) return true;
              }
              return false;
            });
            if (!hasCat) {
              techMap.delete(name);
              reqChanged = true;
              continue;
            }
          }
        }
      }

      // Resolve excludes
      for (const [name, item] of Array.from(techMap.entries())) {
        if (!item.tech.excludes || !item.tech.excludes.length) continue;
        for (const exName of item.tech.excludes) {
          if (techMap.has(exName)) {
            techMap.delete(exName);
          }
        }
      }

      // Map to final clean StackScope items
      const results = Array.from(techMap.values()).map(({ tech, confidence, version, evidence }) => {
        const categories = (tech.categories || []).map((id) => this.getCategory(id));
        const primaryCat = categories[0] || { name: 'Other', priority: 10, id: 0 };

        // Determine UI category tab mapping
        let uiCategory = 'Other';
        for (const cat of categories) {
          if (UI_CATEGORY_MAP[cat.id]) {
            uiCategory = UI_CATEGORY_MAP[cat.id];
            break;
          }
        }

        // Clean up version string
        let cleanVersion = null;
        if (version && typeof version === 'string') {
          const v = version.trim().replace(/^[vV]/, '');
          if (v && v.length <= 16 && !v.includes('{') && !v.includes(';') && (parseInt(v, 10) || 0) < 10000) {
            cleanVersion = v;
          }
        }

        return {
          name: tech.name,
          slug: tech.slug,
          category: primaryCat.name,
          categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
          uiCategory,
          version: cleanVersion,
          confidence: confidence >= 80 ? 'High' : 'Medium',
          confidenceScore: confidence,
          icon: tech.icon || `${tech.name}.svg`,
          description: tech.description || '',
          website: tech.website || '',
          evidence: evidence.join('; ') || 'Technology signature detected.',
          priority: primaryCat.priority || 5,
        };
      });

      // Sort by category priority, then by name
      results.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.name.localeCompare(b.name);
      });

      return results;
    }

    analyzeAndResolve(data) {
      const detections = this.analyze(data);
      const technologies = this.resolve(detections);
      return {
        url: data.url || '',
        hostname: data.hostname || '',
        title: data.title || '',
        technologies,
        languages: data.languages || [],
        scannedAt: new Date().toISOString(),
      };
    }
  }

  return new WappalyzerEngine();
});
