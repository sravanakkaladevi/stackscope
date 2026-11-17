const assert = require('assert');
const fs = require('fs');
const path = require('path');
const engine = require('./wappalyzerEngine.js');

const techs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'technologies.json'), 'utf8'));
const cats = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'categories.json'), 'utf8'));

engine.init(techs, cats);

console.log('Testing End-to-End Scenarios with Wappalyzer Engine for StackScope...\n');

// Test Case 1: Next.js + Vercel
{
  const testNext = {
    url: 'https://vercel.com',
    hostname: 'vercel.com',
    headers: {
      'server': ['Vercel'],
      'x-powered-by': ['Next.js 14.2.3']
    },
    scriptSrc: [
      'https://assets.vercel.com/_next/static/chunks/main-12345.js',
      'https://www.googletagmanager.com/gtag/js?id=G-123'
    ],
    cookies: {
      '_ga': ['GA1.2.123456']
    },
    js: [
      { name: 'React', chain: 'React.version', value: '18.2.0' },
      { name: 'Next.js', chain: '__NEXT_DATA__', value: '' }
    ],
    languages: [
      { name: 'JavaScript', category: 'Languages', uiCategory: 'Languages' },
      { name: 'HTML / CSS', category: 'Languages', uiCategory: 'Languages' }
    ]
  };

  const res = engine.analyzeAndResolve(testNext);
  const names = res.technologies.map(t => t.name);

  console.log('Scenario 1: Next.js + Vercel');
  console.log('Detected:', names.join(', '));
  assert(names.includes('Next.js'), 'Must detect Next.js');
  assert(names.includes('React'), 'Must detect React');
  assert(names.includes('Vercel'), 'Must detect Vercel');
  assert(names.includes('Google Analytics'), 'Must detect Google Analytics');
  assert(names.includes('Node.js'), 'Must imply Node.js');
  const nextTech = res.technologies.find(t => t.name === 'Next.js');
  assert.strictEqual(nextTech.version, '14.2.3', 'Must extract version 14.2.3');
  console.log('  -> PASSED\n');
}

// Test Case 2: Shopify Store
{
  const testShopify = {
    url: 'https://shop.gymshark.com',
    hostname: 'shop.gymshark.com',
    headers: {
      'server': ['cloudflare'],
      'x-shopify-stage': ['production']
    },
    scriptSrc: [
      'https://cdn.shopify.com/s/files/1/0000/assets/theme.js'
    ],
    cookies: {
      '_shopify_s': ['abc123456']
    },
    meta: {
      'shopify-digital-wallet': ['/checkout']
    },
    js: [
      { name: 'Shopify', chain: 'Shopify.shop', value: 'gymshark.myshopify.com' }
    ]
  };

  const res = engine.analyzeAndResolve(testShopify);
  const names = res.technologies.map(t => t.name);

  console.log('Scenario 2: Shopify Store');
  console.log('Detected:', names.join(', '));
  assert(names.includes('Shopify'), 'Must detect Shopify');
  assert(names.includes('Cloudflare'), 'Must detect Cloudflare');
  console.log('  -> PASSED\n');
}

// Test Case 3: WordPress Blog
{
  const testWp = {
    url: 'https://techcrunch.com',
    hostname: 'techcrunch.com',
    headers: {
      'server': ['nginx'],
      'x-powered-by': ['PHP/8.2.14']
    },
    meta: {
      'generator': ['WordPress 6.4.2']
    },
    scriptSrc: [
      'https://techcrunch.com/wp-content/themes/tc/bundle.js',
      'https://techcrunch.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1'
    ],
    cookies: {
      'wordpress_logged_in': ['true']
    }
  };

  const res = engine.analyzeAndResolve(testWp);
  const names = res.technologies.map(t => t.name);

  console.log('Scenario 3: WordPress Blog');
  console.log('Detected:', names.join(', '));
  assert(names.includes('WordPress'), 'Must detect WordPress');
  assert(names.includes('PHP'), 'Must detect PHP');
  assert(names.includes('Nginx'), 'Must detect Nginx');
  assert(names.includes('MySQL'), 'Must imply MySQL');
  const wpTech = res.technologies.find(t => t.name === 'WordPress');
  assert.strictEqual(wpTech.version, '6.4.2', 'Must extract WordPress version 6.4.2');
  const phpTech = res.technologies.find(t => t.name === 'PHP');
  assert.strictEqual(phpTech.version, '8.2.14', 'Must extract PHP version 8.2.14');
  console.log('  -> PASSED\n');
}

console.log('All End-to-End detection scenarios verified successfully!');
