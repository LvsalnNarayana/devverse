/**
 * @param {unknown} raw
 * @returns {{ meta: Record<string, unknown>, blocks: Record<string, unknown>[] }}
 */
export function parsePageContent(raw) {
  if (!raw) {
    return { meta: {}, blocks: [] };
  }

  if (typeof raw === 'object' && raw !== null) {
    const data = /** @type {Record<string, unknown>} */ (raw);
    const { blocks: _blocks, sections: _sections, ...meta } = data;

    if (Array.isArray(data.sections) && data.sections.length > 0) {
      const blocks = data.sections.map((section) => {
        const s = /** @type {Record<string, unknown>} */ (section);
        return {
          type: 'showcaseSection',
          id: s.id,
          title: s.title,
          description: s.description,
          blocks: s.blocks ?? [],
        };
      });
      return { meta, blocks };
    }

    const blocks = Array.isArray(data.blocks) ? data.blocks : [];
    return { meta, blocks };
  }

  if (typeof raw !== 'string') {
    return { meta: {}, blocks: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    return parsePageContent(parsed);
  } catch {
    return {
      meta: {},
      blocks: [
        {
          type: 'typography',
          variant: 'body1',
          html: raw,
        },
      ],
    };
  }
}
