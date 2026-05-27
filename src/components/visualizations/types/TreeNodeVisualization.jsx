import { Box, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * Tree / Heap visualization — renders a proper binary tree with SVG edges.
 *
 * Accepts two input formats:
 *
 * 1. Level-order array (simple):
 *    step.nodes = [1, 2, 3, null, 5, 6, 7]
 *    Nulls = empty slots (shown as gaps).
 *
 * 2. Node objects (rich):
 *    step.nodes = [{ id, value, left?, right?, parent? }]  — flat list
 *    step.rootId = id of root node
 *
 * Common step fields:
 * - highlightIds?: Array<id>        — highlighted node ids
 * - visitedIds?: Array<id>          — visited (greyed) nodes
 * - currentId?: id                  — currently processed node
 * - pathIds?: Array<id>             — nodes on found path
 * - comparingIds?: Array<id>        — nodes being compared (yellow)
 * - mode?: 'tree' | 'heap' | 'bst' — affects label shown
 */
export default function TreeNodeVisualization({ steps = [], stepIndex = 0, mode = 'tree' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const step = steps[stepIndex] ?? {};

  const highlightIds = Array.isArray(step.highlightIds) ? step.highlightIds : [];
  const visitedIds = Array.isArray(step.visitedIds) ? step.visitedIds : [];
  const comparingIds = Array.isArray(step.comparingIds) ? step.comparingIds : [];
  const pathIds = Array.isArray(step.pathIds) ? step.pathIds : [];
  const currentId = step.currentId ?? null;

  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

  // ── Build a flat positional list from level-order input ──────────────────
  const rawNodes = Array.isArray(step.nodes) ? step.nodes : [];

  // Detect format: if items are plain values (not objects with .value), treat as level-order
  const isLevelOrder =
    rawNodes.length > 0 &&
    (typeof rawNodes[0] !== 'object' || rawNodes[0] === null || rawNodes[0]?.value === undefined);

  let treeNodes = []; // { id, value, x, y, parentId }
  let edges = []; // { x1, y1, x2, y2 }

  if (isLevelOrder) {
    // Convert level-order array → positioned nodes
    const SVG_W = 600;
    const LEVEL_H = 72;
    const TOP_PAD = 40;

    // Build position for each valid index
    for (let i = 0; i < rawNodes.length; i++) {
      const val = rawNodes[i];
      if (val == null) continue;

      const depth = Math.floor(Math.log2(i + 1));
      const levelStart = Math.pow(2, depth) - 1;
      const levelEnd = Math.pow(2, depth + 1) - 2;
      const posInLevel = i - levelStart;
      const levelCount = levelEnd - levelStart + 1;
      const x = ((posInLevel + 0.5) / levelCount) * SVG_W;
      const y = TOP_PAD + depth * LEVEL_H;

      const parentIdx = i > 0 ? Math.floor((i - 1) / 2) : -1;
      treeNodes.push({ id: i, value: val, x, y, parentId: parentIdx >= 0 ? parentIdx : null });
    }

    // Build edges using positions
    const posMap = Object.fromEntries(treeNodes.map((n) => [n.id, n]));
    edges = treeNodes
      .filter((n) => n.parentId != null && posMap[n.parentId])
      .map((n) => {
        const p = posMap[n.parentId];
        return { x1: p.x, y1: p.y, x2: n.x, y2: n.y };
      });
  } else {
    // Rich node format — use provided positions or compute basic layout
    // Expects: { id, value, x?, y?, parent? }
    const SVG_W = 600;
    const LEVEL_H = 72;
    const TOP_PAD = 40;

    // If x/y not provided, do a simple level-order layout
    const hasPositions = rawNodes[0]?.x != null;
    if (hasPositions) {
      treeNodes = rawNodes
        .filter((n) => n != null)
        .map((n) => ({
          id: n.id,
          value: n.value ?? n.label ?? n.id,
          x: n.x,
          y: n.y,
          parentId: n.parent ?? null,
        }));
    } else {
      // BFS to assign x/y
      const nodeMap = Object.fromEntries(rawNodes.map((n) => [n.id, n]));
      const rootId = step.rootId ?? rawNodes[0]?.id;
      const queue = [{ id: rootId, depth: 0, parentId: null }];
      const depths = {};
      const depthCounts = {};
      const orderInDepth = {};
      const visited = new Set();

      while (queue.length) {
        const { id, depth, parentId } = queue.shift();
        if (visited.has(id)) continue;
        visited.add(id);
        depths[id] = depth;
        depthCounts[depth] = (depthCounts[depth] ?? 0) + 1;
        orderInDepth[id] = depthCounts[depth] - 1;
        const node = nodeMap[id];
        if (node?.left != null) queue.push({ id: node.left, depth: depth + 1, parentId: id });
        if (node?.right != null) queue.push({ id: node.right, depth: depth + 1, parentId: id });
        treeNodes.push({ id, value: node?.value ?? id, depth, parentId });
      }

      // Assign x/y
      treeNodes = treeNodes.map((n) => ({
        ...n,
        x: ((orderInDepth[n.id] + 0.5) / depthCounts[n.depth]) * SVG_W,
        y: TOP_PAD + n.depth * LEVEL_H,
      }));
    }

    const posMap = Object.fromEntries(treeNodes.map((n) => [n.id, n]));
    edges = treeNodes
      .filter((n) => n.parentId != null && posMap[n.parentId])
      .map((n) => {
        const p = posMap[n.parentId];
        return { x1: p.x, y1: p.y, x2: n.x, y2: n.y };
      });
  }

  const NODE_R = 20;
  const maxY = treeNodes.length ? Math.max(...treeNodes.map((n) => n.y)) : 0;
  const SVG_H = maxY + NODE_R + 30;

  const getNodeFill = (id) => {
    if (id === currentId) return warning;
    if (pathIds.includes(id)) return success;
    if (comparingIds.includes(id)) return theme.palette.warning.light;
    if (highlightIds.includes(id)) return primary;
    if (visitedIds.includes(id)) return alpha(primary, 0.5);
    return isDark ? theme.palette.grey[700] : theme.palette.grey[200];
  };

  const getTextFill = (id) => {
    if (id === currentId || pathIds.includes(id) || highlightIds.includes(id)) return '#fff';
    if (visitedIds.includes(id)) return '#fff';
    return theme.palette.text.primary;
  };

  if (!treeNodes.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">No tree data to visualize.</Typography>
      </Box>
    );
  }

  const modeLabel =
    { tree: 'Binary Tree', heap: 'Heap', bst: 'Binary Search Tree' }[mode] ?? 'Tree';

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        {step.label ?? modeLabel}
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 600 ${Math.max(SVG_H, 120)}`} width="100%" style={{ display: 'block' }}>
          {/* Edges */}
          {edges.map((e, i) => (
            <line
              key={`edge-${i}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={isDark ? alpha('#fff', 0.18) : alpha('#000', 0.15)}
              strokeWidth={1.5}
            />
          ))}

          {/* Nodes */}
          {treeNodes.map((node) => {
            const fill = getNodeFill(node.id);
            const textFill = getTextFill(node.id);
            const isCurrent = node.id === currentId;

            return (
              <g key={`node-${node.id}`}>
                {isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_R + 5}
                    fill="none"
                    stroke={warning}
                    strokeWidth={2}
                    opacity={0.5}
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_R}
                  fill={fill}
                  stroke={isDark ? alpha('#fff', 0.12) : alpha('#000', 0.1)}
                  strokeWidth={1.5}
                  style={{ transition: 'fill 300ms ease' }}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="monospace"
                  fill={textFill}
                  style={{ userSelect: 'none' }}
                >
                  {String(node.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.5 }}>
        {[
          { color: primary, label: 'Highlighted' },
          { color: warning, label: 'Current' },
          { color: success, label: 'Path/Found' },
          { color: alpha(primary, 0.5), label: 'Visited' },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
