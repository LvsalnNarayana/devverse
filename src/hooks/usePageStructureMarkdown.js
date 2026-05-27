import { useEffect, useState } from 'react';

const pageStructureModules = import.meta.glob('../../pageStructures/**/*.md', {
  query: '?raw',
  import: 'default',
});

const normalizePageStructurePath = (path = '') =>
  path.replace(/^\/+/, '../../').replace(/\\/g, '/');

/**
 * Loads bundled markdown page-structure outlines under pageStructures/.
 *
 * @param {string | undefined} pageStructurePath
 */
export function usePageStructureMarkdown(pageStructurePath) {
  const [structureText, setStructureText] = useState('');
  const [structureError, setStructureError] = useState('');

  useEffect(() => {
    setStructureText('');
    setStructureError('');

    if (!pageStructurePath) return;

    const normalized = normalizePageStructurePath(pageStructurePath);
    const loader = pageStructureModules[normalized];

    if (!loader) {
      setStructureError(`Could not resolve page structure at "${pageStructurePath}".`);
      return;
    }

    loader()
      .then((content) => setStructureText(content))
      .catch((err) => {
        setStructureError(err?.message || 'Failed to load page structure.');
      });
  }, [pageStructurePath]);

  return { structureText, structureError };
}
