import { Alert, CircularProgress, Stack } from '@mui/material';
import ModuleListingLayout from '../layouts/ModuleListingLayout';
import {
  dsaAllTags,
  dsaCategories,
  dsaDifficulties,
  dsaFrequencies,
  dsaStructureKinds,
  dsaTopics,
} from '../data/registries/dsaRegistry';
import { useModulePageLayout } from '../hooks/useModulePageLayout';

/**
 * DSA page is a declarative wrapper over `ModuleListingLayout`.
 *
 * Flow:
 * - `public/configs/modulePageLayouts.json` → `dsa` section defines listing behavior.
 * - `dsaTopics` is the card dataset.
 * - `dsaAllTags` powers tag-based filtering chips.
 * - `optionsBySource` maps JSON `optionsSource` keys to concrete option arrays.
 */
export default function DSA() {
  const { config, loading, error } = useModulePageLayout('dsa');

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !config) {
    return <Alert severity="error">{error || 'Failed to load DSA listing config.'}</Alert>;
  }

  return (
    <ModuleListingLayout
      config={config}
      items={dsaTopics}
      allTags={dsaAllTags}
      optionsBySource={{
        dsaCategories,
        dsaDifficulties,
        dsaFrequencies,
        dsaStructureKinds,
      }}
    />
  );
}
