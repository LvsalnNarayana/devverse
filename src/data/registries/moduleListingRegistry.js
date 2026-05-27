/**
 * Module listing registry — resolves declarative listing layout config from public JSON.
 *
 * Config: public/configs/modulePageLayouts.json
 * Consumers: DSA, Case Studies, References listing pages via useModulePageLayout
 */

import { loadPublicJson } from './loadPublicJson';

const MODULE_PAGE_LAYOUTS_PATH = '/configs/modulePageLayouts.json';

/** @type {Record<string, unknown> | null} */
let modulePageLayoutsCache = null;

/**
 * @returns {Promise<Record<string, unknown>>}
 */
export async function loadModulePageLayouts() {
  if (!modulePageLayoutsCache) {
    modulePageLayoutsCache = await loadPublicJson(MODULE_PAGE_LAYOUTS_PATH);
  }
  return modulePageLayoutsCache;
}

/**
 * @param {'dsa' | 'caseStudies' | 'references' | string} moduleKey
 * @returns {Promise<unknown | undefined>}
 */
export async function getModulePageLayout(moduleKey) {
  const layouts = await loadModulePageLayouts();
  return layouts[moduleKey];
}
