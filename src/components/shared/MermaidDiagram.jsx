import React, { useEffect, useId, useState } from 'react';

import { Alert, Box, Typography } from '@mui/material';
import mermaid from 'mermaid';

let mermaidInitialized = false;

export default function MermaidDiagram({ title, description, caption, chart = '', error, sx }) {
  const diagramId = useId().replace(/:/g, '');
  const [renderError, setRenderError] = useState('');
  const [svg, setSvg] = useState('');

  useEffect(() => {
    if (!chart?.trim()) {
      setSvg('');
      return;
    }

    if (!mermaidInitialized) {
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
      mermaidInitialized = true;
    }

    let cancelled = false;

    mermaid
      .render(`mermaid-${diagramId}`, chart)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg);
          setRenderError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRenderError(err?.message || 'Failed to render mermaid diagram.');
          setSvg('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, diagramId]);

  return (
    <Box sx={sx}>
      {title ? <Typography variant="subtitle1" sx={{ mb: 1 }}>{title}</Typography> : null}
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {description}
        </Typography>
      ) : null}
      {error || renderError ? (
        <Alert severity="error">{error || renderError}</Alert>
      ) : (
        <Box
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflowX: 'auto',
            bgcolor: 'background.paper',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      {caption ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {caption}
        </Typography>
      ) : null}
    </Box>
  );
}
