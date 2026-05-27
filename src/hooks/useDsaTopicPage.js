import { useEffect, useState } from 'react';
import {
  getDsaTopicPage,
  getTopicById,
  loadDsaTopicContent,
} from '../data/registries/dsaRegistry';
import {
  loadVisualization,
  hasVisualization,
} from '../components/visualizations/visualizationRegistry';

/**
 * Loads DSA topic page bundle: catalog metadata + public JSON content + visualization component.
 *
 * @param {string} topicId — route param from /dsa/:id
 */
export function useDsaTopicPage(topicId) {
  const [content, setContent] = useState(null);
  const [Visualization, setVisualization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageRef, setPageRef] = useState(null);

  const catalogTopic = getTopicById(topicId);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');
      setContent(null);
      setVisualization(null);
      setPageRef(null);

      try {
        const page = await getDsaTopicPage(topicId);
        if (cancelled) return;

        setPageRef(page ?? null);

        if (!page) {
          setLoading(false);
          return;
        }

        const [contentData, VizComponent] = await Promise.all([
          loadDsaTopicContent(page.contentPath),
          hasVisualization(page.visualizationId)
            ? loadVisualization(page.visualizationId)
            : Promise.resolve(null),
        ]);

        if (cancelled) return;
        setContent(contentData);
        setVisualization(() => VizComponent);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load topic page.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  return {
    catalogTopic,
    pageRef,
    content,
    Visualization,
    loading,
    error,
    isRegistered: Boolean(pageRef),
  };
}
