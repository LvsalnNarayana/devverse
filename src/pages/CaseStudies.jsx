import { Alert, CircularProgress, Stack } from '@mui/material';
import ModuleListingLayout from '../layouts/ModuleListingLayout';
import { allTags, caseStudies, categories } from '../data/registries/caseStudyRegistry';
import { useModulePageLayout } from '../hooks/useModulePageLayout';

/**
 * Case Studies page is a thin declarative wrapper.
 *
 * Flow:
 * - `public/configs/modulePageLayouts.json` → `caseStudies` section.
 * - `caseStudies` provides the dataset to render.
 * - `allTags` drives tag chips in filter UI.
 * - `optionsBySource.caseStudyCategories` satisfies JSON `optionsSource` references.
 */
export default function CaseStudies() {
  const { config, loading, error } = useModulePageLayout('caseStudies');

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !config) {
    return <Alert severity="error">{error || 'Failed to load case studies listing config.'}</Alert>;
  }

  return (
    <ModuleListingLayout
      config={config}
      items={caseStudies}
      allTags={allTags}
      optionsBySource={{ caseStudyCategories: categories }}
    />
  );
}
