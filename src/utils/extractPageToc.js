import { slugify } from './slugify';

/**
 * @typedef {{ id: string, title: string, group?: string }} PageTocItem
 */

/**
 * @param {Record<string, unknown>} block
 * @returns {string | null}
 */
function blockAnchorId(block) {
  const id = block.id;
  if (typeof id === 'string' && id.trim()) {
    return id.trim();
  }
  const title = block.title;
  if (typeof title === 'string' && title.trim()) {
    return slugify(title);
  }
  return null;
}

/**
 * @param {unknown[]} blocks
 * @param {string} groupTitle
 * @param {PageTocItem[]} items
 * @param {string[]} groups
 */
function collectSubsectionsFromBlocks(blocks, groupTitle, items, groups) {
  if (!Array.isArray(blocks)) return;

  for (const entry of blocks) {
    if (!entry || typeof entry !== 'object') continue;
    const block = /** @type {Record<string, unknown>} */ (entry);
    if (block.type !== 'subsection') continue;

    const anchorId = blockAnchorId(block);
    const title = typeof block.title === 'string' ? block.title : '';
    if (!anchorId || !title) continue;

    if (!groups.includes(groupTitle)) {
      groups.push(groupTitle);
    }
    items.push({ id: anchorId, title, group: groupTitle });
  }
}

/**
 * Build table-of-contents entries from declarative page JSON (contentPath file).
 * Supports top-level `sections` and `blocks` with `subsection` / `sectionHeader`.
 *
 * @param {unknown} raw — parsed JSON from the content file
 * @returns {{ items: PageTocItem[], groups: string[] }}
 */
export function extractPageToc(raw) {
  /** @type {PageTocItem[]} */
  const items = [];
  /** @type {string[]} */
  const groups = [];

  if (!raw || typeof raw !== 'object') {
    return { items, groups };
  }

  const data = /** @type {Record<string, unknown>} */ (raw);

  if (Array.isArray(data.sections)) {
    for (const sectionEntry of data.sections) {
      if (!sectionEntry || typeof sectionEntry !== 'object') continue;
      const section = /** @type {Record<string, unknown>} */ (sectionEntry);
      const sectionTitle =
        typeof section.title === 'string' ? section.title : 'Section';
      const sectionBlocks = Array.isArray(section.blocks) ? section.blocks : [];
      const subsections = sectionBlocks.filter(
        (b) => b && typeof b === 'object' && /** @type {Record<string, unknown>} */ (b).type === 'subsection',
      );

      if (subsections.length > 0) {
        collectSubsectionsFromBlocks(sectionBlocks, sectionTitle, items, groups);
      } else {
        const anchorId = blockAnchorId(section);
        if (anchorId && sectionTitle) {
          items.push({ id: anchorId, title: sectionTitle });
        }
      }
    }
    return { items, groups };
  }

  if (Array.isArray(data.blocks)) {
    for (const blockEntry of data.blocks) {
      if (!blockEntry || typeof blockEntry !== 'object') continue;
      const block = /** @type {Record<string, unknown>} */ (blockEntry);
      const type = block.type;

      if (type === 'subsection' || type === 'sectionHeader') {
        const anchorId = blockAnchorId(block);
        const title = typeof block.title === 'string' ? block.title : '';
        if (anchorId && title) {
          items.push({ id: anchorId, title });
        }

        if (type === 'subsection' && Array.isArray(block.blocks)) {
          collectSubsectionsFromBlocks(
            block.blocks,
            title || 'Subsection',
            items,
            groups,
          );
        }
      }
    }
  }

  return { items, groups };
}
