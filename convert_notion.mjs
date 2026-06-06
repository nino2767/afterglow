import fs from 'fs';
import path from 'path';

const token = process.env.NOTION_API_KEY;
if (!token) {
  console.error("Error: NOTION_API_KEY environment variable is not set.");
  process.exit(1);
}
const outputBaseDir = './docs';

function sanitizeFilename(name) {
  return name
    .replace(/[\/\\?%*:|"<>\.]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveFolder(title, ancestors) {
  const fullChain = [title, ...ancestors].join(' ').toLowerCase();
  
  if (fullChain.includes('고객사')) {
    return '고객사 관리 어드민';
  }
  if (fullChain.includes('관람객') || fullChain.includes('유저') || fullChain.includes('user')) {
    return '관람객(유저)서비스';
  }
  if (fullChain.includes('운영자') || fullChain.includes('어드민 구조') || fullChain.includes('admin')) {
    return '운영자어드민';
  }
  if (
    fullChain.includes('방향성') || 
    fullChain.includes('상위기획') || 
    fullChain.includes('afterglow') || 
    fullChain.includes('해설사')
  ) {
    return '상위기획 및 방향성';
  }
  return '기타';
}

function richTextToMd(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map(element => {
    let text = element.plain_text || '';
    if (!text) return '';
    const anno = element.annotations || {};
    if (anno.code) {
      text = `\`${text}\``;
    } else {
      if (anno.bold) text = `**${text}**`;
      if (anno.italic) text = `*${text}*`;
      if (anno.strikethrough) text = `~~${text}~~`;
      if (anno.underline) text = `<u>${text}</u>`;
    }
    if (element.href) {
      text = `[${text}](${element.href})`;
    }
    return text;
  }).join('');
}

async function getBlockChildren(blockId) {
  let results = [];
  let startCursor = undefined;
  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    if (startCursor) {
      url.searchParams.append('start_cursor', startCursor);
    }
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28'
      }
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Notion API error for block ${blockId}: ${response.status} ${errText}`);
    }
    const data = await response.json();
    results = results.concat(data.results);
    startCursor = data.next_cursor;
  } while (startCursor);
  return results;
}

// Map child page ID to its metadata
const pageMetaMap = new Map();

async function preScanPage(pageId, pageTitle, ancestors = []) {
  const blocks = await getBlockChildren(pageId);
  const childPageBlocks = blocks.filter(b => b.type === 'child_page');
  
  const safeTitle = sanitizeFilename(pageTitle);
  const depth = ancestors.length;
  
  // Resolve category folder
  const folder = resolveFolder(pageTitle, ancestors);
  if (folder !== '관람객(유저)서비스' && folder !== '상위기획 및 방향성') {
    console.log(`Skipping page (Non-user category): ${pageTitle}`);
    return;
  }
  const targetDir = path.join(outputBaseDir, folder);
  
  let filename;
  if (depth === 0 || depth === 1 || depth === 2) {
    // Keep it short for root, level 1, and level 2 pages
    filename = `${safeTitle}.md`;
  } else {
    // Prepend only the immediate parent title for deeper levels
    const parentTitle = ancestors[0] || '';
    const safeParent = sanitizeFilename(parentTitle);
    filename = `${safeParent}_${safeTitle}.md`;
  }
  
  pageMetaMap.set(pageId, {
    title: pageTitle,
    safeTitle,
    folder,
    targetDir,
    filename,
    blocks
  });
  
  // Recursively scan sub-pages
  for (const block of childPageBlocks) {
    const childId = block.id;
    const childTitle = block.child_page.title;
    await preScanPage(childId, childTitle, [pageTitle, ...ancestors]);
  }
}

async function blockToMarkdown(block, indent = '', currentDir = '') {
  let md = '';
  const type = block.type;
  let childrenHandled = false;

  switch (type) {
    case 'paragraph': {
      const text = richTextToMd(block.paragraph.rich_text);
      md = `${indent}${text}\n\n`;
      break;
    }
    case 'heading_1': {
      const text = richTextToMd(block.heading_1.rich_text);
      md = `${indent}# ${text}\n\n`;
      break;
    }
    case 'heading_2': {
      const text = richTextToMd(block.heading_2.rich_text);
      md = `${indent}## ${text}\n\n`;
      break;
    }
    case 'heading_3': {
      const text = richTextToMd(block.heading_3.rich_text);
      md = `${indent}### ${text}\n\n`;
      break;
    }
    case 'heading_4': {
      const text = richTextToMd(block.heading_4.rich_text);
      md = `${indent}#### ${text}\n\n`;
      break;
    }
    case 'heading_5': {
      const text = richTextToMd(block.heading_5.rich_text);
      md = `${indent}##### ${text}\n\n`;
      break;
    }
    case 'heading_6': {
      const text = richTextToMd(block.heading_6.rich_text);
      md = `${indent}###### ${text}\n\n`;
      break;
    }
    case 'bulleted_list_item': {
      const text = richTextToMd(block.bulleted_list_item.rich_text);
      md = `${indent}- ${text}\n`;
      break;
    }
    case 'numbered_list_item': {
      const text = richTextToMd(block.numbered_list_item.rich_text);
      md = `${indent}1. ${text}\n`;
      break;
    }
    case 'to_do': {
      const text = richTextToMd(block.to_do.rich_text);
      const check = block.to_do.checked ? '[x]' : '[ ]';
      md = `${indent}- ${check} ${text}\n`;
      break;
    }
    case 'quote': {
      const text = richTextToMd(block.quote.rich_text);
      md = `${indent}> ${text}\n\n`;
      break;
    }
    case 'code': {
      const text = richTextToMd(block.code.rich_text);
      const lang = block.code.language || '';
      md = `${indent}\`\`\`${lang}\n${text}\n${indent}\`\`\`\n\n`;
      break;
    }
    case 'callout': {
      const text = richTextToMd(block.callout.rich_text);
      const emoji = block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : '';
      md = `${indent}> [!NOTE]\n${indent}> ${emoji ? emoji + ' ' : ''}${text}\n\n`;
      break;
    }
    case 'divider': {
      md = `${indent}---\n\n`;
      break;
    }
    case 'image': {
      const image = block.image;
      if (!image) {
        md = `${indent}![image]()\n\n`;
        break;
      }
      const imgType = image.type;
      let url = '';
      if (imgType === 'external' && image.external) {
        url = image.external.url;
      } else if (imgType === 'file' && image.file) {
        url = image.file.url;
      }
      const caption = richTextToMd(image.caption);
      md = `${indent}![${caption || 'image'}](${url})\n\n`;
      break;
    }
    case 'file': {
      const fileObj = block.file;
      if (!fileObj) {
        md = `${indent}[file]()\n\n`;
        break;
      }
      const fileType = fileObj.type;
      let url = '';
      if (fileType === 'external' && fileObj.external) {
        url = fileObj.external.url;
      } else if (fileType === 'file' && fileObj.file) {
        url = fileObj.file.url;
      }
      const name = fileObj.name || 'file';
      md = `${indent}[${name}](${url})\n\n`;
      break;
    }
    case 'bookmark': {
      const bookmark = block.bookmark;
      if (!bookmark) break;
      const url = bookmark.url;
      const caption = richTextToMd(bookmark.caption);
      md = `${indent}[${caption || url}](${url})\n\n`;
      break;
    }
    case 'child_page': {
      const childMeta = pageMetaMap.get(block.id);
      if (childMeta) {
        const childPath = path.join(childMeta.targetDir, childMeta.filename);
        // Compute relative path from currentDir (which is the parent page's targetDir) to childPath
        const relFilePath = path.relative(currentDir, childPath);
        let relLink = relFilePath.split(path.sep).map(encodeURIComponent).join('/');
        if (!relLink.startsWith('..')) {
          relLink = './' + relLink;
        }
        md = `${indent}- [${childMeta.title}](${relLink})\n`;
      } else {
        md = `${indent}- [${block.child_page.title}](./${encodeURIComponent(sanitizeFilename(block.child_page.title))}.md)\n`;
      }
      break;
    }
    case 'toggle': {
      const text = richTextToMd(block.toggle.rich_text);
      md = `<details>\n<summary>${text}</summary>\n\n`;
      const children = await getBlockChildren(block.id);
      let childrenMd = '';
      for (const child of children) {
        childrenMd += await blockToMarkdown(child, indent, currentDir);
      }
      md += childrenMd;
      md += `</details>\n\n`;
      childrenHandled = true;
      break;
    }
    case 'column_list': {
      const columns = await getBlockChildren(block.id);
      let columnListMd = '';
      for (const col of columns) {
        if (col.type === 'column') {
          const colChildren = await getBlockChildren(col.id);
          for (const child of colChildren) {
            columnListMd += await blockToMarkdown(child, indent, currentDir);
          }
        }
      }
      md = columnListMd;
      childrenHandled = true;
      break;
    }
    case 'table': {
      const rows = await getBlockChildren(block.id);
      if (rows.length === 0) break;
      
      const mdRows = rows.map(row => {
        if (row.type !== 'table_row') return '';
        const cells = row.table_row.cells.map(cell => richTextToMd(cell).replace(/\|/g, '\\|'));
        return `${indent}| ${cells.join(' | ')} |`;
      }).filter(r => r);

      if (mdRows.length > 0) {
        const cellCount = rows[0].table_row.cells.length;
        const divider = `${indent}| ${Array(cellCount).fill('---').join(' | ')} |`;
        mdRows.splice(1, 0, divider);
        md = mdRows.join('\n') + '\n\n';
      }
      childrenHandled = true;
      break;
    }
    default:
      break;
  }

  if (block.has_children && !childrenHandled && type !== 'child_page' && type !== 'child_database') {
    const children = await getBlockChildren(block.id);
    let childIndent = indent;
    if (type === 'bulleted_list_item' || type === 'numbered_list_item' || type === 'to_do') {
      childIndent += '    ';
    } else if (type === 'quote' || type === 'callout') {
      childIndent += '> ';
    }
    
    let childrenMd = '';
    for (const child of children) {
      childrenMd += await blockToMarkdown(child, childIndent, currentDir);
    }
    md += childrenMd;
  }

  return md;
}

async function renderAndWritePage(pageId) {
  const meta = pageMetaMap.get(pageId);
  if (!meta) return;

  console.log(`Rendering page: ${meta.title} into folder: ${meta.folder}`);
  
  // Ensure target folder exists
  fs.mkdirSync(meta.targetDir, { recursive: true });

  let markdownContent = `# ${meta.title}\n\n`;
  for (const block of meta.blocks) {
    markdownContent += await blockToMarkdown(block, '', meta.targetDir);
  }

  const targetPath = path.join(meta.targetDir, meta.filename);
  fs.writeFileSync(targetPath, markdownContent, 'utf-8');
  console.log(`Saved to: ${targetPath}`);

  // Process sub-pages
  const childPageBlocks = meta.blocks.filter(b => b.type === 'child_page');
  for (const block of childPageBlocks) {
    await renderAndWritePage(block.id);
  }
}

async function main() {
  console.log('Searching for Afterglow in Notion...');
  const searchResponse = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: 'Afterglow'
    })
  });

  if (!searchResponse.ok) {
    const errText = await searchResponse.text();
    throw new Error(`Search API error: ${searchResponse.status} ${errText}`);
  }

  const searchData = await searchResponse.json();
  const rootPages = searchData.results.filter(r => r.object === 'page');
  console.log(`Found ${rootPages.length} root pages.`);

  // 1. Clean up existing docs/ directory before writing new categorized files
  if (fs.existsSync(outputBaseDir)) {
    console.log('Cleaning up existing docs directory...');
    fs.rmSync(outputBaseDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputBaseDir, { recursive: true });

  // 2. Pre-scan all pages to determine paths, filenames, and links
  for (const page of rootPages) {
    const title = page.properties.title?.title?.[0]?.plain_text || 'Untitled';
    console.log(`Pre-scanning root page: ${title} (${page.id})`);
    await preScanPage(page.id, title, []);
  }

  // 3. Render and write pages recursively
  for (const page of rootPages) {
    await renderAndWritePage(page.id);
  }

  console.log('Successfully converted all Notion pages to Markdown (Categorized Layout directly inside docs/).');
}

main().catch(console.error);
