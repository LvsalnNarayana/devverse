// React
import React, { useMemo, useState } from 'react';

// External
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const TONE_COLORS = {
  better: 'success.main',
  good: 'success.main',
  worse: 'error.main',
  bad: 'error.main',
  neutral: 'text.secondary',
  highlight: 'primary.main',
};

/**
 * @param {unknown} cell
 */
function renderCellContent(cell) {
  if (cell == null) return '–';
  if (typeof cell === 'object' && cell !== null && 'value' in cell) {
    const tone = cell.tone ?? cell.variant;
    return (
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontWeight: tone ? 600 : 400,
          color: tone ? TONE_COLORS[tone] ?? 'text.primary' : 'text.primary',
        }}
      >
        {cell.value ?? '–'}
      </Typography>
    );
  }
  return cell;
}

/**
 * @param {'default'|'plain'|'striped'|'interactive'|'comparison'} [tableVariant]
 */
export default function BasicTable({
  columns = [],
  rows = [],
  title,
  caption,
  dense = false,
  striped = true,
  hover = true,
  stickyHeader = false,
  maxHeight,
  empty = 'No rows',
  tableVariant = 'default',
  onRowClick,
  sx,
}) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });

  const resolvedStriped =
    tableVariant === 'plain' ? false : tableVariant === 'striped' ? true : striped;
  const resolvedHover =
    tableVariant === 'plain' || tableVariant === 'striped'
      ? false
      : tableVariant === 'interactive' || tableVariant === 'comparison'
        ? true
        : hover;
  const isInteractive = tableVariant === 'interactive';
  const isComparison = tableVariant === 'comparison';

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a?.[sort.key];
      const bv = b?.[sort.key];
      const aVal = typeof av === 'object' && av?.value != null ? av.value : av;
      const bVal = typeof bv === 'object' && bv?.value != null ? bv.value : bv;
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [rows, sort]);

  const handleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return { key: null, dir: 'asc' };
    });
  };

  const displayColumns =
    isInteractive && !columns.some((c) => c.key === '__action')
      ? [...columns, { key: '__action', label: '', width: 48, align: 'right' }]
      : columns;

  return (
    <Paper
      elevation={0}
      sx={[
        (theme) => ({
          mt: 2,
          mb: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: theme.palette.divider,
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        }),
        ...(Array.isArray(sx) ? sx : [sx].filter(Boolean)),
      ]}
    >
      {title ? (
        <Box
          sx={(theme) => ({
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor: alpha(theme.palette.text.primary, 0.02),
          })}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            {title}
          </Typography>
        </Box>
      ) : null}

      <TableContainer sx={{ maxHeight }}>
        <Table size={dense ? 'small' : 'medium'} stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {displayColumns.map((col) => {
                const isActive = sort.key === col.key;
                if (col.key === '__action') {
                  return <TableCell key="__action" sx={{ width: 48 }} />;
                }
                return (
                  <TableCell
                    key={col.key ?? col.id}
                    align={col.align ?? 'left'}
                    sortDirection={isActive ? sort.dir : false}
                    sx={(theme) => ({
                      width: col.width,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: 0.6,
                      color: theme.palette.text.secondary,
                      backgroundColor: alpha(theme.palette.text.primary, 0.04),
                      borderBottom: '1px solid',
                      borderColor: theme.palette.divider,
                      whiteSpace: 'nowrap',
                    })}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={isActive}
                        direction={isActive ? sort.dir : 'asc'}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(1, displayColumns.length)}
                  sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}
                >
                  {empty}
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row, rowIdx) => (
                <TableRow
                  key={row?.id ?? rowIdx}
                  hover={resolvedHover}
                  onClick={
                    isInteractive && onRowClick
                      ? () => onRowClick(row, rowIdx)
                      : isInteractive
                        ? () => {}
                        : undefined
                  }
                  sx={(theme) => ({
                    cursor: isInteractive ? 'pointer' : 'default',
                    transition: 'background-color 120ms ease',
                    ...(resolvedStriped &&
                      rowIdx % 2 === 1 && {
                        backgroundColor: alpha(theme.palette.text.primary, 0.025),
                      }),
                    ...(resolvedHover && {
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }),
                    ...(isComparison &&
                      row.highlight && {
                        backgroundColor: alpha(theme.palette.primary.main, 0.06),
                      }),
                    '& td': {
                      borderBottom: '1px solid',
                      borderColor: theme.palette.divider,
                    },
                    '&:last-of-type td': { borderBottom: 0 },
                  })}
                >
                  {displayColumns.map((col) => {
                    if (col.key === '__action') {
                      return (
                        <TableCell key="__action" align="right">
                          <IconButton size="small" color="primary" aria-label="Open row">
                            {row.href ? (
                              <OpenInNewRoundedIcon fontSize="small" />
                            ) : (
                              <ChevronRightRoundedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                      );
                    }
                    const field = col.field ?? col.key ?? col.id;
                    const value = row[field];
                    const content = col.render
                      ? col.render(row)
                      : col.formatter
                        ? col.formatter(value, row)
                        : isComparison
                          ? renderCellContent(value)
                          : (value ?? '–');
                    return (
                      <TableCell
                        key={field}
                        align={col.align ?? 'left'}
                        sx={{
                          fontSize: '0.875rem',
                          fontFamily: col.mono
                            ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                            : 'inherit',
                          color: 'text.primary',
                          width: col.width,
                        }}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {caption ? (
        <Stack
          sx={(theme) => ({
            px: 2,
            py: 1,
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor: alpha(theme.palette.text.primary, 0.02),
          })}
        >
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        </Stack>
      ) : null}
    </Paper>
  );
}
