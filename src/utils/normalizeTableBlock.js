/**
 * Normalizes table block JSON into columns + rows for BasicTable.
 *
 * @param {Record<string, unknown>} block
 */
export function normalizeTableBlock(block) {
  if (Array.isArray(block.columns) && Array.isArray(block.rows)) {
    return { columns: block.columns, rows: block.rows };
  }

  if (Array.isArray(block.headers) && Array.isArray(block.rows)) {
    const columns = block.headers.map((header, index) => ({
      id: `col-${index}`,
      label: header,
      field: `col${index}`,
    }));

    const rows = block.rows.map((row, rowIndex) => {
      if (Array.isArray(row)) {
        return row.reduce((acc, cell, cellIndex) => {
          acc[`col${cellIndex}`] = cell;
          return acc;
        }, { id: `row-${rowIndex}` });
      }

      return { id: row.id ?? `row-${rowIndex}`, ...row };
    });

    return { columns, rows };
  }

  return { columns: [], rows: [] };
}
