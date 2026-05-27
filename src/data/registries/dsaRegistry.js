/**
 * DSA registry — resolves listing catalog, topic page paths, and public JSON content.
 *
 * Catalog metadata: src/data/dsa.js (listing cards).
 * Page content + topic-page map: public/configs/dsa/.
 * Visualizations: src/components/visualizations/visualizationRegistry.js
 */

import {
  dsaAllTags,
  dsaCategories,
  dsaDifficulties,
  dsaFrequencies,
  dsaStructureKinds,
  dsaTopics,
  getTopicById,
} from '../dsa';
import { loadPublicJson } from './loadPublicJson';

const TOPIC_PAGES_PATH = '/configs/dsa/topic-pages.json';
const TOPIC_VISUALIZATIONS_PATH = '/configs/dsa/topic-visualizations.json';

/** @type {Record<string, { contentPath: string, visualizationId: string }> | null} */
let topicPagesRegistry = null;

/** @type {Record<string, unknown> | null} */
let topicVisualizationsCatalog = null;

/**
 * @returns {Promise<Record<string, { contentPath: string, visualizationId: string }>>}
 */
export async function loadTopicPagesRegistry() {
  if (!topicPagesRegistry) {
    const raw = await loadPublicJson(TOPIC_PAGES_PATH);
    const { _meta, ...entries } = raw;
    topicPagesRegistry = entries;
  }
  return topicPagesRegistry;
}

/**
 * @param {string} topicId
 * @returns {Promise<{ contentPath: string, visualizationId: string } | undefined>}
 */
export async function getDsaTopicPage(topicId) {
  const registry = await loadTopicPagesRegistry();
  return registry[topicId];
}

export function hasDsaTopicPageEntry(topicId) {
  return Boolean(topicPagesRegistry?.[topicId]);
}

/**
 * @returns {Promise<Record<string, unknown>>}
 */
export async function loadTopicVisualizationsCatalog() {
  if (!topicVisualizationsCatalog) {
    const raw = await loadPublicJson(TOPIC_VISUALIZATIONS_PATH);
    const { _meta, ...entries } = raw;
    topicVisualizationsCatalog = entries;
  }
  return topicVisualizationsCatalog;
}

/**
 * @param {string} contentPath — e.g. /configs/dsa/pages/array.json
 * @returns {Promise<object>}
 */
export async function loadDsaTopicContent(contentPath) {
  return loadPublicJson(contentPath);
}

export {
  dsaTopics,
  dsaAllTags,
  dsaCategories,
  dsaDifficulties,
  dsaFrequencies,
  dsaStructureKinds,
  getTopicById,
};
