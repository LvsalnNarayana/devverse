// React
import React from 'react';

// Relative
import GroupedSectionToc from '../shared/GroupedSectionToc';

/**
 * @param {object} props
 * @param {{ id: string, title: string, group?: string }[]} props.items
 * @param {string[]} [props.groups]
 */
export default function ReferencePageToc({ items = [], groups = [] }) {
  if (!items.length) {
    return null;
  }

  return <GroupedSectionToc ariaLabel="Reference sections" items={items} groups={groups} />;
}
