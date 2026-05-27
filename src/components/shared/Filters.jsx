// React
import { useState } from 'react';

// External
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

// Relative
import { ALL_VALUE } from '../../hooks/useFilters';

const TAG_PREVIEW_COUNT = 16;

const SMALL_FONT = '0.85rem';
const SMALL_LABEL_FONT = '0.75rem';

const smallSelectSx = {
  fontSize: SMALL_FONT,
  '& .MuiSelect-select': { py: 1 },
};

const smallMenuItemSx = { fontSize: SMALL_FONT, minHeight: 32 };

const smallTextFieldSx = {
  '& .MuiInputBase-root': { fontSize: SMALL_FONT, border: `1px solid #00000080` },
  '& .MuiInputBase-input': { py: 1.25 },
  '& .MuiInputBase-input::placeholder': {
    fontSize: SMALL_FONT,
    opacity: 0.7,
  },
};

const smallInputLabelSx = {
  fontSize: SMALL_LABEL_FONT,
  '&.MuiInputLabel-shrink': { fontSize: SMALL_LABEL_FONT },
};

const sectionLabelSx = {
  display: 'block',
  fontWeight: 700,
  fontSize: SMALL_LABEL_FONT,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  mb: 0.75,
};

const selectMenuSlotProps = {
  paper: { sx: { '& .MuiMenuItem-root': smallMenuItemSx } },
};

/** Ensure MUI Select always has a valid "All" option when value defaults to ALL_VALUE. */
function optionsWithAll(options) {
  if (!Array.isArray(options)) return [ALL_VALUE];
  return options.includes(ALL_VALUE) ? options : [ALL_VALUE, ...options];
}

/* ------------------------------------------------------------------ */
/*  TOP SEARCH BAR                                                     */
/* ------------------------------------------------------------------ */

export function FiltersSearch({
  searchPlaceholder = 'Search…',
  searchQuery,
  onSearchChange,
  resultCount,
  trailing,
}) {
  return (
    <Stack
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: 1, ...smallTextFieldSx }}
      />
      {trailing}
      {resultCount && (
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ fontSize: SMALL_FONT, whiteSpace: 'nowrap' }}
        >
          {resultCount.shown} of {resultCount.total}
        </Typography>
      )}
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/*  FILTERS BUTTON (Tune icon → popover)                               */
/* ------------------------------------------------------------------ */

export function FilterPopOver({
  selects = [],
  sorts = [],
  allTags = [],
  selectValues,
  onSelectChange,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange,
  activeCount = 0,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAllTags, setShowAllTags] = useState(false);

  const open = Boolean(anchorEl);
  const visibleTags = showAllTags ? allTags : allTags.slice(0, TAG_PREVIEW_COUNT);
  const hiddenTagCount = Math.max(0, allTags.length - TAG_PREVIEW_COUNT);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Filters" arrow>
        <Badge
          badgeContent={activeCount}
          color="primary"
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.625rem',
              height: 16,
              minWidth: 16,
              padding: '0 4px',
            },
          }}
        >
          <IconButton
            onClick={handleOpen}
            aria-label="Open filters"
            sx={(theme) => ({
              width: 38,
              height: 38,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: activeCount > 0 ? 'primary.main' : 'divider',
              color: activeCount > 0 ? 'primary.main' : 'text.primary',
              transition: 'border-color 200ms ease, background-color 200ms ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: 'primary.main',
              },
            })}
          >
            <TuneIcon fontSize="small" />
          </IconButton>
        </Badge>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              p: 2,
              borderRadius: 2,
              width: { xs: 'calc(100vw - 32px)', sm: 360 },
              maxWidth: 360,
              maxHeight: 'min(70vh, 560px)',
              overflowY: 'auto',
            },
          },
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
          Filters
        </Typography>

        <Stack sx={{ gap: 3 }}>
          {selects.map((s) => (
            <FormControl key={s.key} fullWidth size="small">
              <InputLabel sx={smallInputLabelSx}>{s.label}</InputLabel>
              <Select
                value={selectValues[s.key] ?? ALL_VALUE}
                label={s.label}
                onChange={(e) => onSelectChange(s.key, e.target.value)}
                sx={{ ...smallSelectSx, borderRadius: 2 }}
                MenuProps={{ slotProps: selectMenuSlotProps }}
              >
                {optionsWithAll(s.options).map((opt) => (
                  <MenuItem key={opt} value={opt} sx={smallMenuItemSx}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {sorts.length > 0 && (
            <FormControl fullWidth size="small">
              <InputLabel sx={smallInputLabelSx}>Sort by</InputLabel>
              <Select
                value={sortBy ?? sorts[0]}
                label="Sort by"
                onChange={(e) => onSortChange?.(e.target.value)}
                sx={smallSelectSx}
                MenuProps={{ slotProps: selectMenuSlotProps }}
              >
                {sorts.map((s) => (
                  <MenuItem key={s.value} value={s.value} sx={smallMenuItemSx}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>

        {allTags.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography sx={sectionLabelSx}>Tags</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
              {visibleTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={() => onTagToggle(tag)}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                    sx={{
                      height: 24,
                      fontSize: SMALL_FONT,
                      fontWeight: active ? 400 : 400,
                      cursor: 'pointer',
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        px: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                    }}
                  />
                );
              })}
              {hiddenTagCount > 0 && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setShowAllTags((v) => !v)}
                  sx={{
                    height: 24,
                    minHeight: 24,
                    borderRadius: 999,
                    px: 1.25,
                    fontSize: SMALL_FONT,
                    py: 0,
                  }}
                >
                  {showAllTags ? 'Show less' : `+${hiddenTagCount} more`}
                </Button>
              )}
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button size="small" variant="contained" onClick={handleClose}>
            Done
          </Button>
        </Stack>
      </Popover>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  ACTIVE FILTERS (chips below the search bar)                        */
/* ------------------------------------------------------------------ */

export function ActiveFilters({
  selects = [],
  selectValues = {},
  onSelectChange,
  selectedTags = [],
  onTagToggle,
  searchQuery = '',
  onSearchChange,
  hasActiveFilters,
  onClearAll,
}) {
  if (!hasActiveFilters) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.75,
        width: '100%',
        minWidth: 0,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          fontSize: SMALL_LABEL_FONT,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          mr: 0.25,
        }}
      >
        Active:
      </Typography>

      {searchQuery.trim() && onSearchChange && (
        <Chip
          size="small"
          label={`"${searchQuery.trim()}"`}
          onDelete={() => onSearchChange('')}
          sx={{ height: 24, fontSize: SMALL_FONT, fontWeight: 400, maxWidth: '100%' }}
        />
      )}

      {selects.map((s) => {
        const v = selectValues[s.key];
        if (!v || v === ALL_VALUE) return null;
        return (
          <Chip
            key={s.key}
            size="small"
            label={`${s.label}: ${v}`}
            onDelete={() => onSelectChange(s.key, ALL_VALUE)}
            sx={{ height: 24, fontSize: SMALL_FONT, maxWidth: '100%' }}
          />
        );
      })}

      {selectedTags.map((tag) => (
        <Chip
          key={tag}
          size="small"
          color="primary"
          label={tag}
          onDelete={() => onTagToggle(tag)}
          sx={{ height: 24, fontSize: SMALL_FONT, maxWidth: '100%' }}
        />
      ))}

      <Button
        size="small"
        onClick={onClearAll}
        sx={{ fontSize: SMALL_FONT, py: 0, minHeight: 24, ml: 'auto' }}
      >
        Clear all
      </Button>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export — combined search + button + active strip           */
/* ------------------------------------------------------------------ */

export default function Filters(props) {
  return (
    <Stack sx={{ gap: 2, width: '100%', minWidth: 0 }}>
      <FiltersSearch
        searchPlaceholder={props.searchPlaceholder}
        searchQuery={props.searchQuery}
        onSearchChange={props.onSearchChange}
        resultCount={props.resultCount}
        trailing={
          <FilterPopOver
            selects={props.selects}
            sorts={props.sorts}
            allTags={props.allTags}
            selectValues={props.selectValues}
            onSelectChange={props.onSelectChange}
            selectedTags={props.selectedTags}
            onTagToggle={props.onTagToggle}
            sortBy={props.sortBy}
            onSortChange={props.onSortChange}
            activeCount={props.activeCount}
          />
        }
      />
      <ActiveFilters
        selects={props.selects}
        selectValues={props.selectValues}
        onSelectChange={props.onSelectChange}
        selectedTags={props.selectedTags}
        onTagToggle={props.onTagToggle}
        searchQuery={props.searchQuery}
        onSearchChange={props.onSearchChange}
        hasActiveFilters={props.hasActiveFilters}
        onClearAll={props.onClearAll}
      />
    </Stack>
  );
}
