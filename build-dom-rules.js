const fs = require('fs');
const path = require('path');

const techs = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'technologies.json'), 'utf8')
);

const domRules = [];
for (const [name, tech] of Object.entries(techs)) {
  if (tech.dom) {
    if (typeof tech.dom === 'string' || Array.isArray(tech.dom)) {
      const arr = Array.isArray(tech.dom) ? tech.dom : [tech.dom];
      arr.forEach((selector) => domRules.push({ name, selector, exists: true }));
    } else if (typeof tech.dom === 'object') {
      for (const [selector, rule] of Object.entries(tech.dom)) {
        if (rule && typeof rule === 'object') {
          const item = { name, selector };
          if ('exists' in rule) item.exists = true;
          if (rule.text) item.text = rule.text;
          if (rule.properties) item.properties = rule.properties;
          if (rule.attributes) item.attributes = rule.attributes;
          domRules.push(item);
        }
      }
    }
  }
}

fs.writeFileSync(
  path.join(__dirname, 'data', 'domRules.js'),
  'self.WAPPA_DOM_RULES = ' + JSON.stringify(domRules) + ';',
  'utf8'
);

console.log('Updated domRules.js successfully! Total rules:', domRules.length);
