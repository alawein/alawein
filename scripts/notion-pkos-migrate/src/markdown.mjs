import { richText } from './utils.mjs';

function paragraphBlock(text) {
  return { object: 'block', type: 'paragraph', paragraph: { rich_text: richText(text) } };
}

function headingBlock(level, text) {
  const type = `heading_${level}`;
  return { object: 'block', type, [type]: { rich_text: richText(text) } };
}

function listBlock(type, text) {
  return { object: 'block', type, [type]: { rich_text: richText(text) } };
}

function quoteBlock(text) {
  return { object: 'block', type: 'quote', quote: { rich_text: richText(text) } };
}

function codeBlock(language, text) {
  return {
    object: 'block',
    type: 'code',
    code: {
      rich_text: richText(text),
      language: language || 'plain text',
      caption: [],
    },
  };
}

export function markdownToBlocks(markdown) {
  if (!markdown?.trim()) return [];

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let paragraphBuffer = [];
  let listBuffer = null;
  let codeFence = null;

  function flushParagraph() {
    if (paragraphBuffer.length === 0) return;
    blocks.push(paragraphBlock(paragraphBuffer.join(' ').trim()));
    paragraphBuffer = [];
  }

  function flushList() {
    if (!listBuffer) return;
    for (const item of listBuffer.items) {
      blocks.push(listBlock(listBuffer.type, item));
    }
    listBuffer = null;
  }

  function flushCode() {
    if (!codeFence) return;
    blocks.push(codeBlock(codeFence.language, codeFence.lines.join('\n')));
    codeFence = null;
  }

  for (const line of lines) {
    if (codeFence) {
      if (/^```/.test(line.trim())) {
        flushCode();
      } else {
        codeFence.lines.push(line);
      }
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const codeMatch = trimmed.match(/^```(.*)$/);
    if (codeMatch) {
      flushParagraph();
      flushList();
      codeFence = { language: codeMatch[1].trim(), lines: [] };
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push(headingBlock(headingMatch[1].length, headingMatch[2]));
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      listBuffer ??= { type: 'bulleted_list_item', items: [] };
      if (listBuffer.type !== 'bulleted_list_item') {
        flushList();
        listBuffer = { type: 'bulleted_list_item', items: [] };
      }
      listBuffer.items.push(bulletMatch[1]);
      continue;
    }

    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      flushParagraph();
      listBuffer ??= { type: 'numbered_list_item', items: [] };
      if (listBuffer.type !== 'numbered_list_item') {
        flushList();
        listBuffer = { type: 'numbered_list_item', items: [] };
      }
      listBuffer.items.push(numberedMatch[1]);
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      blocks.push(quoteBlock(quoteMatch[1]));
      continue;
    }

    flushList();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushCode();

  return blocks;
}
