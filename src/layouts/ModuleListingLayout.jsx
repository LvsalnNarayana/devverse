import { useEffect, useMemo, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Grid, IconButton, Pagination, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import DisplayCard from '../components/shared/DisplayCard';
import { ActiveFilters, FilterPopOver, FiltersSearch } from '../components/shared/Filters';
import { LISTING_PAGE_SIZE } from '../data/constants';
import { ALL_VALUE, useFilters } from '../hooks/useFilters';

/**
 * Shared listing-page renderer used by module pages (DSA, Case Studies, future modules).
 *
 * Data flow:
 * 1) Page imports raw `items` + tag/options arrays from `src/data/*`.
 * 2) Page loads module config from `public/configs/modulePageLayouts.json` via useModulePageLayout.
 * 3) Page passes both into this layout.
 * 4) This layout resolves config-driven filters/sorts and wires `useFilters`.
 * 5) Filtered/sorted/paginated items are rendered as `DisplayCard`s.
 */
function interpolatePath(template, item) {
  if (typeof template !== 'string' || !template) return undefined;
  return template.replace(/:([a-zA-Z0-9_]+)/g, (_match, key) => String(item?.[key] ?? ''));
}

function resolveOptions(selectConfig, optionsBySource = {}) {
  if (Array.isArray(selectConfig.options)) return selectConfig.options;
  if (!selectConfig.optionsSource) return [];
  return optionsBySource[selectConfig.optionsSource] ?? [];
}

export default function ModuleListingLayout({ items, allTags = [], optionsBySource = {}, config }) {
  const navigate = useNavigate();
  const listRef = useRef(null);

  // Resolve select option lists either directly from config.options or by lookup via config.optionsSource.
  const selects = useMemo(
    () =>
      (config?.filters?.selects ?? []).map((selectConfig) => ({
        key: selectConfig.key,
        label: selectConfig.label,
        options: resolveOptions(selectConfig, optionsBySource),
        visibleWhen: selectConfig.visibleWhen,
        resetOnHide: Boolean(selectConfig.resetOnHide),
      })),
    [config?.filters?.selects, optionsBySource],
  );

  const defaultSelectValues = config?.filters?.defaultSelectValues ?? {};

  // `useFilters` is the state engine: search query, select values, tag chips, and sort value.
  const f = useFilters(items, {
    searchKeys: config?.filters?.searchKeys ?? [],
    selects,
    defaultSelectValues,
    sorts: config?.filters?.sorts ?? [],
    defaultSort: config?.filters?.defaultSort,
  });

  // Support conditional filters (example: show `structureKind` only for specific categories).
  const visibleSelects = useMemo(
    () =>
      selects.filter((selectConfig) => {
        if (!selectConfig.visibleWhen) return true;
        const controllerValue = f.selectValues[selectConfig.visibleWhen.key] ?? ALL_VALUE;
        return (selectConfig.visibleWhen.in ?? []).includes(controllerValue);
      }),
    [selects, f.selectValues],
  );

  // If a conditional select gets hidden, optionally reset it back to "All" to avoid stale filtering.
  useEffect(() => {
    selects.forEach((selectConfig) => {
      const isVisible = visibleSelects.some(
        (visibleSelect) => visibleSelect.key === selectConfig.key,
      );
      if (isVisible || !selectConfig.resetOnHide) return;
      if (f.selectValues[selectConfig.key] !== ALL_VALUE) {
        f.setSelectValue(selectConfig.key, ALL_VALUE);
      }
    });
  }, [selects, visibleSelects, f.selectValues, f.setSelectValue]);

  const handleClearAll = () => {
    if (Object.keys(defaultSelectValues).length) {
      f.setSelectValues({ ...defaultSelectValues });
      f.setSearchQuery('');
      f.setSelectedTags([]);
      return;
    }
    f.clearAll();
  };

  const [page, setPage] = useState(1);
  const pageSize = config?.pagination?.pageSize ?? LISTING_PAGE_SIZE;

  // Reset to page 1 whenever any filter/sort/search/tag changes.
  const filterKey = useMemo(
    () =>
      JSON.stringify({
        q: f.searchQuery,
        sv: f.selectValues,
        st: [...f.selectedTags].sort(),
        sort: f.sortBy,
      }),
    [f.searchQuery, f.selectValues, f.selectedTags, f.sortBy],
  );

  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalFiltered = f.filteredItems.length;
  const pageCount = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * pageSize;
  const pageItems = f.filteredItems.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (_event, value) => {
    setPage(value);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Stack sx={{ gap: 3 }}>
      <Stack sx={{ gap: 2 }}>
        <Stack sx={{ gap: 2, alignItems: 'center', flexDirection: 'row' }}>
          <IconButton
            size="medium"
            onClick={() => navigate(config?.header?.backTo ?? '/')}
            sx={{ color: 'primary.main', border: 'none' }}
          >
            <ArrowBackIcon sx={{ width: 26, height: 26 }} />
          </IconButton>
          <Typography variant="h4">{config?.header?.title}</Typography>
        </Stack>
        <Typography color="text.secondary">{config?.header?.description}</Typography>
      </Stack>

      <FiltersSearch
        searchPlaceholder={config?.filters?.searchPlaceholder ?? 'Search...'}
        searchQuery={f.searchQuery}
        onSearchChange={f.setSearchQuery}
        resultCount={{ shown: totalFiltered, total: items.length }}
        trailing={
          <FilterPopOver
            selects={visibleSelects}
            sorts={config?.filters?.sorts ?? []}
            allTags={allTags.length ? allTags : f.allTags}
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
        selects={visibleSelects}
        selectValues={f.selectValues}
        onSelectChange={f.setSelectValue}
        selectedTags={f.selectedTags}
        onTagToggle={f.toggleTag}
        searchQuery={f.searchQuery}
        onSearchChange={f.setSearchQuery}
        hasActiveFilters={f.hasActiveFilters}
        onClearAll={handleClearAll}
      />

      {totalFiltered === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {config?.emptyMessage ?? 'No items match your filters.'}
          </Typography>
        </Box>
      ) : (
        <Box ref={listRef} sx={{ scrollMarginTop: 96 }}>
          <Grid container spacing={3}>
            {pageItems.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }} sx={{ display: 'flex' }}>
                <DisplayCard
                  data={{
                    ...item,
                    // Optional declarative route building, e.g. "/case-studies/:id".
                    ...(config?.card?.linkTemplate
                      ? { link: interpolatePath(config.card.linkTemplate, item) }
                      : null),
                  }}
                  type={config?.card?.type ?? 'item'}
                  descriptionLines={config?.card?.descriptionLines}
                  cardSx={{
                    width: '100%',
                    ...(config?.card?.minHeight ? { minHeight: config.card.minHeight } : null),
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <Stack
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {startIndex + 1}-{Math.min(startIndex + pageSize, totalFiltered)} of{' '}
                {totalFiltered}
              </Typography>
              <Pagination
                count={pageCount}
                page={safePage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  );
}
