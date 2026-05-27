import { Alert, CircularProgress, Stack } from '@mui/material';
import ModuleListingLayout from '../layouts/ModuleListingLayout';
import {
  referenceAllTags,
  referenceLevels,
  references,
  referenceTypes,
} from '../data/registries/referenceRegistry';
import { useModulePageLayout } from '../hooks/useModulePageLayout';

/**
 * References listing — declarative wrapper over ModuleListingLayout.
 */
export default function References() {
  const { config, loading, error } = useModulePageLayout('references');

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !config) {
    return <Alert severity="error">{error || 'Failed to load references listing config.'}</Alert>;
  }

  return (
    <ModuleListingLayout
      config={config}
      items={references}
      allTags={referenceAllTags}
      optionsBySource={{
        referenceTypes,
        referenceLevels,
      }}
    />
  );
}
