// External
import { Link as RouterLink } from 'react-router-dom';

// External
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { deepmerge } from '@mui/utils';

// Relative
import Tag from './Tag';
import TagList from './TagList';

const lineClamp = (lines) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const isInternalLink = (link) => typeof link === 'string' && link.startsWith('/');

/**
 * DisplayCard — listing card with cover image, tags, title, description, and CTA.
 * When no image is provided (or it fails to load), the cover shows the title on a
 * themed gradient instead of a skeleton or empty placeholder.
 *
 * @param {object} props
 * @param {object} props.data
 * @param {string} [props.data.image]
 * @param {string} props.data.title
 * @param {string} [props.data.description]
 * @param {string[]} [props.data.tags]
 * @param {string} [props.data.link]
 * @param {string} [props.data.href]
 * @param {string} [props.data.to]
 * @param {number} [props.data.maxTags=3]
 * @param {string} [props.type='item']  CTA label: "View {type}"
 * @param {number} [props.descriptionLines]  Optional description line clamp.
 * @param {import('@mui/material').SxProps<import('@mui/material').Theme>} [props.cardSx]
 */
export default function DisplayCard({
  data,
  type = 'item',
  descriptionLines,
  cardSx,
}) {
  const { title, description, tags = [], maxTags = 3 } = data || {};

  const link = data?.link ?? data?.href ?? data?.to ?? '#';
  const ctaType = type ?? data?.type ?? 'item';
  const internal = isInternalLink(link);

  return (
    <Card
      sx={(theme) =>
        deepmerge(
          {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.divider,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxShadow: theme.shadows[0],
            '&:hover': {
              transform: 'none',
              borderColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              boxShadow: theme.shadows[1],
            },
          },
          cardSx ?? {},
        )
      }
    >
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, px: 2.5, py: 2 }}
      >
        <TagList gap={1.25} sx={{ mb: 1.5, minHeight: 24 }}>
          {tags.slice(0, maxTags).map((tag) => (
            <Tag key={tag} label={tag} size="sm" />
          ))}
        </TagList>

        <Typography
          variant="subtitle1"
          sx={{ minHeight: 53, mb: 1, lineHeight: 1.3, ...lineClamp(2) }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.5,
              ...(descriptionLines ? lineClamp(descriptionLines) : {}),
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>

      <Box sx={{ px: 2, pb: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          disableElevation
          disableRipple
          variant="text"
          size="small"
          endIcon={<ArrowForwardIcon />}
          component={internal ? RouterLink : 'a'}
          to={internal ? link : undefined}
          href={!internal ? link : undefined}
          target={!internal ? '_blank' : undefined}
          rel={!internal ? 'noopener noreferrer' : undefined}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'primary.main',
            px: 1,
            '&:hover': { background: 'transparent' },
          }}
        >
          View {ctaType}
        </Button>
      </Box>
    </Card>
  );
}
