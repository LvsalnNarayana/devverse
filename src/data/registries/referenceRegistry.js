/**
 * Reference registry — catalog metadata and path resolution for detail pages.
 *
 * Catalog: src/data/references.js
 * Content: public/configs/references/*.json
 * Page structure: pageStructures/references/*.md
 */
import {
  getReferenceById,
  referenceAllTags,
  referenceLevels,
  references,
  referenceTypes,
} from '../references';

export {
  getReferenceById,
  referenceAllTags,
  referenceLevels,
  references,
  referenceTypes,
};

/**
 * @param {string} id
 * @returns {string | undefined}
 */
export function resolveReferenceContentPath(id) {
  return getReferenceById(id)?.content;
}

/**
 * @param {string} id
 * @returns {string | undefined}
 */
export function resolveReferencePageStructurePath(id) {
  return getReferenceById(id)?.pageStructure;
}
