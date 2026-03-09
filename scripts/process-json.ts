import * as fs from 'fs';
import * as path from 'path';

function decodeHtml(html: string): string {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function cleanHtmlTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, '').trim());
}

function htmlToMarkdown(html: string, title: string, url: string): string {
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) content = articleMatch[1];

  let md = `# ${title}\n\n> Source: ${url}\n\n---\n\n`;

  // Headers
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${cleanHtmlTags(t)}\n\n`);
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${cleanHtmlTags(t)}\n\n`);
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${cleanHtmlTags(t)}\n\n`);
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${cleanHtmlTags(t)}\n\n`);

  // Code blocks
  content = content.replace(/<pre[^>]*><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, lang, code) => 
    `\n\`\`\`${lang}\n${decodeHtml(code)}\n\`\`\`\n\n`);
  content = content.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => 
    `\n\`\`\`\n${decodeHtml(code)}\n\`\`\`\n\n`);

  // Inline code
  content = content.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, t) => `\`${cleanHtmlTags(t)}\``);

  // Tables
  content = content.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match) => {
    const rows: string[][] = [];
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
    let table = '\n';
    for (let i = 0; i < rows.length; i++) {
      table += '| ' + rows[i].join(' | ') + ' |\n';
      if (i === 0) table += '| ' + rows[i].map(() => '---').join(' | ') + ' |\n';
    }
    return table + '\n';
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
  content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => {
    const fullHref = href.startsWith('/docs/') ? 'https://bybit-exchange.github.io' + href : href;
    return `[${cleanHtmlTags(t)}](${fullHref})`;
  });

  // Bold/Italic
  content = content.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**');
  content = content.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*');

  // Paragraphs
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
  content = content.replace(/<br\s*\/?>/gi, '\n');

  // Clean remaining tags
  content = content.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '');
  content = content.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '');
  content = content.replace(/<[^>]+>/g, '');

  content = decodeHtml(content).replace(/\n{3,}/g, '\n\n').trim();
  return md + content;
}

function extractTitle(html: string, defaultTitle: string): string {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return h1Match ? cleanHtmlTags(h1Match[1]) : defaultTitle;
}

// Process JSON file
const jsonFile = process.argv[2];
const outputFile = process.argv[3];
const url = process.argv[4];
const name = process.argv[5];

if (!jsonFile || !outputFile || !url || !name) {
  console.log('Usage: ts-node process-json.ts <json_file> <output_file> <url> <name>');
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
  if (data.code === 200 && data.data && data.data.html) {
    const title = extractTitle(data.data.html, name);
    const markdown = htmlToMarkdown(data.data.html, title, url);
    fs.writeFileSync(outputFile, markdown);
    console.log(`Saved: ${outputFile}`);
  } else {
    console.log('Invalid data');
  }
} catch (error) {
  console.error('Error:', error);
}
