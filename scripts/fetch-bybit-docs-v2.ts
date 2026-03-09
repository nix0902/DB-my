import ZAI from 'z-ai-web-dev-sdk';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://bybit-exchange.github.io/docs';
const OUTPUT_DIR = '/home/z/my-project/docs/exchange/bybit';
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds
const MAX_RETRIES = 3;

// Complete list of Bybit documentation URLs based on the sidebar structure
const ALL_URLS = [
  // ==================== V5 API ====================
  // Main pages
  { path: '/v5/intro', section: 'v5-api', name: 'introduction' },
  { path: '/v5/guide', section: 'v5-api', name: 'integration-guidance' },
  { path: '/v5/announcement', section: 'v5-api', name: 'get-announcement' },
  { path: '/v5/smp', section: 'v5-api', name: 'self-match-prevention' },
  { path: '/v5/copytrade', section: 'v5-api', name: 'copy-trading' },
  { path: '/v5/demo', section: 'v5-api', name: 'demo-trading' },
  { path: '/v5/system-status', section: 'v5-api', name: 'system-status' },
  { path: '/v5/enum', section: 'v5-api', name: 'enums-definitions' },
  { path: '/v5/error', section: 'v5-api', name: 'error-codes' },
  
  // Market endpoints
  { path: '/v5/market/time', section: 'v5-api/market', name: 'server-time' },
  { path: '/v5/market/instrument-info', section: 'v5-api/market', name: 'instrument-info' },
  { path: '/v5/market/kline', section: 'v5-api/market', name: 'kline' },
  { path: '/v5/market/mark-kline', section: 'v5-api/market', name: 'mark-kline' },
  { path: '/v5/market/index-kline', section: 'v5-api/market', name: 'index-kline' },
  { path: '/v5/market/tickers', section: 'v5-api/market', name: 'tickers' },
  { path: '/v5/market/orderbook', section: 'v5-api/market', name: 'orderbook' },
  { path: '/v5/market/trade', section: 'v5-api/market', name: 'public-trading-records' },
  { path: '/v5/market/insurance', section: 'v5-api/market', name: 'insurance' },
  { path: '/v5/market/funding/history', section: 'v5-api/market', name: 'funding-rate-history' },
  { path: '/v5/market/delivery-price', section: 'v5-api/market', name: 'delivery-price' },
  
  // Trade endpoints
  { path: '/v5/trade/order', section: 'v5-api/trade', name: 'place-order' },
  { path: '/v5/trade/amend-order', section: 'v5-api/trade', name: 'amend-order' },
  { path: '/v5/trade/cancel-order', section: 'v5-api/trade', name: 'cancel-order' },
  { path: '/v5/trade/open-orders', section: 'v5-api/trade', name: 'open-orders' },
  { path: '/v5/trade/cancel-all', section: 'v5-api/trade', name: 'cancel-all-orders' },
  { path: '/v5/trade/order-history', section: 'v5-api/trade', name: 'order-history' },
  { path: '/v5/trade/execution', section: 'v5-api/trade', name: 'trade-history' },
  { path: '/v5/trade/batch-order', section: 'v5-api/trade', name: 'batch-place-order' },
  { path: '/v5/trade/set-leverage', section: 'v5-api/trade', name: 'set-leverage' },
  { path: '/v5/trade/set-tpsl', section: 'v5-api/trade', name: 'set-tp-sl' },
  { path: '/v5/trade/stop-order', section: 'v5-api/trade', name: 'stop-order' },
  { path: '/v5/trade/position', section: 'v5-api/trade', name: 'position' },
  
  // Position endpoints
  { path: '/v5/position/list', section: 'v5-api/position', name: 'position-list' },
  { path: '/v5/position/fee', section: 'v5-api/position', name: 'trading-fee' },
  { path: '/v5/position/margin', section: 'v5-api/position', name: 'position-margin' },
  
  // Pre-upgrade
  { path: '/v5/pre-upgrade/account', section: 'v5-api/pre-upgrade', name: 'account' },
  { path: '/v5/pre-upgrade/position', section: 'v5-api/pre-upgrade', name: 'position' },
  { path: '/v5/pre-upgrade/order', section: 'v5-api/pre-upgrade', name: 'order' },
  
  // Account endpoints
  { path: '/v5/account/wallet-balance', section: 'v5-api/account', name: 'wallet-balance' },
  { path: '/v5/account/fee-rate', section: 'v5-api/account', name: 'fee-rate' },
  { path: '/v5/account/transaction', section: 'v5-api/account', name: 'transaction-log' },
  { path: '/v5/account/contract-transaction', section: 'v5-api/account', name: 'contract-transaction' },
  { path: '/v5/account/api-key', section: 'v5-api/account', name: 'api-key-info' },
  
  // Asset endpoints
  { path: '/v5/asset/delivery', section: 'v5-api/asset', name: 'delivery-record' },
  { path: '/v5/asset/settlement', section: 'v5-api/asset', name: 'settlement-record' },
  { path: '/v5/asset/deposit', section: 'v5-api/asset', name: 'deposit-record' },
  { path: '/v5/asset/withdraw', section: 'v5-api/asset', name: 'withdraw' },
  { path: '/v5/asset/coin-greeks', section: 'v5-api/asset', name: 'coin-greeks' },
  
  // User endpoints
  { path: '/v5/user/sub-api', section: 'v5-api/user', name: 'sub-api' },
  { path: '/v5/user/sub-uid', section: 'v5-api/user', name: 'sub-uid' },
  
  // Spread Trading
  { path: '/v5/spread/order', section: 'v5-api/spread-trading', name: 'order' },
  { path: '/v5/spread/position', section: 'v5-api/spread-trading', name: 'position' },
  
  // RFQ Trading
  { path: '/v5/rfq/order', section: 'v5-api/rfq-trading', name: 'order' },
  { path: '/v5/rfq/quote', section: 'v5-api/rfq-trading', name: 'quote' },
  
  // Affiliate
  { path: '/v5/affiliate/sub-affiliate', section: 'v5-api/affiliate', name: 'sub-affiliate' },
  { path: '/v5/affiliate/earnings', section: 'v5-api/affiliate', name: 'earnings' },
  
  // Spot Margin Trade (UTA)
  { path: '/v5/spot-margin-trade/data', section: 'v5-api/spot-margin-trade-uta', name: 'data' },
  { path: '/v5/spot-margin-trade/account', section: 'v5-api/spot-margin-trade-uta', name: 'account' },
  
  // Crypto Loan (New)
  { path: '/v5/crypto-loan/loan', section: 'v5-api/crypto-loan-new', name: 'loan' },
  { path: '/v5/crypto-loan/repay', section: 'v5-api/crypto-loan-new', name: 'repay' },
  
  // Crypto Loan (legacy)
  { path: '/v5/crypto-loan-legacy', section: 'v5-api/crypto-loan-legacy', name: 'overview' },
  
  // Institutional Loan
  { path: '/v5/ins-loan/product-info', section: 'v5-api/institutional-loan', name: 'product-info' },
  { path: '/v5/ins-loan/borrow', section: 'v5-api/institutional-loan', name: 'borrow' },
  { path: '/v5/ins-loan/repay', section: 'v5-api/institutional-loan', name: 'repay' },
  { path: '/v5/ins-loan/assoc-uid', section: 'v5-api/institutional-loan', name: 'assoc-uid' },
  
  // Broker
  { path: '/v5/broker/earnings', section: 'v5-api/broker', name: 'earnings' },
  { path: '/v5/broker/account', section: 'v5-api/broker', name: 'account' },
  
  // Earn
  { path: '/v5/earn/product', section: 'v5-api/earn', name: 'product' },
  { path: '/v5/earn/stake', section: 'v5-api/earn', name: 'stake' },
  { path: '/v5/earn/order', section: 'v5-api/earn', name: 'order' },
  
  // SBE
  { path: '/v5/sbe', section: 'v5-api/sbe', name: 'overview' },
  
  // WebSocket Stream
  { path: '/v5/websocket/public/guideline', section: 'v5-api/websocket', name: 'public-channel' },
  { path: '/v5/websocket/private/guideline', section: 'v5-api/websocket', name: 'private-channel' },
  
  // Rate Limit
  { path: '/v5/rate-limit', section: 'v5-api/rate-limit', name: 'rate-limit' },
  
  // Abandoned Endpoints
  { path: '/v5/abandoned', section: 'v5-api/abandoned', name: 'abandoned-endpoints' },
  
  // ==================== P2P Trading ====================
  { path: '/p2p/guide', section: 'p2p-trading', name: 'guide' },
  { path: '/p2p/online', section: 'p2p-trading', name: 'online' },
  { path: '/p2p/offline', section: 'p2p-trading', name: 'offline' },
  
  // ==================== Tax API V3 ====================
  { path: '/v3/intro', section: 'tax-api-v3', name: 'introduction' },
  
  // ==================== Extras ====================
  { path: '/pilot-feature', section: 'extras', name: 'pilot-features' },
  { path: '/changelog/v5', section: 'extras', name: 'v5-changelog' },
  { path: '/faq', section: 'extras', name: 'faq' },
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function decodeHtml(html: string): string {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function cleanHtmlTags(html: string): string {
  return decodeHtml(html
    .replace(/<[^>]+>/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .trim());
}

function htmlToMarkdown(html: string, title: string, url: string): string {
  let content = html;
  
  // Remove script, style, nav, footer
  content = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  
  // Find main content
  const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    content = articleMatch[1];
  }
  
  let markdown = `# ${title}\n\n`;
  markdown += `> Source: ${url}\n\n`;
  markdown += `---\n\n`;
  
  // Convert headers
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => `\n# ${cleanHtmlTags(text)}\n\n`);
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => `\n## ${cleanHtmlTags(text)}\n\n`);
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => `\n### ${cleanHtmlTags(text)}\n\n`);
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, text) => `\n#### ${cleanHtmlTags(text)}\n\n`);
  content = content.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, text) => `\n##### ${cleanHtmlTags(text)}\n\n`);
  
  // Code blocks
  content = content.replace(/<pre[^>]*><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, lang, code) => `\n\`\`\`${lang}\n${decodeHtml(code)}\n\`\`\`\n\n`);
  content = content.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => `\n\`\`\`\n${decodeHtml(code)}\n\`\`\`\n\n`);
  
  // Inline code
  content = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => `\`${cleanHtmlTags(code)}\``);
  
  // Tables
  content = content.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match) => {
    let rows: string[][] = [];
    const rowMatches = match.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    for (const row of rowMatches) {
      const cells: string[] = [];
      const cellMatches = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
      for (const cell of cellMatches) {
        cells.push(cleanHtmlTags(cell.replace(/<\/?t[dh][^>]*>/gi, '')).trim());
      }
      if (cells.length > 0) rows.push(cells);
    }
    if (rows.length === 0) return match;
    let mdTable = '\n';
    for (let i = 0; i < rows.length; i++) {
      mdTable += '| ' + rows[i].join(' | ') + ' |\n';
      if (i === 0) mdTable += '| ' + rows[i].map(() => '---').join(' | ') + ' |\n';
    }
    return mdTable + '\n';
  });
  
  // Lists
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, list) => {
    const items = list.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return '\n' + items.map(item => `- ${cleanHtmlTags(item.replace(/<\/?li[^>]*>/gi, '')).trim()}`).join('\n') + '\n\n';
  });
  content = content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, list) => {
    const items = list.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    return '\n' + items.map((item, i) => `${i + 1}. ${cleanHtmlTags(item.replace(/<\/?li[^>]*>/gi, '')).trim()}`).join('\n') + '\n\n';
  });
  
  // Links
  content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = cleanHtmlTags(text);
    let fullHref = href.startsWith('/docs/') ? 'https://bybit-exchange.github.io' + href : href;
    return `[${cleanText}](${fullHref})`;
  });
  
  // Bold and Italic
  content = content.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**');
  content = content.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*');
  
  // Paragraphs and line breaks
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
  content = content.replace(/<br\s*\/?>/gi, '\n');
  content = content.replace(/<hr\s*\/?>/gi, '\n---\n');
  
  // Blockquotes
  content = content.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, quote) => {
    const lines = cleanHtmlTags(quote).split('\n');
    return '\n' + lines.map((l: string) => `> ${l}`).join('\n') + '\n\n';
  });
  
  // Admonitions
  content = content.replace(/<div[^>]*class="[^"]*admonition[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (_, admonition) => {
    let type = 'note';
    if (admonition.includes('admonition-tip') || admonition.includes('alert--success')) type = 'TIP';
    else if (admonition.includes('admonition-warning') || admonition.includes('alert--warning')) type = 'WARNING';
    else if (admonition.includes('admonition-danger') || admonition.includes('alert--danger')) type = 'DANGER';
    else if (admonition.includes('admonition-info') || admonition.includes('alert--info')) type = 'INFO';
    else if (admonition.includes('admonition-caution')) type = 'CAUTION';
    
    const contentMatch = admonition.match(/<div[^>]*class="[^"]*admonitionContent[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    let content = contentMatch ? cleanHtmlTags(contentMatch[1]) : '';
    return `\n> **${type}**\n> \n> ${content.replace(/\n/g, '\n> ')}\n\n`;
  });
  
  // Clean remaining tags
  content = content.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '');
  content = content.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '');
  content = content.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');
  content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
  content = content.replace(/<[^>]+>/g, '');
  
  // Final cleanup
  content = decodeHtml(content);
  content = content.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
  
  return markdown + content;
}

async function fetchPageWithRetry(zai: any, url: string, retries = MAX_RETRIES): Promise<{ title: string; html: string } | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`  Fetching (attempt ${attempt}/${retries}): ${url}`);
      const result = await zai.functions.invoke('page_reader', { url });
      
      if (result.code === 200 && result.data && result.data.html) {
        return {
          title: result.data.title || 'Untitled',
          html: result.data.html,
        };
      }
      return null;
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('Too many requests')) {
        console.log(`  Rate limited, waiting ${DELAY_BETWEEN_REQUESTS * 2}ms...`);
        await sleep(DELAY_BETWEEN_REQUESTS * 2);
      } else {
        console.error(`  Error: ${error.message}`);
        if (attempt < retries) {
          await sleep(DELAY_BETWEEN_REQUESTS);
        }
      }
    }
  }
  return null;
}

function extractTitleFromHtml(html: string, defaultTitle: string): string {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return h1Match ? cleanHtmlTags(h1Match[1]) : defaultTitle;
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function fileExists(filepath: string): boolean {
  return fs.existsSync(filepath);
}

async function main() {
  console.log('Starting Bybit documentation extraction...');
  console.log('='.repeat(60));
  
  const zai = await ZAI.create();
  const urlsToFetch = ALL_URLS;
  
  console.log(`Total URLs to fetch: ${urlsToFetch.length}`);
  
  // Create directories
  const sections = new Set(urlsToFetch.map(u => u.section));
  for (const section of sections) {
    const sectionDir = path.join(OUTPUT_DIR, section);
    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true });
    }
  }
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  for (const urlInfo of urlsToFetch) {
    const filename = sanitizeFilename(urlInfo.name) + '.md';
    const outputPath = path.join(OUTPUT_DIR, urlInfo.section, filename);
    
    // Skip if file already exists
    if (fileExists(outputPath)) {
      console.log(`  Skipping (exists): ${urlInfo.section}/${filename}`);
      skipCount++;
      continue;
    }
    
    const fullUrl = BASE_URL + urlInfo.path;
    await sleep(DELAY_BETWEEN_REQUESTS);
    
    const pageData = await fetchPageWithRetry(zai, fullUrl);
    
    if (pageData && pageData.html) {
      const title = extractTitleFromHtml(pageData.html, urlInfo.name);
      const markdown = htmlToMarkdown(pageData.html, title, fullUrl);
      fs.writeFileSync(outputPath, markdown);
      console.log(`  Saved: ${urlInfo.section}/${filename}`);
      successCount++;
    } else {
      console.log(`  Failed: ${urlInfo.path}`);
      failCount++;
    }
  }
  
  // Update main index
  let indexContent = `# Bybit API Documentation\n\n`;
  indexContent += `> Auto-generated from https://bybit-exchange.github.io/docs/\n\n`;
  indexContent += `---\n\n`;
  indexContent += `## Contents\n\n`;
  
  const groupedBySection: Map<string, typeof urlsToFetch> = new Map();
  for (const urlInfo of urlsToFetch) {
    if (!groupedBySection.has(urlInfo.section)) {
      groupedBySection.set(urlInfo.section, []);
    }
    groupedBySection.get(urlInfo.section)!.push(urlInfo);
  }
  
  for (const [section, urls] of groupedBySection) {
    const sectionTitle = section.split('/').map(s => 
      s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    ).join(' > ');
    indexContent += `### ${sectionTitle}\n\n`;
    for (const urlInfo of urls) {
      const filename = sanitizeFilename(urlInfo.name) + '.md';
      indexContent += `- [${urlInfo.name.replace(/-/g, ' ')}](./${section}/${filename})\n`;
    }
    indexContent += '\n';
  }
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), indexContent);
  
  console.log('\n' + '='.repeat(60));
  console.log('Documentation extraction complete!');
  console.log(`Success: ${successCount}, Skipped: ${skipCount}, Failed: ${failCount}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
