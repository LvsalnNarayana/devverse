/**
 * Case study registry — catalog metadata and path resolution for detail pages.
 *
 * Catalog: src/data/caseStudies.js
 * Content: public/configs/caseStudies/*.json
 * Page structure: pageStructures/caseStudies/*.md
 */

import {
  allTags,
  caseStudies,
  categories,
  getBlogById,
} from '../caseStudies';

export { caseStudies, allTags, categories, getBlogById };

/**
 * @param {string} id
 * @returns {string | undefined}
 */
export function resolveCaseStudyContentPath(id) {
  return getBlogById(id)?.content;
}

/**
 * @param {string} id
 * @returns {string | undefined}
 */
export function resolveCaseStudyPageStructurePath(id) {
  return getBlogById(id)?.pageStructure;
}
