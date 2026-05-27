/**
 * Prebuilt module registry — catalog metadata and path resolution for detail pages.
 */

import {
  getPrebuiltModuleById,
  prebuiltModuleAllTags,
  prebuiltModuleCategories,
  prebuiltModules,
} from '../prebuiltModules';

export {
  getPrebuiltModuleById,
  prebuiltModuleAllTags,
  prebuiltModuleCategories,
  prebuiltModules,
};

export function resolvePrebuiltModuleContentPath(id) {
  return getPrebuiltModuleById(id)?.content;
}

export function resolvePrebuiltModulePageStructurePath(id) {
  return getPrebuiltModuleById(id)?.pageStructure;
}
