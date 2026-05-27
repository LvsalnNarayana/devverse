import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Alert, Chip } from '@mui/material';
import CatalogDetailLayout, { CatalogDetailUnpublished } from '../layouts/CatalogDetailLayout';
import { getProjectById } from '../data/registries/projectRegistry';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = useMemo(() => getProjectById(id), [id]);

  if (!project) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Project not found for id: <strong>{id}</strong>
      </Alert>
    );
  }

  if (!project.active) {
    return (
      <CatalogDetailUnpublished
        item={project}
        backHref="/projects"
        backLabel="Back to projects"
        message="This project page is not published yet."
      />
    );
  }

  return (
    <CatalogDetailLayout
      item={project}
      backHref="/projects"
      backLabel="Back to projects"
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
