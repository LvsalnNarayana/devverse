import { useEffect, useState } from 'react';
import { getModulePageLayout } from '../data/registries/moduleListingRegistry';

/**
 * Loads one module's listing layout config from public/configs/modulePageLayouts.json.
 *
 * @param {'dsa' | 'caseStudies' | 'references' | string} moduleKey
 */
export function useModulePageLayout(moduleKey) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');
      setConfig(null);

      try {
        const layout = await getModulePageLayout(moduleKey);
        if (cancelled) return;

        if (!layout) {
          setError(`No listing config found for module "${moduleKey}".`);
          return;
        }

        setConfig(layout);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load module listing config.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [moduleKey]);

  return { config, loading, error };
}
