import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Alert, Chip } from '@mui/material';
import CatalogDetailLayout, {
  CatalogDetailUnpublished,
} from '../layouts/CatalogDetailLayout';
import { getPrebuiltModuleById } from '../data/registries/prebuiltModuleRegistry';

export default function PrebuiltModuleDetail() {
  const { id } = useParams();
  const module = useMemo(() => getPrebuiltModuleById(id), [id]);

  if (!module) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Prebuilt module not found for id: <strong>{id}</strong>
      </Alert>
    );
  }

  if (!module.active) {
    return (
      <CatalogDetailUnpublished
        item={module}
        backHref="/modules"
        backLabel="Back to prebuilt modules"
        message="This microservice suite is not published yet."
      />
    );
  }

  return (
    <CatalogDetailLayout
      item={module}
      backHref="/modules"
      backLabel="Back to prebuilt modules"
      renderChips={(row) => (
        <>
          <Chip size="small" label={`Category: ${row.category}`} />
          {row.tags?.map((tag) => (
            <Chip key={tag} size="small" variant="outlined" label={tag} />
          ))}
        </>
      )}
    />
  );
}
