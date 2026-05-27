/**
 * Normalizes legacy heatmap blocks (string columns + values[]) to the
 * column-key shape expected by Heatmap.
 *
 * @param {Record<string, unknown>} block
 */
export function normalizeHeatmapBlock(block) {
  const rawColumns = block.columns ?? [];
  const rawRows = block.rows ?? [];

  if (
    rawColumns.length > 0 &&
    typeof rawColumns[0] === 'object' &&
    rawColumns[0] !== null &&
    'key' in rawColumns[0]
  ) {
    return {
      columns: rawColumns,
      rows: rawRows,
      scale: block.scale ?? 'column',
      rowHeader: block.rowHeader,
      showValues: block.showValues,
      lowerIsBetter: block.lowerIsBetter,
    };
  }

  const columnLabels = rawColumns.map((c) => String(c));
  const columns = columnLabels.map((label, i) => ({
    key: `col_${i}`,
    label,
    palette: block.columnPalettes?.[i] ?? block.palettes?.[i],
    lowerIsBetter: block.columnLowerIsBetter?.[i],
  }));

  const rows = rawRows.map((row, rowIndex) => {
    const r = /** @type {Record<string, unknown>} */ (row);
    const normalized = {
      id: r.id ?? `row-${rowIndex}`,
      label: r.label ?? r.id ?? `Row ${rowIndex + 1}`,
    };
    const values = Array.isArray(r.values) ? r.values : [];
    columns.forEach((col, i) => {
      normalized[col.key] = values[i];
    });
    return normalized;
  });

  return {
    columns,
    rows,
    scale: typeof block.scale === 'string' ? block.scale : 'column',
    rowHeader: block.rowHeader,
    showValues: block.showValues,
    lowerIsBetter: block.lowerIsBetter,
  };
}
