import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Alert, Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import ScrollToTopFab from '../components/ScrollToTopFab';
import PageContent from '../components/renderer/PageContent';
import { usePageStructureMarkdown } from '../hooks/usePageStructureMarkdown';

/**
 * Shared detail shell for declarative catalog modules (case-study style).
 *
 * @param {object} props
 * @param {object} [props.item] — catalog row with title, description, tags, content, pageStructure, githubUrl
 * @param {string} props.backHref
 * @param {string} props.backLabel
 * @param {(item: object) => import('@mui/material').ReactNode} [props.renderChips]
 */
export default function CatalogDetailLayout({
  item,
  backHref,
  backLabel,
  renderChips,
}) {
  const { structureText, structureError } = usePageStructureMarkdown(item?.pageStructure);

  if (!item) return null;

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Button
        size="small"
        href={backHref}
        startIcon={<ArrowBackIcon />}
        sx={{ width: 'fit-content', textTransform: 'none' }}
      >
        {backLabel}
      </Button>

      <Stack sx={{ gap: 1 }}>
        <Typography variant="h4">{item.title}</Typography>
        <Typography color="text.secondary">{item.description}</Typography>
        {renderChips ? (
          <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {renderChips(item)}
            {item.githubUrl ? (
              <Button
                size="small"
                variant="outlined"
                startIcon={<GitHubIcon />}
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: 'none' }}
              >
                View on GitHub
              </Button>
            ) : null}
          </Stack>
        ) : null}
      </Stack>

      <Divider />

      {item.content ? <PageContent contentPath={item.content} /> : null}

      {item.pageStructure ? (
        <Stack sx={{ gap: 1, mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Page structure outline
          </Typography>
          {structureError ? (
            <Alert severity="info">{structureError}</Alert>
          ) : (
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                whiteSpace: 'pre-wrap',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: 13,
                lineHeight: 1.5,
                m: 0,
              }}
            >
              {structureText || 'Loading page structure...'}
            </Box>
          )}
        </Stack>
      ) : null}

      <ScrollToTopFab />
    </Stack>
  );
}

export function CatalogDetailUnpublished({ item, backHref, backLabel, message }) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Button
        size="small"
        href={backHref}
        startIcon={<ArrowBackIcon />}
        sx={{ width: 'fit-content', textTransform: 'none' }}
      >
        {backLabel}
      </Button>
      <Typography variant="h4">{item?.title}</Typography>
      <Alert severity="info">{message}</Alert>
      <ScrollToTopFab />
    </Stack>
  );
}
