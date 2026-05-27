import { Box, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * HashTableVisualization — bucket array with chaining or open addressing.
 *
 * Step shape:
 * - buckets: Array<Array<{ key: string|number, value?: string|number }> | null>
 *            Each slot is an array of entries (chaining) or null (empty).
 * - highlightBucket?: number     — bucket index to highlight
 * - highlightKey?: string|number — key being looked up / inserted
 * - collisionIndexes?: number[]  — buckets that have collision (>1 entry)
 * - mode?: 'chaining' | 'probing'
 * - loadFactor?: number          — shown in stats
 * - hashFormula?: string         — e.g. "key % 8" shown as caption
 */
export default function HashTableVisualization({ steps = [], stepIndex = 0, mode = 'chaining' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const step = steps[stepIndex] ?? {};

  const buckets = Array.isArray(step.buckets) ? step.buckets : [];
  const highlightBucket = step.highlightBucket ?? null;
  const highlightKey = step.highlightKey ?? null;
  const collisionIndexes = Array.isArray(step.collisionIndexes) ? step.collisionIndexes : [];
  const resolvedMode = step.mode ?? mode;
  const loadFactor = step.loadFactor ?? null;
  const hashFormula = step.hashFormula ?? null;

  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;

  if (!buckets.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">No hash table data to visualize.</Typography>
      </Box>
    );
  }

  const totalEntries = buckets.reduce(
    (sum, b) => sum + (Array.isArray(b) ? b.length : b != null ? 1 : 0),
    0,
  );
  const collisionCount = buckets.filter((b) => Array.isArray(b) && b.length > 1).length;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          Hash Table — {resolvedMode === 'chaining' ? 'Separate Chaining' : 'Open Addressing'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Buckets: <strong>{buckets.length}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Entries: <strong>{totalEntries}</strong>
          </Typography>
          {loadFactor != null && (
            <Typography variant="caption" color="text.secondary">
              Load: <strong>{loadFactor.toFixed(2)}</strong>
            </Typography>
          )}
          {collisionCount > 0 && (
            <Typography variant="caption" sx={{ color: warning }}>
              Collisions: <strong>{collisionCount}</strong>
            </Typography>
          )}
        </Box>
      </Box>

      {hashFormula && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mb: 1.5, display: 'block', fontFamily: 'monospace' }}
        >
          hash(key) = {hashFormula}
        </Typography>
      )}

      {/* Bucket array */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {buckets.map((bucket, idx) => {
          const isHighlightedBucket = idx === highlightBucket;
          const hasCollision =
            collisionIndexes.includes(idx) || (Array.isArray(bucket) && bucket.length > 1);
          const isEmpty = bucket == null || (Array.isArray(bucket) && bucket.length === 0);
          const entries = Array.isArray(bucket) ? bucket : bucket != null ? [bucket] : [];

          return (
            <Box
              key={`bucket-${idx}`}
              sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}
            >
              {/* Bucket index */}
              <Box
                sx={{
                  minWidth: 36,
                  height: 36,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 1,
                  border: '1.5px solid',
                  borderColor: isHighlightedBucket ? primary : 'divider',
                  bgcolor: isHighlightedBucket
                    ? alpha(primary, isDark ? 0.2 : 0.1)
                    : alpha(theme.palette.text.primary, 0.03),
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: isHighlightedBucket ? primary : 'text.secondary',
                  flexShrink: 0,
                  transition: 'all 220ms ease',
                }}
              >
                {idx}
              </Box>

              {/* Arrow */}
              <Box sx={{ display: 'flex', alignItems: 'center', height: 36, flexShrink: 0 }}>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                >
                  →
                </Typography>
              </Box>

              {/* Entries chain */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                {isEmpty ? (
                  <Box
                    sx={{
                      height: 36,
                      px: 1.5,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 1,
                      border: '1px dashed',
                      borderColor: 'divider',
                      bgcolor: 'transparent',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontFamily: 'monospace' }}
                    >
                      null
                    </Typography>
                  </Box>
                ) : (
                  entries.map((entry, eIdx) => {
                    const entryKey = typeof entry === 'object' ? entry.key : entry;
                    const entryVal = typeof entry === 'object' ? entry.value : null;
                    const isHighlightedEntry = entryKey === highlightKey;
                    const isColliding = eIdx > 0;

                    return (
                      <Box
                        key={`entry-${idx}-${eIdx}`}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        {eIdx > 0 && (
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                          >
                            →
                          </Typography>
                        )}
                        <Box
                          sx={(t) => ({
                            height: 36,
                            px: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            borderRadius: 1,
                            border: '1.5px solid',
                            borderColor: isHighlightedEntry
                              ? success
                              : isColliding
                                ? alpha(warning, 0.6)
                                : isHighlightedBucket
                                  ? alpha(primary, 0.5)
                                  : 'divider',
                            bgcolor: isHighlightedEntry
                              ? alpha(success, isDark ? 0.2 : 0.1)
                              : isColliding
                                ? alpha(warning, isDark ? 0.1 : 0.06)
                                : isHighlightedBucket
                                  ? alpha(primary, isDark ? 0.12 : 0.06)
                                  : alpha(t.palette.text.primary, 0.03),
                            transition: 'all 220ms ease',
                          })}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: isHighlightedEntry
                                ? success
                                : isColliding
                                  ? warning
                                  : 'text.primary',
                            }}
                          >
                            {String(entryKey)}
                          </Typography>
                          {entryVal != null && (
                            <>
                              <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{ fontFamily: 'monospace' }}
                              >
                                :
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                              >
                                {String(entryVal)}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1.5 }}>
        {[
          { color: primary, label: 'Active bucket' },
          { color: success, label: 'Found entry' },
          { color: warning, label: 'Collision' },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: color }} />
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
