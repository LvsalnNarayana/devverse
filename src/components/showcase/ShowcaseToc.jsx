// React
import React from 'react';

// Relative
import {
  COMPONENTS_SHOWCASE_SECTIONS,
  SHOWCASE_GROUPS,
} from '../../data/componentsShowcaseCatalog';
import GroupedSectionToc from '../shared/GroupedSectionToc';

/**
 * @param {object} props
 * @param {string} [props.activeId]
 */
export default function ShowcaseToc({ activeId }) {
  return (
    <GroupedSectionToc
      ariaLabel="Component sections"
      heading="On this page"
      items={COMPONENTS_SHOWCASE_SECTIONS}
      groups={SHOWCASE_GROUPS}
      activeId={activeId}
    />
  );
}
