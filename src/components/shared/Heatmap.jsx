// React
import React, { useMemo } from 'react';

// External
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// Relative
import VisualizationLegend from './VisualizationLegend';

const DEFAULT_FORMATTER = (v) => {
  if (v == null || Number.isNaN(v)) return '–';
  if (typeof v === 'number') {
    if (Math.abs(v) >= 1000) return v.toLocaleString();
    return Number.isInteger(v) ? String(v) : v.toFixed(2);
  }
  return String(v);
};

/**
 * Theme-aware heatmap with per-column palette and scale modes.
 */
export default function Heatmap({
  title,
  caption,
  columns = [],
  rows = [],
  scale = 'column',
  rowHeader = 'Series',
  showValues = true,
  lowerIsBetter = false,
  showLegend = true,
  legend,
  sx,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const legendItems =
    legend ??
    columns.map((col) => ({
      label: col.label,
      color: theme.palette[col.palette ?? 'primary']?.main ?? theme.palette.primary.main,
    }));

  const ranges = useMemo(() => {
    const pickNumber = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : null);

    const perColumn = {};
    columns.forEach((c) => {
      const values = rows.map((r) => pickNumber(r[c.key])).filter((v) => v !== null);
      perColumn[c.key] = values.length
        ? { min: Math.min(...values), max: Math.max(...values) }
        : { min: 0, max: 0 };
    });

    const perRow = {};
    rows.forEach((r) => {
      const values = columns.map((c) => pickNumber(r[c.key])).filter((v) => v !== null);
      perRow[r.id ?? r.label] = values.length
        ? { min: Math.min(...values), max: Math.max(...values) }
        : { min: 0, max: 0 };
    });

    const allValues = [];
    rows.forEach((r) => {
      columns.forEach((c) => {
        const n = pickNumber(r[c.key]);
        if (n !== null) allValues.push(n);
      });
    });
    const global = allValues.length
      ? { min: Math.min(...allValues), max: Math.max(...allValues) }
      : { min: 0, max: 0 };

    return { perColumn, perRow, global };
  }, [columns, rows]);

  const getIntensity = (value, col, row) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0;
    let range;
    if (scale === 'row') range = ranges.perRow[row.id ?? row.label];
    else if (scale === 'global') range = ranges.global;
    else range = ranges.perColumn[col.key];

    if (!range || range.max === range.min) return 0;
    const norm = (value - range.min) / (range.max - range.min);
    const colLowerBetter = col.lowerIsBetter ?? lowerIsBetter;
    return colLowerBetter ? 1 - norm : norm;
  };

  const getCellColor = (intensity, col) => {
    const paletteKey = col.palette ?? 'primary';
    const base = theme.palette[paletteKey]?.main ?? theme.palette.primary.main;
    const i = Math.max(0, Math.min(1, intensity));
    const a = i === 0 ? 0 : isDark ? 0.12 + i * 0.48 : 0.08 + i * 0.52;
    const fg =
      i > 0.72
        ? theme.palette.getContrastText(base)
        : theme.palette.text.primary;
    return {
      bg: i === 0 ? theme.palette.action.hover : alpha(base, a),
      fg,
    };
  };

  return (
    <Box sx={[{ my: 2 }, ...(Array.isArray(sx) ? sx : [sx].filter(Boolean))]}>
      {title ? (
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: caption ? 0.25 : 1 }}>
          {title}
        </Typography>
      ) : null}
      {caption ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {caption}
        </Typography>
      ) : null}

      <TableContainer
        sx={(t) => ({
          border: '1px solid',
          borderColor: t.palette.divider,
          borderRadius: 2,
          overflowX: 'auto',
        })}
      >
        <Table size="small" sx={{ borderCollapse: 'separate' }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={(t) => ({
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                  color: t.palette.text.secondary,
                  borderBottom: '1px solid',
                  borderColor: t.palette.divider,
                  position: 'sticky',
                  left: 0,
                  backgroundColor: t.palette.background.paper,
                  zIndex: 1,
                })}
              >
                {rowHeader}
              </TableCell>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  sx={(t) => ({
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.4,
                    color: t.palette.text.secondary,
                    borderBottom: '1px solid',
                    borderColor: t.palette.divider,
                    whiteSpace: 'nowrap',
                  })}
                >
                  <Stack sx={{ alignItems: 'center', gap: 0.25 }}>
                    <span>{col.label}</span>
                    {(col.lowerIsBetter ?? lowerIsBetter) ? (
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontSize: '0.6rem', textTransform: 'none', letterSpacing: 0 }}
                      >
                        lower is better
                      </Typography>
                    ) : null}
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id ?? row.label}>
                <TableCell
                  sx={(t) => ({
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: t.palette.background.paper,
                    borderBottom: '1px solid',
                    borderColor: t.palette.divider,
                    zIndex: 1,
                  })}
                >
                  {row.label}
                </TableCell>
                {columns.map((col) => {
                  const value = row[col.key];
                  const intensity = getIntensity(value, col, row);
                  const { bg, fg } = getCellColor(intensity, col);
                  const formatter = col.formatter ?? DEFAULT_FORMATTER;
                  return (
                    <Tooltip
                      key={col.key}
                      title={typeof value === 'number' ? `${col.label}: ${formatter(value)}` : ''}
                      placement="top"
                    >
                      <TableCell
                        align="center"
                        sx={(t) => ({
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          color: fg,
                          backgroundColor: bg,
                          borderBottom: '1px solid',
                          borderColor: t.palette.divider,
                          minWidth: 64,
                        })}
                      >
                        {showValues ? formatter(value) : ''}
                      </TableCell>
                    </Tooltip>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showLegend && legendItems.length > 0 ? (
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
            Column scale (darker = higher relative value; latency columns invert when lower is better)
          </Typography>
          <VisualizationLegend items={legendItems} />
        </Box>
      ) : null}
    </Box>
  );
}
