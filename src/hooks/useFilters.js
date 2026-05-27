// React
import { useMemo, useState } from 'react';

const ALL = 'All';

/**
 * Generic filter / search / sort hook for list data.
 *
 * @template T
 * @param {T[]} items
 * @param {object} config
 * @param {string[]} [config.searchKeys=[]]   Item fields to match against the search query.
 *                                            If a field is an array its members are joined.
 * @param {Array<{ key: string }>} [config.selects=[]]  Single-select filter definitions.
 *                                                     Each item's `item[key]` is matched against
 *                                                     the chosen value (or ignored when "All").
 * @param {string} [config.tagsKey='tags']    Field on each item that holds an array of tags.
 * @param {Array<{ value: string, key?: string, direction?: 'asc' | 'desc' }>} [config.sorts=[]]
 *                                            Sort options. `key` defaults to `value`.
 * @param {string} [config.defaultSort]       Default sort `value`.
 * @param {Record<string, string>} [config.defaultSelectValues]  Initial select values (defaults to "All" per select).
 */
export function useFilters(items, config = {}) {
  const {
    searchKeys = [],
    selects = [],
    tagsKey = 'tags',
    sorts = [],
    defaultSort,
    defaultSelectValues,
  } = config;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectValues, setSelectValues] = useState(() => ({
    ...Object.fromEntries(selects.map((s) => [s.key, ALL])),
    ...defaultSelectValues,
  }));
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState(defaultSort ?? sorts[0]?.value ?? '');

  const allTags = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      const tags = item?.[tagsKey];
      if (Array.isArray(tags)) tags.forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items, tagsKey]);

  const setSelectValue = (key, value) => setSelectValues((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const clearAll = () => {
    setSearchQuery('');
    setSelectValues({
      ...Object.fromEntries(selects.map((s) => [s.key, ALL])),
      ...defaultSelectValues,
    });
    setSelectedTags([]);
  };

  const activeSelectCount = Object.values(selectValues).filter((v) => v !== ALL).length;
  const activeCount =
    (searchQuery.trim().length > 0 ? 1 : 0) + selectedTags.length + activeSelectCount;
  const hasActiveFilters = activeCount > 0;

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let result = items.filter((item) => {
      if (q && searchKeys.length) {
        const haystack = searchKeys
          .map((k) => {
            const v = item?.[k];
            return Array.isArray(v) ? v.join(' ') : (v ?? '');
          })
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      for (const s of selects) {
        const chosen = selectValues[s.key];
        if (chosen && chosen !== ALL && item?.[s.key] !== chosen) return false;
      }

      if (selectedTags.length) {
        const tags = item?.[tagsKey];
        if (!Array.isArray(tags)) return false;
        if (!selectedTags.every((t) => tags.includes(t))) return false;
      }

      return true;
    });

    const sortDef = sorts.find((s) => s.value === sortBy);
    if (sortDef) {
      const key = sortDef.key ?? sortDef.value;
      const dir = sortDef.direction === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => {
        const av = a?.[key];
        const bv = b?.[key];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    }

    return result;
  }, [items, searchQuery, searchKeys, selects, selectValues, selectedTags, tagsKey, sorts, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    selectValues,
    setSelectValues,
    setSelectValue,
    selectedTags,
    toggleTag,
    setSelectedTags,
    sortBy,
    setSortBy,
    allTags,
    filteredItems,
    hasActiveFilters,
    activeCount,
    clearAll,
  };
}

export const ALL_VALUE = ALL;
