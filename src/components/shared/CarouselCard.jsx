// React
import React from 'react';

// External
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Card, CardActionArea, CardContent, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

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

export default function CarouselCard({
  eyebrow,
  title,
  description,
  tags = [],
  maxTags = 3,
  to,
  href,
  ctaLabel = 'Read more',
  sx,
}) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const link = to ?? href;
  const isInternal = link ? isInternalLink(link) : false;
  const interactive = Boolean(link);

  const linkProps = interactive
    ? isInternal
      ? { component: RouterLink, to: link }
      : {
          component: 'a',
          href: link,
          target: '_blank',
          rel: 'noopener noreferrer',
        }
    : {};

  const body = (
    <Stack sx={{ gap: 1.25, height: '100%', p: 2.5 }}>
      {eyebrow ? (
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: 'block', lineHeight: 1.4, letterSpacing: 0.8 }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3, ...lineClamp(2) }}>
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.875rem', lineHeight: 1.55, ...lineClamp(3) }}
        >
          {description}
        </Typography>
      ) : null}
      {tags.length > 0 ? (
        <TagList gap={1.25}>
          {tags.slice(0, maxTags).map((tag) => (
            <Tag key={tag} label={tag} size="sm" />
          ))}
        </TagList>
      ) : null}
      <Box sx={{ flex: 1, minHeight: 8 }} />
      {interactive ? (
        <Stack
          gap={0.5}
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            color: accent,
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          <span>{ctaLabel}</span>
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Stack>
      ) : null}
    </Stack>
  );

  return (
    <Card
      elevation={0}
      sx={[
        {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: '1px solid',
          borderColor: alpha(accent, 0.22),
          // borderTopWidth: 3,
          borderTopColor: accent,
          backgroundColor: theme.palette.background.paper,
          // backgroundImage: `linear-gradient(180deg, ${alpha(accent, 0.06)} 0%, transparent 72px)`,
          transition: 'border-color 180ms ease, box-shadow 180ms ease',
          ...(interactive && {
            '&:hover': {
              borderColor: alpha(accent, 0.45),
              borderTopColor: accent,
              boxShadow: theme.shadows[2],
              transform: 'none',
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
    >
      {interactive ? (
        <CardActionArea
          {...linkProps}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            flex: 1,
            textAlign: 'left',
            '& .MuiCardActionArea-focusHighlight': { display: 'none' },
          }}
        >
          {body}
        </CardActionArea>
      ) : (
        <CardContent sx={{ flex: 1, p: 0, '&:last-child': { pb: 0 } }}>{body}</CardContent>
      )}
    </Card>
  );
}
