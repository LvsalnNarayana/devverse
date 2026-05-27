import { Alert, CircularProgress, Stack } from '@mui/material';
import ModuleListingLayout from '../layouts/ModuleListingLayout';
import { projectAllTags, projectCategories, projects } from '../data/registries/projectRegistry';
import { useModulePageLayout } from '../hooks/useModulePageLayout';

export default function Projects() {
  const { config, loading, error } = useModulePageLayout('projects');

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !config) {
    return <Alert severity="error">{error || 'Failed to load projects listing config.'}</Alert>;
  }

  return (
    <ModuleListingLayout
      config={config}
      items={projects}
      allTags={projectAllTags}
      optionsBySource={{ projectCategories }}
    />
  );
}
