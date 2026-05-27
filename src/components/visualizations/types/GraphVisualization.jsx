import { Box, Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * Graph visualization — SVG-based directed/undirected graph with positioned nodes.
 *
 * Step shape:
 * - nodes: Array<{ id: string|number, label?: string, x: number, y: number }>
 * - edges: Array<{ from: string|number, to: string|number, weight?: number, directed?: boolean }>
 * - visitedNodes?: Array<string|number>       — ids of visited nodes
 * - currentNode?: string|number               — currently active node id
 * - highlightEdges?: Array<[from, to]>        — edges to highlight
 * - pathNodes?: Array<string|number>          — nodes on the found path
 * - distances?: Record<string|number, number> — for Dijkstra display
 * - directed?: boolean                        — global directed flag (default false)
 */
export default function GraphVisualization({ steps = [], stepIndex = 0, mode = 'undirected' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const step = steps[stepIndex] ?? {};

  const nodes = Array.isArray(step.nodes) ? step.nodes : [];
  const edges = Array.isArray(step.edges) ? step.edges : [];
  const visitedNodes = Array.isArray(step.visitedNodes) ? step.visitedNodes : [];
  const pathNodes = Array.isArray(step.pathNodes) ? step.pathNodes : [];
  const currentNode = step.currentNode ?? null;
  const highlightEdges = Array.isArray(step.highlightEdges) ? step.highlightEdges : [];
  const distances = step.distances ?? null;
  const directed = step.directed ?? mode === 'directed';

  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;
  const textSecondary = theme.palette.text.secondary;

  const SVG_W = 600;
  const SVG_H = 340;
  const NODE_R = 22;

  if (!nodes.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">No graph data to visualize.</Typography>
      </Box>
    );
  }

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const isHighlightedEdge = (from, to) =>
    highlightEdges.some(
      ([f, t]) => (f === from && t === to) || (!directed && f === to && t === from),
    );

  const isPathEdge = (from, to) => {
    for (let i = 0; i < pathNodes.length - 1; i++) {
      if (
        (pathNodes[i] === from && pathNodes[i + 1] === to) ||
        (!directed && pathNodes[i] === to && pathNodes[i + 1] === from)
      )
        return true;
    }
    return false;
  };

  const getNodeColor = (id) => {
    if (id === currentNode) return warning;
    if (pathNodes.includes(id)) return success;
    if (visitedNodes.includes(id)) return primary;
    return isDark ? theme.palette.grey[700] : theme.palette.grey[300];
  };

  const getEdgeColor = (from, to) => {
    if (isPathEdge(from, to)) return success;
    if (isHighlightedEdge(from, to)) return warning;
    return isDark ? alpha('#fff', 0.2) : alpha('#000', 0.15);
  };

  const getEdgeWidth = (from, to) => {
    if (isPathEdge(from, to)) return 3;
    if (isHighlightedEdge(from, to)) return 2.5;
    return 1.5;
  };

  // Compute midpoint + offset for edge label
  const edgeMid = (n1, n2) => {
    const mx = (n1.x + n2.x) / 2;
    const my = (n1.y + n2.y) / 2;
    // Perpendicular offset for label
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: mx - (dy / len) * 10, y: my + (dx / len) * 10 };
  };

  // Arrow marker id
  const markerId = `arrowhead-${isDark ? 'dark' : 'light'}`;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        {directed ? 'Directed Graph' : 'Undirected Graph'}
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          style={{ display: 'block', maxHeight: 360 }}
        >
          <defs>
            <marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={alpha(textSecondary, 0.5)} />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const n1 = nodeMap[edge.from];
            const n2 = nodeMap[edge.to];
            if (!n1 || !n2) return null;

            const color = getEdgeColor(edge.from, edge.to);
            const strokeW = getEdgeWidth(edge.from, edge.to);
            const mid = edgeMid(n1, n2);

            // Shorten line so it doesn't overlap node circles
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const x1 = n1.x + (dx / len) * NODE_R;
            const y1 = n1.y + (dy / len) * NODE_R;
            const x2 = n2.x - (dx / len) * (NODE_R + (directed ? 6 : 0));
            const y2 = n2.y - (dy / len) * (NODE_R + (directed ? 6 : 0));

            return (
              <g key={`e-${i}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={strokeW}
                  markerEnd={directed ? `url(#${markerId})` : undefined}
                  style={{ transition: 'stroke 300ms ease, stroke-width 300ms ease' }}
                />
                {edge.weight != null && (
                  <text
                    x={mid.x}
                    y={mid.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={10}
                    fontFamily="monospace"
                    fill={theme.palette.text.secondary}
                    style={{ userSelect: 'none' }}
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const color = getNodeColor(node.id);
            const isCurrent = node.id === currentNode;
            const label = node.label ?? String(node.id);
            const dist = distances?.[node.id];

            return (
              <g key={`n-${node.id}`}>
                {/* Glow ring for current */}
                {isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_R + 6}
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
                  fill={color}
                  stroke={isDark ? alpha('#fff', 0.15) : alpha('#000', 0.12)}
                  strokeWidth={1.5}
                  style={{ transition: 'fill 300ms ease' }}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fontWeight={700}
                  fontFamily="monospace"
                  fill={
                    visitedNodes.includes(node.id) || pathNodes.includes(node.id) || isCurrent
                      ? '#fff'
                      : theme.palette.text.primary
                  }
                  style={{ userSelect: 'none' }}
                >
                  {label}
                </text>
                {/* Distance label for Dijkstra */}
                {dist != null && (
                  <text
                    x={node.x}
                    y={node.y + NODE_R + 14}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="monospace"
                    fill={theme.palette.text.secondary}
                    style={{ userSelect: 'none' }}
                  >
                    d={dist === Infinity ? '∞' : dist}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
        {[
          { color: isDark ? theme.palette.grey[700] : theme.palette.grey[300], label: 'Unvisited' },
          { color: primary, label: 'Visited' },
          { color: warning, label: 'Current' },
          { color: success, label: 'Path' },
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
