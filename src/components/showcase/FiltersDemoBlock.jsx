// React
import React from 'react';

// External
import { Stack, Typography } from '@mui/material';

// Relative
import { ActiveFilters, FilterPopOver, FiltersSearch } from '../shared/Filters';
import { useFilters } from '../../hooks/useFilters';

const FILTER_DEMO_ITEMS = [
  {
    id: '1',
    title: 'Aggregation Pipeline Mastery',
    description: 'MongoDB aggregation patterns',
    category: 'MongoDB',
    tags: ['aggregation', 'analytics'],
  },
  {
    id: '2',
    title: 'Kafka Basics',
    description: 'Event streaming fundamentals',
    category: 'Messaging',
    tags: ['kafka', 'events'],
  },
  {
    id: '3',
    title: 'Binary Search',
    description: 'Divide and conquer search',
    category: 'Algorithms',
    tags: ['dsa', 'search'],
  },
];

const FILTER_SELECTS = [
  {
    key: 'category',
    label: 'Category',
    options: ['All', 'MongoDB', 'Messaging', 'Algorithms'],
  },
];

const FILTER_SORTS = [{ value: 'title', label: 'Title A–Z', key: 'title', direction: 'asc' }];

export default function FiltersDemoBlock() {
  const f = useFilters(FILTER_DEMO_ITEMS, {
    searchKeys: ['title', 'description', 'tags', 'category'],
    selects: FILTER_SELECTS,
    sorts: FILTER_SORTS,
    defaultSort: 'title',
  });

  return (
    <>
      <FiltersSearch
        searchPlaceholder="Search demo items…"
        searchQuery={f.searchQuery}
        onSearchChange={f.setSearchQuery}
        resultCount={{ shown: f.filteredItems.length, total: FILTER_DEMO_ITEMS.length }}
        trailing={
          <FilterPopOver
            selects={FILTER_SELECTS}
            sorts={FILTER_SORTS}
            allTags={f.allTags}
            selectValues={f.selectValues}
            onSelectChange={f.setSelectValue}
            selectedTags={f.selectedTags}
            onTagToggle={f.toggleTag}
            sortBy={f.sortBy}
            onSortChange={f.setSortBy}
            activeCount={f.activeCount}
          />
        }
      />
      <ActiveFilters
        selects={FILTER_SELECTS}
        selectValues={f.selectValues}
        onSelectChange={f.setSelectValue}
        selectedTags={f.selectedTags}
        onTagToggle={f.toggleTag}
        searchQuery={f.searchQuery}
        onSearchChange={f.setSearchQuery}
        hasActiveFilters={f.hasActiveFilters}
        onClearAll={f.clearAll}
      />
      <Stack component="ul" sx={{ gap: 1, pl: 2.5, m: 0, mt: 2 }}>
        {f.filteredItems.map((item) => (
          <Typography key={item.id} component="li" variant="body2">
            <strong>{item.title}</strong> — {item.description} ({item.category})
          </Typography>
        ))}
      </Stack>
    </>
  );
}
