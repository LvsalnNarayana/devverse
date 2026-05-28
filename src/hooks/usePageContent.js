import { useEffect, useState } from 'react';

import { extractPageToc } from '../utils/extractPageToc';
import { parsePageContent } from '../utils/parsePageContent';

const pageStructureJsonModules = import.meta.glob('../../pageStructures/**/*.json', {
  eager: false,
  import: 'default',
});

/**
 * @param {string} path
 * @returns {string | null} URL path for fetch (e.g. /configs/caseStudies/foo.json)
 */
function resolvePublicFetchUrl(path = '') {
  const cleaned = path.replace(/^\/+/, '');
  if (cleaned.startsWith('public/')) {
    return `/${cleaned.slice('public/'.length)}`;
  }
  if (cleaned.startsWith('configs/')) {
    return `/${cleaned}`;
  }
  return null;
}

/**
 * Bundled pageStructures JSON only (not public/configs).
 *
 * @param {string} path
 * @returns {string | null}
 */
function resolveBundledJsonPath(path = '') {
  const cleaned = path.replace(/^\/+/, '');
  if (cleaned.startsWith('configs/') || cleaned.startsWith('public/')) {
    return null;
  }
  if (cleaned.startsWith('pageStructures/')) {
    return `../../${cleaned}`;
  }
  return `../../pageStructures/${cleaned}`;
}

/**
 * @param {string} contentPath
 * @returns {Promise<unknown>}
 */
async function loadPageContentJson(contentPath) {
  const fetchUrl = resolvePublicFetchUrl(contentPath);
  if (fetchUrl) {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch content (${response.status}) from "${fetchUrl}".`);
    }
    const text = await response.text();
    if (!text.trim()) {
      return { meta: {}, blocks: [] };
    }
    return JSON.parse(text);
  }

  const bundledPath = resolveBundledJsonPath(contentPath);
  const loader = bundledPath ? pageStructureJsonModules[bundledPath] : null;

  if (!loader) {
    throw new Error(`Could not resolve content file at "${contentPath}".`);
  }

  return loader();
}

/**
 * Loads declarative page JSON (blocks + metadata) from a content path.
 *
 * Public content: `/configs/...` or `/public/configs/...` (served from `public/` at runtime).
 * Bundled: pageStructures JSON files via Vite glob.
 *
 * @param {string | undefined} contentPath
 */
export function usePageContent(contentPath) {
  const [state, setState] = useState({
    loading: Boolean(contentPath),
    error: '',
    meta: {},
    blocks: [],
    tocItems: [],
    tocGroups: [],
  });

  useEffect(() => {
    if (!contentPath) {
      setState({ loading: false, error: '', meta: {}, blocks: [], tocItems: [], tocGroups: [] });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: '' }));

    loadPageContentJson(contentPath)
      .then((raw) => {
        const parsed = parsePageContent(raw);
        const toc = extractPageToc(raw);
        setState({
          loading: false,
          error: '',
          meta: parsed.meta,
          blocks: parsed.blocks,
          tocItems: toc.items,
          tocGroups: toc.groups,
        });
      })
      .catch((error) => {
        setState({
          loading: false,
          error: error?.message || 'Failed to load page content.',
          meta: {},
          blocks: [],
          tocItems: [],
          tocGroups: [],
        });
      });
  }, [contentPath]);

  return state;
}
