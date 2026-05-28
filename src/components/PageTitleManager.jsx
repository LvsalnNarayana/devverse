import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTopicById } from '../data/registries/dsaRegistry';
import { getBlogById } from '../data/registries/caseStudyRegistry';
import { getReferenceById } from '../data/registries/referenceRegistry';
import { getProjectById } from '../data/registries/projectRegistry';
import { getPrebuiltModuleById } from '../data/registries/prebuiltModuleRegistry';

const APP_NAME = 'Deverse';

function withAppName(pageTitle) {
  return pageTitle ? `${APP_NAME} | ${pageTitle}` : APP_NAME;
}

function resolveTitle(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  const [root, id] = parts;

  if (clean === '/') return withAppName('Home');
  if (clean === '/components') return withAppName('Components Showcase');
  if (clean === '/dsa') return withAppName('DSA Visualizer');
  if (clean === '/case-studies') return withAppName('Case Studies');
  if (clean === '/references') return withAppName('Reference Library');
  if (clean === '/projects') return withAppName('Projects');
  if (clean === '/modules') return withAppName('Prebuilt Modules');
  if (clean === '/tools') return withAppName('Developer Tools');

  if (root === 'dsa' && id) {
    const topic = getTopicById(id);
    return withAppName(topic?.title ?? 'DSA Topic');
  }

  if (root === 'case-studies' && id) {
    const caseStudy = getBlogById(id);
    return withAppName(caseStudy?.title ?? 'Case Study');
  }

  if (root === 'references' && id) {
    const reference = getReferenceById(id);
    return withAppName(reference?.title ?? 'Reference');
  }

  if (root === 'projects' && id) {
    const project = getProjectById(id);
    return withAppName(project?.title ?? 'Project');
  }

  if (root === 'modules' && id) {
    const moduleItem = getPrebuiltModuleById(id);
    return withAppName(moduleItem?.title ?? 'Prebuilt Module');
  }

  return withAppName('Page Not Found');
}

/**
 * Updates document.title based on current route (including dynamic detail pages).
 * Mount once near the router. Renders nothing.
 */
export default function PageTitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = resolveTitle(pathname);
  }, [pathname]);

  return null;
}
