import { Box, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * LinkedList visualization — renders nodes with next/prev pointers as arrows.
 *
 * Step shape:
 * - nodes: Array<{ value: string|number, id?: string|number }>
 * - highlightIds?: Array<string|number>   — highlighted node ids or indexes
 * - highlightIndexes?: number[]           — alt: highlight by position
 * - mode?: 'singly' | 'doubly'
 * - headIndex?: number                    — index of head node (default 0)
 * - tailIndex?: number                    — index of tail node (default last)
 * - pointers?: Array<{ index: number, label: string, color?: string }>
 */
export default function LinkedListVisualization({ steps = [], stepIndex = 0, mode = 'singly' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const step = steps[stepIndex] ?? {};

  const nodes = Array.isArray(step.nodes)
    ? step.nodes
    : Array.isArray(step.values)
      ? step.values.map((v) => ({ value: v }))
      : Array.isArray(step.array)
        ? step.array.map((v) => ({ value: v }))
        : [];

  const highlightIndexes = Array.isArray(step.highlightIndexes) ? step.highlightIndexes : [];
  const highlightIds = Array.isArray(step.highlightIds) ? step.highlightIds : [];
  const resolvedMode = step.mode ?? mode;
  const headIndex = step.headIndex ?? 0;
  const tailIndex = step.tailIndex ?? nodes.length - 1;
  const pointers = Array.isArray(step.pointers) ? step.pointers : [];

  if (!nodes.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">Linked list is empty.</Typography>
      </Box>
    );
  }

  const NODE_W = 64;
  const NODE_H = 44;
  const ARROW_W = 40;
  const TOTAL_W = nodes.length * NODE_W + (nodes.length - 1) * ARROW_W;

  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const secondary = theme.palette.secondary.main;

  const isHighlighted = (idx, node) =>
    highlightIndexes.includes(idx) || (node?.id != null && highlightIds.includes(node.id));

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, overflow: 'auto' }}>
      {/* Linked list label */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 2, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        {resolvedMode === 'doubly' ? 'Doubly Linked List' : 'Singly Linked List'}
      </Typography>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box
          sx={{
            position: 'relative',
            minWidth: TOTAL_W + 80,
            height: 120,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* NULL label at start for doubly */}
          {resolvedMode === 'doubly' && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontFamily: 'monospace', mr: 1, flexShrink: 0 }}
            >
              NULL
            </Typography>
          )}

          {nodes.map((node, idx) => {
            const val = typeof node === 'object' && node !== null ? node.value : node;
            const active = isHighlighted(idx, node);
            const isHead = idx === headIndex;
            const isTail = idx === tailIndex;
            const extraPointer = pointers.find((p) => p.index === idx);

            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {/* Node box */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Head/Tail/extra pointer labels above */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -26,
                      display: 'flex',
                      gap: 0.5,
                      flexWrap: 'nowrap',
                    }}
                  >
                    {isHead && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: success,
                          fontSize: '0.65rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        HEAD
                      </Typography>
                    )}
                    {isTail && nodes.length > 1 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: warning,
                          fontSize: '0.65rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        TAIL
                      </Typography>
                    )}
                    {extraPointer && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: extraPointer.color ?? secondary,
                          fontSize: '0.65rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {extraPointer.label}
                      </Typography>
                    )}
                  </Box>

                  {/* Node cell — split: data | next */}
                  <Box
                    sx={{
                      display: 'flex',
                      border: '2px solid',
                      borderColor: active ? primary : 'divider',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      width: NODE_W,
                      height: NODE_H,
                      bgcolor: active
                        ? alpha(primary, isDark ? 0.2 : 0.1)
                        : alpha(theme.palette.text.primary, 0.03),
                      transition: 'all 220ms ease',
                      boxShadow: active ? `0 0 0 3px ${alpha(primary, 0.2)}` : 'none',
                    }}
                  >
                    {/* Data section */}
                    <Box
                      sx={{
                        flex: 1,
                        display: 'grid',
                        placeItems: 'center',
                        borderRight: '1px solid',
                        borderColor: active ? alpha(primary, 0.4) : 'divider',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: active ? primary : 'text.primary',
                      }}
                    >
                      {String(val)}
                    </Box>
                    {/* Next pointer section */}
                    <Box
                      sx={{
                        width: 20,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: active
                          ? alpha(primary, 0.08)
                          : alpha(theme.palette.text.primary, 0.04),
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.disabled',
                          fontSize: '0.5rem',
                          writingMode: 'vertical-rl',
                          lineHeight: 1,
                        }}
                      >
                        {idx === tailIndex ? 'null' : '→'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Index below */}
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: 'monospace', fontSize: '0.6rem', mt: 0.5 }}
                  >
                    [{idx}]
                  </Typography>
                </Box>

                {/* Arrow between nodes */}
                {idx < nodes.length - 1 && (
                  <Box
                    sx={{
                      width: ARROW_W,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.25,
                      flexShrink: 0,
                    }}
                  >
                    {/* Forward arrow */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        sx={{
                          flex: 1,
                          height: 2,
                          bgcolor: alpha(theme.palette.text.secondary, 0.4),
                        }}
                      />
                      <Box
                        component="span"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                          lineHeight: 1,
                          ml: -0.5,
                        }}
                      >
                        ▶
                      </Box>
                    </Box>
                    {/* Backward arrow for doubly */}
                    {resolvedMode === 'doubly' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box
                          component="span"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.7rem',
                            lineHeight: 1,
                            mr: -0.5,
                          }}
                        >
                          ◀
                        </Box>
                        <Box
                          sx={{
                            flex: 1,
                            height: 2,
                            bgcolor: alpha(theme.palette.text.secondary, 0.25),
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}

          {/* NULL at end */}
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontFamily: 'monospace', ml: 1, flexShrink: 0 }}
          >
            NULL
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
