import ZAI from 'z-ai-web-dev-sdk';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://bybit-exchange.github.io/docs';
const OUTPUT_DIR = '/home/z/my-project/docs/exchange/bybit';

// Complete URL structure for Bybit V5 API documentation
const V5_URLS = [
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
  
  // Market
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
  
  // Trade
  { path: '/v5/trade/order', section: 'v5-api/trade', name: 'place-order' },
  { path: '/v5/trade/amend-order', section: 'v5-api/trade', name: 'amend-order' },
  { path: '/v5/trade/cancel-order', section: 'v5-api/trade', name: 'cancel-order' },
  { path: '/v5/trade/open-orders', section: 'v5-api/trade', name: 'open-orders' },
  { path: '/v5/trade/cancel-all', section: 'v5-api/trade', name: 'cancel-all-orders' },
  { path: '/v5/trade/order-history', section: 'v5-api/trade', name: 'order-history' },
  { path: '/v5/trade/execution', section: 'v5-api/trade', name: 'trade-history' },
  { path: '/v5/trade/batch-order', section: 'v5-api/trade', name: 'batch-place-order' },
  { path: '/v5/trade/position', section: 'v5-api/trade', name: 'position' },
  { path: '/v5/trade/set-leverage', section: 'v5-api/trade', name: 'set-leverage' },
  { path: '/v5/trade/set-tpsl', section: 'v5-api/trade', name: 'set-tp-sl' },
  { path: '/v5/trade/stop-order', section: 'v5-api/trade', name: 'stop-order' },
  
  // Position
  { path: '/v5/position', section: 'v5-api/position', name: 'position-overview' },
  { path: '/v5/position/list', section: 'v5-api/position', name: 'position-list' },
  { path: '/v5/position/fee', section: 'v5-api/position', name: 'trading-fee' },
  { path: '/v5/position/margin', section: 'v5-api/position', name: 'position-margin' },
  
  // Account
  { path: '/v5/account', section: 'v5-api/account', name: 'account-overview' },
  { path: '/v5/account/wallet-balance', section: 'v5-api/account', name: 'wallet-balance' },
  { path: '/v5/account/fee-rate', section: 'v5-api/account', name: 'fee-rate' },
  { path: '/v5/account/transaction', section: 'v5-api/account', name: 'transaction-log' },
  { path: '/v5/account/contract-transaction', section: 'v5-api/account', name: 'contract-transaction' },
  { path: '/v5/account/api-key', section: 'v5-api/account', name: 'api-key-info' },
  
  // Asset
  { path: '/v5/asset', section: 'v5-api/asset', name: 'asset-overview' },
  { path: '/v5/asset/delivery', section: 'v5-api/asset', name: 'delivery-record' },
  { path: '/v5/asset/settlement', section: 'v5-api/asset', name: 'settlement-record' },
  { path: '/v5/asset/deposit', section: 'v5-api/asset', name: 'deposit-record' },
  { path: '/v5/asset/withdraw', section: 'v5-api/asset', name: 'withdraw' },
  { path: '/v5/asset/coin-greeks', section: 'v5-api/asset', name: 'coin-greeks' },
  
  // User
  { path: '/v5/user', section: 'v5-api/user', name: 'user-overview' },
  { path: '/v5/user/sub-api', section: 'v5-api/user', name: 'sub-api' },
  { path: '/v5/user/sub-uid', section: 'v5-api/user', name: 'sub-uid' },
  
  // WebSocket
  { path: '/v5/websocket', section: 'v5-api/websocket', name: 'websocket-overview' },
  { path: '/v5/websocket/public', section: 'v5-api/websocket', name: 'public-channel' },
  { path: '/v5/websocket/private', section: 'v5-api/websocket', name: 'private-channel' },
  
  // Affiliate
  { path: '/v5/affiliate', section: 'v5-api/affiliate', name: 'affiliate-overview' },
  
  // Broker
  { path: '/v5/broker', section: 'v5-api/broker', name: 'broker-overview' },
  { path: '/v5/broker/earnings', section: 'v5-api/broker', name: 'broker-earnings' },
  
  // Earn
  { path: '/v5/earn', section: 'v5-api/earn', name: 'earn-overview' },
  
  // SBE
  { path: '/v5/sbe', section: 'v5-api/sbe', name: 'sbe-overview' },
  
  // Rate Limit
  { path: '/v5/rate-limit', section: 'v5-api/rate-limit', name: 'rate-limit' },
  
  // Pre-upgrade
  { path: '/v5/pre-upgrade', section: 'v5-api/pre-upgrade', name: 'pre-upgrade' },
  
  // Spot Margin Trade
  { path: '/v5/spot-margin', section: 'v5-api/spot-margin', name: 'spot-margin-overview' },
  
  // Crypto Loan
  { path: '/v5/crypto-loan', section: 'v5-api/crypto-loan', name: 'crypto-loan-overview' },
  
  // Institutional Loan
  { path: '/v5/ins-loan', section: 'v5-api/institutional-loan', name: 'institutional-loan' },
  
  // Spread Trading
  { path: '/v5/spread', section: 'v5-api/spread-trading', name: 'spread-trading' },
  
  // RFQ Trading
  { path: '/v5/rfq', section: 'v5-api/rfq-trading', name: 'rfq-trading' },
];

// P2P Trading URLs
const P2P_URLS = [
  { path: '/p2p/guide', section: 'p2p-trading', name: 'guide' },
  { path: '/p2p/online', section: 'p2p-trading', name: 'online' },
  { path: '/p2p/offline', section: 'p2p-trading', name: 'offline' },
];

// Tax API V3 URLs
const TAX_V3_URLS = [
  { path: '/v3/intro', section: 'tax-api-v3', name: 'introduction' },
];

// Other sections
const OTHER_URLS = [
  { path: '/pilot-feature', section: 'extras', name: 'pilot-features' },
  { path: '/changelog/v5', section: 'extras', name: 'v5-changelog' },
  { path: '/faq', section: 'extras', name: 'faq' },
];

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
  
  // Remove script, style, nav, footer, etc.
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
  
  // Find markdown content area
  const markdownMatch = content.match(/<div[^>]*class="[^"]*markdown[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>\s*)?<\/article>/i);
  if (markdownMatch) {
    content = markdownMatch[1];
  }
  
  let markdown = `# ${title}\n\n`;
  markdown += `> Source: ${url}\n\n`;
  markdown += `---\n\n`;
  
  // Convert headers
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => {
    const cleanText = cleanHtmlTags(text);
    return `\n# ${cleanText}\n\n`;
  });
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => {
    const cleanText = cleanHtmlTags(text);
    return `\n## ${cleanText}\n\n`;
  });
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => {
    const cleanText = cleanHtmlTags(text);
    return `\n### ${cleanText}\n\n`;
  });
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, text) => {
    const cleanText = cleanHtmlTags(text);
    return `\n#### ${cleanText}\n\n`;
  });
  content = content.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, text) => {
    const cleanText = cleanHtmlTags(text);
    return `\n##### ${cleanText}\n\n`;
  });
  
  // Code blocks with language
  content = content.replace(/<pre[^>]*><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, lang, code) => {
    const cleanCode = decodeHtml(code);
    return `\n\`\`\`${lang}\n${cleanCode}\n\`\`\`\n\n`;
  });
  
  // Code blocks without language
  content = content.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
    const cleanCode = decodeHtml(code);
    return `\n\`\`\`\n${cleanCode}\n\`\`\`\n\n`;
  });
  
  // Inline code
  content = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => {
    const cleanCode = cleanHtmlTags(code);
    return `\`${cleanCode}\``;
  });
  
  // Tables
  content = content.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match) => {
    let tableContent = match;
    let rows: string[][] = [];
    
    const rowMatches = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    for (const row of rowMatches) {
      const cells: string[] = [];
      const cellMatches = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
      for (const cell of cellMatches) {
        const cellText = cleanHtmlTags(cell.replace(/<\/?t[dh][^>]*>/gi, ''));
        cells.push(cellText.trim());
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
    
    if (rows.length === 0) return match;
    
    let mdTable = '\n';
    for (let i = 0; i < rows.length; i++) {
      mdTable += '| ' + rows[i].join(' | ') + ' |\n';
      if (i === 0) {
        mdTable += '| ' + rows[i].map(() => '---').join(' | ') + ' |\n';
      }
    }
    mdTable += '\n';
    
    return mdTable;
  });
  
  // Unordered lists
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, list) => {
    const items = list.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    let mdList = '\n';
    for (const item of items) {
      const text = cleanHtmlTags(item.replace(/<\/?li[^>]*>/gi, ''));
      mdList += `- ${text.trim()}\n`;
    }
    mdList += '\n';
    return mdList;
  });
  
  // Ordered lists
  content = content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, list) => {
    const items = list.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    let mdList = '\n';
    for (let i = 0; i < items.length; i++) {
      const text = cleanHtmlTags(items[i].replace(/<\/?li[^>]*>/gi, ''));
      mdList += `${i + 1}. ${text.trim()}\n`;
    }
    mdList += '\n';
    return mdList;
  });
  
  // Links
  content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = cleanHtmlTags(text);
    // Convert relative links
    let fullHref = href;
    if (href.startsWith('/docs/')) {
      fullHref = 'https://bybit-exchange.github.io' + href;
    }
    return `[${cleanText}](${fullHref})`;
  });
  
  // Bold
  content = content.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**');
  
  // Italic
  content = content.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*');
  
  // Paragraphs
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
  
  // Line breaks
  content = content.replace(/<br\s*\/?>/gi, '\n');
  
  // Horizontal rules
  content = content.replace(/<hr\s*\/?>/gi, '\n---\n');
  
  // Blockquotes
  content = content.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, quote) => {
    const lines = cleanHtmlTags(quote).split('\n');
    return '\n' + lines.map((l: string) => `> ${l}`).join('\n') + '\n\n';
  });
  
  // Divs with admonition (info, warning, tip, etc.)
  content = content.replace(/<div[^>]*class="[^"]*admonition[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (_, admonition) => {
    const headingMatch = admonition.match(/<div[^>]*class="[^"]*admonitionHeading[^"]*"[^>]*>[\s\S]*?<\/div>/i);
    const contentMatch = admonition.match(/<div[^>]*class="[^"]*admonitionContent[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    
    let type = 'note';
    if (admonition.includes('admonition-tip') || admonition.includes('alert--success')) {
      type = 'tip';
    } else if (admonition.includes('admonition-warning') || admonition.includes('alert--warning')) {
      type = 'warning';
    } else if (admonition.includes('admonition-danger') || admonition.includes('alert--danger')) {
      type = 'danger';
    } else if (admonition.includes('admonition-info') || admonition.includes('alert--info')) {
      type = 'info';
    } else if (admonition.includes('admonition-caution')) {
      type = 'caution';
    }
    
    let content = '';
    if (contentMatch) {
      content = cleanHtmlTags(contentMatch[1]);
    }
    
    return `\n> **${type.toUpperCase()}**\n> \n> ${content.replace(/\n/g, '\n> ')}\n\n`;
  });
  
  // Clean up remaining HTML tags
  content = content.replace(/<div[^>]*>/gi, '');
  content = content.replace(/<\/div>/gi, '');
  content = content.replace(/<span[^>]*>/gi, '');
  content = content.replace(/<\/span>/gi, '');
  content = content.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');
  content = content.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
  content = content.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  content = decodeHtml(content);
  
  // Clean up whitespace
  content = content
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
  
  markdown += content;
  
  return markdown;
}

async function fetchPage(zai: any, url: string): Promise<{ title: string; html: string } | null> {
  try {
    console.log(`  Fetching: ${url}`);
    const result = await zai.functions.invoke('page_reader', { url });
    
    if (result.code === 200 && result.data && result.data.html) {
      return {
        title: result.data.title || 'Untitled',
        html: result.data.html,
      };
    }
    return null;
  } catch (error) {
    console.error(`  Error fetching ${url}:`, error);
    return null;
  }
}

function extractTitleFromHtml(html: string, defaultTitle: string): string {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    return cleanHtmlTags(h1Match[1]);
  }
  return defaultTitle;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('Starting Bybit documentation extraction...');
  console.log('='.repeat(60));
  
  const zai = await ZAI.create();
  
  // Combine all URLs
  const allUrls = [...V5_URLS, ...P2P_URLS, ...TAX_V3_URLS, ...OTHER_URLS];
  console.log(`Total URLs to fetch: ${allUrls.length}`);
  
  // Get unique sections
  const sections = new Set(allUrls.map(u => u.section));
  
  // Create directories
  for (const section of sections) {
    const sectionDir = path.join(OUTPUT_DIR, section);
    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true });
    }
  }
  
  let successCount = 0;
  let failCount = 0;
  
  // Fetch and save each page
  for (const urlInfo of allUrls) {
    const fullUrl = BASE_URL + urlInfo.path;
    const pageData = await fetchPage(zai, fullUrl);
    
    if (pageData && pageData.html) {
      const title = extractTitleFromHtml(pageData.html, urlInfo.name);
      const markdown = htmlToMarkdown(pageData.html, title, fullUrl);
      
      const filename = sanitizeFilename(urlInfo.name) + '.md';
      const outputPath = path.join(OUTPUT_DIR, urlInfo.section, filename);
      fs.writeFileSync(outputPath, markdown);
      console.log(`  Saved: ${urlInfo.section}/${filename}`);
      successCount++;
    } else {
      console.log(`  Failed: ${urlInfo.path}`);
      failCount++;
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Create main index
  let indexContent = `# Bybit API Documentation\n\n`;
  indexContent += `> Auto-generated from https://bybit-exchange.github.io/docs/\n\n`;
  indexContent += `---\n\n`;
  indexContent += `## Contents\n\n`;
  
  const groupedBySection: Map<string, typeof allUrls> = new Map();
  for (const urlInfo of allUrls) {
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
      const relPath = `./${section}/${filename}`;
      indexContent += `- [${urlInfo.name.replace(/-/g, ' ')}](${relPath})\n`;
    }
    indexContent += '\n';
  }
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), indexContent);
  
  console.log('\n' + '='.repeat(60));
  console.log('Documentation extraction complete!');
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
