import { Alert, CircularProgress, Stack } from '@mui/material';
import ModuleListingLayout from '../layouts/ModuleListingLayout';
import {
  prebuiltModuleAllTags,
  prebuiltModuleCategories,
  prebuiltModules,
} from '../data/registries/prebuiltModuleRegistry';
import { useModulePageLayout } from '../hooks/useModulePageLayout';

export default function PrebuiltModules() {
  const { config, loading, error } = useModulePageLayout('prebuiltModules');

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !config) {
    return (
      <Alert severity="error">{error || 'Failed to load prebuilt modules listing config.'}</Alert>
    );
  }

  return (
    <ModuleListingLayout
      config={config}
      items={prebuiltModules}
      allTags={prebuiltModuleAllTags}
      optionsBySource={{ prebuiltModuleCategories }}
    />
  );
}
