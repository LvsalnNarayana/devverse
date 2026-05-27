/**
 * Project registry — catalog metadata and path resolution for detail pages.
 */

import {
  getProjectById,
  projectAllTags,
  projectCategories,
  projects,
} from '../projects';

export { getProjectById, projectAllTags, projectCategories, projects };

export function resolveProjectContentPath(id) {
  return getProjectById(id)?.content;
}

export function resolveProjectPageStructurePath(id) {
  return getProjectById(id)?.pageStructure;
}
