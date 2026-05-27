import { Alert, CircularProgress, Stack } from '@mui/material';
import ModuleListingLayout from '../layouts/ModuleListingLayout';
import {
  developerToolAllTags,
  developerToolCategories,
  developerTools,
} from '../data/registries/developerToolRegistry';
import { useModulePageLayout } from '../hooks/useModulePageLayout';

/**
 * Developer tools — listing only. Cards link directly to external tool URLs (no detail routes).
 */
export default function DeveloperTools() {
  const { config, loading, error } = useModulePageLayout('developerTools');

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !config) {
    return (
      <Alert severity="error">{error || 'Failed to load developer tools listing config.'}</Alert>
    );
  }

  return (
    <ModuleListingLayout
      config={config}
      items={developerTools}
      allTags={developerToolAllTags}
      optionsBySource={{ developerToolCategories }}
    />
  );
}
