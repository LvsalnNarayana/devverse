// React
import React, { useEffect, useMemo, useState } from 'react';

// External
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

/**
 * @typedef {{ id: string, title: string, group?: string }} TocItem
 */

/**
 * Reusable grouped table-of-contents navigation.
 * Accepts plain JS objects (including JSON-parsed data) and scrolls to matching DOM ids.
 *
 * @param {object} props
 * @param {TocItem[]} props.items
 * @param {string[]} [props.groups]
 * @param {string} [props.activeId]
 * @param {string} [props.heading]
 * @param {string} [props.ariaLabel]
 */
export default function GroupedSectionToc({
  items = [],
  groups,
  activeId,
  heading = 'On this page',
  ariaLabel = 'Page sections',
}) {
  const orderedGroups = useMemo(() => {
    if (Array.isArray(groups) && groups.length > 0) return groups;
    return [...new Set(items.map((item) => item.group).filter(Boolean))];
  }, [groups, items]);

  const [current, setCurrent] = useState(activeId ?? items[0]?.id);
  const [openGroups, setOpenGroups] = useState(() => new Set(orderedGroups));

  useEffect(() => {
    if (activeId) setCurrent(activeId);
  }, [activeId]);

  useEffect(() => {
    setOpenGroups(new Set(orderedGroups));
  }, [orderedGroups.join('|')]);

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setCurrent(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrent(id);
  };

  const toggleGroup = (group) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const foldAll = () => setOpenGroups(new Set());
  const unfoldAll = () => setOpenGroups(new Set(orderedGroups));

  return (
    <Box component="nav" aria-label={ariaLabel} sx={{ pr: 1 }}>
      {/* <Stack
        sx={{
          gap: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          mb: 1,
        }}
      >
        {orderedGroups.length > 1 ? (
          <Stack
            sx={{
              width: '100%',
              gap: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'stretch',
            }}
          >
            <Button
              fullWidth
              size="small"
              variant="text"
              onClick={unfoldAll}
              sx={{ textTransform: 'none', px: 0.75 }}
            >
              Unfold all
            </Button>
            <Button
              fullWidth
              size="small"
              variant="text"
              onClick={foldAll}
              sx={{ textTransform: 'none', px: 0.75 }}
            >
              Fold all
            </Button>
          </Stack>
        ) : null}
      </Stack>
      <Divider sx={{ my: 1 }} /> */}
      {orderedGroups.length === 0 && items.length > 0 ? (
        <List dense disablePadding>
          {items.map((item) => (
            <ListItemButton
              key={item.id}
              selected={current === item.id}
              onClick={() => scrollTo(item.id)}
              sx={{
                py: 0.5,
                borderRadius: 1,
                mx: 0.5,
                my: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  borderLeft: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '& .MuiListItemText-primary': {
                    fontWeight: 700,
                  },
                },
              }}
            >
              <ListItemText
                primary={item.title}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    fontWeight: current === item.id ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      ) : null}
      {orderedGroups.map((group) => {
        const groupedItems = items.filter((item) => item.group === group);
        if (!groupedItems.length) return null;

        const isOpen = openGroups.has(group);

        return (
          <Box key={group} sx={{ mb: 1.5 }}>
            <ListItemButton
              dense
              disableGutters
              onClick={() => toggleGroup(group)}
              sx={{
                px: 1.5,
                py: 0.5,
                mb: 0.25,
                borderRadius: 1,
              }}
            >
              <ListItemText
                slotProps={{
                  primary: {
                    variant: 'caption',
                    sx: {
                      fontWeight: 700,
                      color: 'text.primary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    },
                  },
                }}
                primary={group}
              />
              <Typography variant="caption" color="text.disabled">
                {isOpen ? '−' : '+'}
              </Typography>
            </ListItemButton>
            {isOpen ? (
              <List dense disablePadding>
                {groupedItems.map((item) => (
                  <ListItemButton
                    key={item.id}
                    selected={current === item.id}
                    onClick={() => scrollTo(item.id)}
                    sx={{
                      py: 0.5,
                      borderRadius: 1,
                      mx: 0.5,
                      my: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                        borderLeft: '2px solid',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '& .MuiListItemText-primary': {
                          fontWeight: 700,
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.title}
                      slotProps={{
                        primary: {
                          variant: 'body2',
                          fontWeight: current === item.id ? 600 : 500,
                        },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
}
