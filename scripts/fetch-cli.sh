#!/bin/bash

BASE_URL="https://bybit-exchange.github.io/docs"
OUTPUT_DIR="/home/z/my-project/docs/exchange/bybit"
DELAY=3

# Function to convert HTML to basic markdown (simplified)
convert_to_md() {
    local json_file="$1"
    local output_file="$2"
    local url="$3"
    local name="$4"
    
    # Extract HTML from JSON and convert to markdown
    # This is a simplified conversion - the main content extraction
    node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$json_file', 'utf8'));
const html = data.data.html || '';
const title = data.data.title || '$name';

// Simple HTML to Markdown conversion
let content = html
    .replace(/<script[^>]*>[\\s\\S]*?<\\/script>/gi, '')
    .replace(/<style[^>]*>[\\s\\S]*?<\\/style>/gi, '')
    .replace(/<nav[^>]*>[\\s\\S]*?<\\/nav>/gi, '')
    .replace(/<!--[^>]*-->/g, '');

// Extract article content
const articleMatch = content.match(/<article[^>]*>([\\s\\S]*?)<\\/article>/i);
if (articleMatch) content = articleMatch[1];

let md = '# ' + title + '\\n\\n';
md += '> Source: $url\\n\\n---\\n\\n';

// Headers
content = content.replace(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/gi, (m, t) => '\\n# ' + t.replace(/<[^>]+>/g, '').trim() + '\\n\\n');
content = content.replace(/<h2[^>]*>([\\s\\S]*?)<\\/h2>/gi, (m, t) => '\\n## ' + t.replace(/<[^>]+>/g, '').trim() + '\\n\\n');
content = content.replace(/<h3[^>]*>([\\s\\S]*?)<\\/h3>/gi, (m, t) => '\\n### ' + t.replace(/<[^>]+>/g, '').trim() + '\\n\\n');
content = content.replace(/<h4[^>]*>([\\s\\S]*?)<\\/h4>/gi, (m, t) => '\\n#### ' + t.replace(/<[^>]+>/g, '').trim() + '\\n\\n');

// Code blocks
content = content.replace(/<pre[^>]*><code[^>]*class=\"[^\"]*language-(\\w+)[^\"]*\"[^>]*>([\\s\\S]*?)<\\/code><\\/pre>/gi, (m, lang, code) => '\\n\\\`\\\`\\\`' + lang + '\\n' + code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') + '\\n\\\`\\\`\\\`\\n\\n');
content = content.replace(/<pre[^>]*><code[^>]*>([\\s\\S]*?)<\\/code><\\/pre>/gi, (m, code) => '\\n\\\`\\\`\\\`\\n' + code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') + '\\n\\\`\\\`\\\`\\n\\n');

// Inline code
content = content.replace(/<code[^>]*>([\\s\\S]*?)<\\/code>/gi, (m, t) => '\\\`' + t.replace(/<[^>]+>/g, '').trim() + '\\\`');

// Links
content = content.replace(/<a[^>]*href=\"([^\"]*)\"[^>]*>([\\s\\S]*?)<\\/a>/gi, (m, href, t) => '[' + t.replace(/<[^>]+>/g, '').trim() + '](' + href + ')');

// Bold/Italic
content = content.replace(/<(strong|b)[^>]*>([\\s\\S]*?)<\\/(strong|b)>/gi, '**\$2**');
content = content.replace(/<(em|i)[^>]*>([\\s\\S]*?)<\\/(em|i)>/gi, '*\$2*');

// Paragraphs
content = content.replace(/<p[^>]*>([\\s\\S]*?)<\\/p>/gi, '\$1\\n\\n');
content = content.replace(/<br\\s*\\/?>/gi, '\\n');

// Lists
content = content.replace(/<li[^>]*>([\\s\\S]*?)<\\/li>/gi, (m, t) => '- ' + t.replace(/<[^>]+>/g, '').trim() + '\\n');

// Clean remaining tags
content = content.replace(/<div[^>]*>/gi, '').replace(/<\\/div>/gi, '');
content = content.replace(/<span[^>]*>/gi, '').replace(/<\\/span>/gi, '');
content = content.replace(/<[^>]+>/g, '');

// Decode entities
content = content.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '\"');

// Clean whitespace
content = content.replace(/\\n{3,}/g, '\\n\\n').trim();

md += content;
fs.writeFileSync('$output_file', md);
console.log('Saved: $output_file');
"
}

# List of remaining URLs to fetch
URLS=(
    "/v5/position/list:position-list:v5-api/position"
    "/v5/position/fee:trading-fee:v5-api/position"
    "/v5/position/margin:position-margin:v5-api/position"
    "/v5/account/wallet-balance:wallet-balance:v5-api/account"
    "/v5/account/fee-rate:fee-rate:v5-api/account"
    "/v5/account/transaction:transaction-log:v5-api/account"
    "/v5/account/contract-transaction:contract-transaction:v5-api/account"
    "/v5/account/api-key:api-key-info:v5-api/account"
    "/v5/asset/delivery:delivery-record:v5-api/asset"
    "/v5/asset/settlement:settlement-record:v5-api/asset"
    "/v5/asset/deposit:deposit-record:v5-api/asset"
    "/v5/asset/withdraw:withdraw:v5-api/asset"
    "/v5/user/sub-api:sub-api:v5-api/user"
    "/v5/user/sub-uid:sub-uid:v5-api/user"
    "/p2p/guide:guide:p2p-trading"
    "/p2p/online:online:p2p-trading"
    "/p2p/offline:offline:p2p-trading"
    "/v3/intro:introduction:tax-api-v3"
    "/pilot-feature:pilot-features:extras"
    "/changelog/v5:v5-changelog:extras"
    "/faq:faq:extras"
)

for entry in "${URLS[@]}"; do
    IFS=':' read -r path name section <<< "$entry"
    
    url="${BASE_URL}${path}"
    output_file="${OUTPUT_DIR}/${section}/${name}.md"
    temp_file="/tmp/bybit_temp_$$.json"
    
    # Skip if exists
    if [ -f "$output_file" ]; then
        echo "Skipping (exists): $section/$name"
        continue
    fi
    
    echo "Fetching: $url"
    
    # Fetch page
    z-ai function -n page_reader -a "{\"url\": \"$url\"}" -o "$temp_file" 2>/dev/null
    
    if [ -f "$temp_file" ] && [ -s "$temp_file" ]; then
        convert_to_md "$temp_file" "$output_file" "$url" "$name"
        rm -f "$temp_file"
    else
        echo "Failed: $path"
    fi
    
    sleep $DELAY
done

echo "Done!"
