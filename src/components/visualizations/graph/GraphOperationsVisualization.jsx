import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Alert, StatCard } from '../../shared';
import BasicTable from '../../shared/BasicTable';
import GraphVisualization from '../types/GraphVisualization';

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH TYPES
// ─────────────────────────────────────────────────────────────────────────────
const GRAPH_TYPES = [
  {
    id: 'undirected',
    label: 'Undirected',
    description: 'Edges have no direction — A–B means both A→B and B→A.',
  },
  {
    id: 'directed',
    label: 'Directed (Digraph)',
    description: 'Edges have direction — A→B does not imply B→A.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEXITY
// ─────────────────────────────────────────────────────────────────────────────
const COMPLEXITY = {
  addVertex: {
    label: 'Add Vertex',
    value: 'O(1)',
    color: 'success',
    note: 'Insert key into adjacency list map — hash table write',
  },
  removeVertex: {
    label: 'Remove Vertex',
    value: 'O(V+E)',
    color: 'warning',
    note: 'Delete vertex + remove all edges referencing it from every list',
  },
  addEdge: {
    label: 'Add Edge',
    value: 'O(1)',
    color: 'success',
    note: 'Append to adjacency list of both endpoints',
  },
  removeEdge: {
    label: 'Remove Edge',
    value: 'O(degree)',
    color: 'warning',
    note: 'Scan neighbor list of source to find and remove target',
  },
  hasEdge: {
    label: 'Has Edge',
    value: 'O(degree)',
    color: 'warning',
    note: 'Scan neighbor list of source for target — no O(1) lookup',
  },
  neighbors: {
    label: 'Get Neighbors',
    value: 'O(1)',
    color: 'success',
    note: 'Return adjacency list entry directly — already stored',
  },
  bfs: {
    label: 'BFS',
    value: 'O(V + E)',
    color: 'warning',
    note: 'Every vertex enqueued once, every edge examined once',
  },
  dfs: {
    label: 'DFS',
    value: 'O(V + E)',
    color: 'warning',
    note: 'Every vertex visited once, every edge examined once',
  },
};

const ALL_OPS = Object.entries(COMPLEXITY).map(([id, m]) => ({ id, ...m }));

const COMPLEXITY_COLUMNS = [
  { key: 'label', label: 'Operation', width: 130 },
  { key: 'value', label: 'Time', width: 120, mono: true },
  { key: 'note', label: 'Why' },
];

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT HELPER — position vertices in a circle
// ─────────────────────────────────────────────────────────────────────────────
const SVG_CX = 300,
  SVG_CY = 170,
  SVG_R = 130;

function circleLayout(vertices) {
  const n = vertices.length;
  return vertices.map((v, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id: v,
      label: String(v),
      x: Math.round(SVG_CX + SVG_R * Math.cos(angle)),
      y: Math.round(SVG_CY + SVG_R * Math.sin(angle)),
    };
  });
}

function buildStep(vertices, adjList, directed, opts = {}) {
  return {
    nodes: circleLayout(vertices),
    edges: Object.entries(adjList).flatMap(([from, neighbors]) =>
      neighbors.map((to) => ({ from, to, directed })),
    ),
    directed,
    visitedNodes: opts.visitedNodes ?? [],
    currentNode: opts.currentNode ?? null,
    highlightEdges: opts.highlightEdges ?? [],
    pathNodes: opts.pathNodes ?? [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

// BFS — returns array of trace steps
function buildBFSTrace(vertices, adjList, directed, startVertex) {
  const steps = [];
  const visited = new Set();
  const queue = [startVertex];
  visited.add(startVertex);
  const visitedArr = [startVertex];
  const highlightEdges = [];

  steps.push({
    graphStep: buildStep(vertices, adjList, directed, {
      visitedNodes: [startVertex],
      currentNode: startVertex,
    }),
    phase: 'traverse',
    codeSnippet: `queue = [${startVertex}]; visited = {${startVertex}}`,
    whyExplanation: `BFS uses a queue (FIFO). Start vertex ${startVertex} is enqueued and marked visited immediately to prevent revisiting. Each vertex is enqueued at most once — that's the V part of O(V+E).`,
    message: `BFS start: enqueue vertex ${startVertex}. Mark it visited.`,
  });

  while (queue.length > 0) {
    const curr = queue.shift();

    steps.push({
      graphStep: buildStep(vertices, adjList, directed, {
        visitedNodes: [...visitedArr],
        currentNode: curr,
        highlightEdges: [...highlightEdges],
      }),
      phase: 'traverse',
      codeSnippet: `curr = queue.dequeue()  // curr = ${curr}`,
      whyExplanation: `Dequeue ${curr}. Now examine all its neighbors. Each edge (${curr}, neighbor) is examined exactly once — that's the E part of O(V+E).`,
      message: `Processing vertex ${curr}. Checking its neighbors: [${(adjList[curr] || []).join(', ') || 'none'}].`,
    });

    for (const neighbor of adjList[curr] || []) {
      const edgePair = [curr, neighbor];
      steps.push({
        graphStep: buildStep(vertices, adjList, directed, {
          visitedNodes: [...visitedArr],
          currentNode: curr,
          highlightEdges: [...highlightEdges, edgePair],
        }),
        phase: visited.has(neighbor) ? 'found' : 'traverse',
        codeSnippet: visited.has(neighbor)
          ? `// neighbor ${neighbor} already visited — skip`
          : `queue.enqueue(${neighbor}); visited.add(${neighbor})`,
        whyExplanation: visited.has(neighbor)
          ? `${neighbor} already in visited set — skip to avoid cycles. The visited check is O(1) via hash set.`
          : `${neighbor} not yet visited. Enqueue it and mark visited. It will be processed in FIFO order. We examine this edge (${curr}→${neighbor}) exactly once.`,
        message: visited.has(neighbor)
          ? `Edge ${curr}→${neighbor}: neighbor ${neighbor} already visited — skip.`
          : `Edge ${curr}→${neighbor}: enqueue ${neighbor}, mark visited.`,
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        visitedArr.push(neighbor);
        queue.push(neighbor);
        highlightEdges.push(edgePair);
      }
    }
  }

  steps.push({
    graphStep: buildStep(vertices, adjList, directed, {
      visitedNodes: [...visitedArr],
      currentNode: null,
      highlightEdges: [...highlightEdges],
    }),
    phase: 'done',
    codeSnippet: `// BFS complete. queue is empty.`,
    whyExplanation: `BFS visited ${visitedArr.length} vertex(vertices) and examined ${highlightEdges.length} edge(s). Total work = O(V + E) — each vertex dequeued once, each edge inspected once.`,
    message: `BFS complete. Visited order: [${visitedArr.join(' → ')}]. Total: ${visitedArr.length} vertices, ${highlightEdges.length} edges examined — O(V+E).`,
  });

  return steps;
}

// DFS — returns array of trace steps
function buildDFSTrace(vertices, adjList, directed, startVertex) {
  const steps = [];
  const visited = new Set();
  const visitedArr = [];
  const highlightEdges = [];

  steps.push({
    graphStep: buildStep(vertices, adjList, directed, {
      visitedNodes: [],
      currentNode: startVertex,
    }),
    phase: 'traverse',
    codeSnippet: `dfs(${startVertex}); // call stack begins`,
    whyExplanation: `DFS uses the call stack (recursion) or an explicit stack. We go as deep as possible before backtracking. Starting at ${startVertex}.`,
    message: `DFS start at vertex ${startVertex}. Going deep before backtracking.`,
  });

  function dfs(v) {
    visited.add(v);
    visitedArr.push(v);

    steps.push({
      graphStep: buildStep(vertices, adjList, directed, {
        visitedNodes: [...visitedArr],
        currentNode: v,
        highlightEdges: [...highlightEdges],
      }),
      phase: 'traverse',
      codeSnippet: `visit(${v}); visited.add(${v})`,
      whyExplanation: `Mark ${v} as visited — O(1) hash set insert. Now examine all neighbors of ${v}. Each edge from ${v} is examined once across the entire DFS — that's the E part of O(V+E).`,
      message: `Visit vertex ${v}. Neighbors: [${(adjList[v] || []).join(', ') || 'none'}].`,
    });

    for (const neighbor of adjList[v] || []) {
      const edgePair = [v, neighbor];
      if (!visited.has(neighbor)) {
        highlightEdges.push(edgePair);
        steps.push({
          graphStep: buildStep(vertices, adjList, directed, {
            visitedNodes: [...visitedArr],
            currentNode: v,
            highlightEdges: [...highlightEdges],
          }),
          phase: 'traverse',
          codeSnippet: `dfs(${neighbor})  // recurse deeper`,
          whyExplanation: `${neighbor} not yet visited. Recurse into it — go deeper. The call stack grows by 1 frame. Max stack depth = longest DFS path = O(V) space.`,
          message: `Edge ${v}→${neighbor}: ${neighbor} unvisited — recurse deeper.`,
        });
        dfs(neighbor);
        steps.push({
          graphStep: buildStep(vertices, adjList, directed, {
            visitedNodes: [...visitedArr],
            currentNode: v,
            highlightEdges: [...highlightEdges],
          }),
          phase: 'traverse',
          codeSnippet: `// returned from dfs(${neighbor}) — backtrack to ${v}`,
          whyExplanation: `Backtracking — all paths from ${neighbor} exhausted. Return to ${v} and continue with its remaining neighbors.`,
          message: `Backtrack to ${v} from ${neighbor}. Checking remaining neighbors of ${v}.`,
        });
      } else {
        steps.push({
          graphStep: buildStep(vertices, adjList, directed, {
            visitedNodes: [...visitedArr],
            currentNode: v,
            highlightEdges: [...highlightEdges],
          }),
          phase: 'found',
          codeSnippet: `// neighbor ${neighbor} already visited — skip`,
          whyExplanation: `${neighbor} already visited — skip. Without this check, DFS would loop forever in cyclic graphs.`,
          message: `Edge ${v}→${neighbor}: ${neighbor} already visited — skip (cycle prevention).`,
        });
      }
    }
  }

  dfs(startVertex);

  steps.push({
    graphStep: buildStep(vertices, adjList, directed, {
      visitedNodes: [...visitedArr],
      currentNode: null,
      highlightEdges: [...highlightEdges],
    }),
    phase: 'done',
    codeSnippet: `// DFS complete. call stack unwound.`,
    whyExplanation: `DFS visited ${visitedArr.length} vertex(vertices) and traversed ${highlightEdges.length} edge(s). Each vertex visited once, each edge examined once — O(V+E).`,
    message: `DFS complete. Visited order: [${visitedArr.join(' → ')}]. ${visitedArr.length} vertices, ${highlightEdges.length} edges — O(V+E).`,
  });

  return steps;
}

// Structural op traces (add/remove vertex/edge, hasEdge, neighbors)
function buildStructureTrace(op, vertices, adjList, directed, fromV, toV) {
  const steps = [];

  switch (op) {
    case 'addVertex':
      steps.push({
        graphStep: buildStep(vertices, adjList, directed, { currentNode: fromV }),
        phase: 'instant',
        codeSnippet: `adjList["${fromV}"] = []  // new entry in hash map`,
        whyExplanation: `Adding a vertex = inserting a new key with an empty neighbor list into the adjacency list (hash map). Hash map insert is O(1) amortized — no existing entries touched.`,
        message: `Vertex "${fromV}" added. adjList["${fromV}"] = []. O(1) hash map insert.`,
      });
      steps.push({
        graphStep: buildStep([...vertices, fromV], { ...adjList, [fromV]: [] }, directed, {
          currentNode: fromV,
          visitedNodes: [fromV],
        }),
        phase: 'done',
        codeSnippet: `// graph now has ${vertices.length + 1} vertices`,
        whyExplanation: `Done. Vertex "${fromV}" is isolated (no edges yet). Adding edges requires separate addEdge calls.`,
        message: `Vertex "${fromV}" added successfully. Graph: ${vertices.length + 1} vertices.`,
      });
      break;

    case 'removeVertex': {
      const affectedEdges = Object.entries(adjList)
        .filter(([k]) => k !== fromV)
        .filter(([, neighbors]) => neighbors.includes(fromV));

      steps.push({
        graphStep: buildStep(vertices, adjList, directed, { currentNode: fromV }),
        phase: 'traverse',
        codeSnippet: `delete adjList["${fromV}"]  // step 1: remove vertex entry`,
        whyExplanation: `Removing a vertex requires two passes: (1) delete its own adjacency list entry O(1), (2) scan ALL other vertices' lists to remove references to "${fromV}" — O(V+E) total.`,
        message: `Step 1: removing vertex "${fromV}" entry from adjacency list.`,
      });

      for (const [v] of affectedEdges) {
        steps.push({
          graphStep: buildStep(vertices, adjList, directed, {
            currentNode: v,
            highlightEdges: [[v, fromV]],
          }),
          phase: 'traverse',
          codeSnippet: `adjList["${v}"].filter(n => n !== "${fromV}")`,
          whyExplanation: `Scanning vertex "${v}"'s neighbor list to remove "${fromV}". This is unavoidable — adjacency lists don't have back-references. Must check every list.`,
          message: `Cleaning up: removing "${fromV}" from neighbors of "${v}".`,
        });
      }

      const newAdj = Object.fromEntries(
        Object.entries(adjList)
          .filter(([k]) => k !== fromV)
          .map(([k, ns]) => [k, ns.filter((n) => n !== fromV)]),
      );
      const newVertices = vertices.filter((v) => v !== fromV);
      steps.push({
        graphStep: buildStep(newVertices, newAdj, directed),
        phase: 'done',
        codeSnippet: `// vertex "${fromV}" fully removed`,
        whyExplanation: `Removed "${fromV}" and ${affectedEdges.length} edge reference(s). Scanned ${affectedEdges.length} adjacency list(s) — O(V+E) total work.`,
        message: `Vertex "${fromV}" removed. Cleaned ${affectedEdges.length} edge reference(s) — O(V+E).`,
      });
      break;
    }

    case 'addEdge':
      steps.push({
        graphStep: buildStep(vertices, adjList, directed, {
          currentNode: fromV,
          highlightEdges: [[fromV, toV]],
        }),
        phase: 'instant',
        codeSnippet: `adjList["${fromV}"].push("${toV}")${!directed ? `\nadjList["${toV}"].push("${fromV}")` : ''}`,
        whyExplanation: `Add edge: append "${toV}" to "${fromV}"'s neighbor list${!directed ? ` and "${fromV}" to "${toV}"'s list (undirected)` : ''}. Array push is O(1) amortized. No other lists touched.`,
        message: `Edge ${fromV}${directed ? '→' : '–'}${toV} added. Append to adjacency list${!directed ? 's (both directions)' : ''}. O(1).`,
      });
      steps.push({
        graphStep: buildStep(
          vertices,
          {
            ...adjList,
            [fromV]: [...(adjList[fromV] || []), toV],
            ...(!directed ? { [toV]: [...(adjList[toV] || []), fromV] } : {}),
          },
          directed,
          { highlightEdges: [[fromV, toV]], visitedNodes: [fromV, toV] },
        ),
        phase: 'done',
        codeSnippet: `// edge added. adjList["${fromV}"] = [${[...(adjList[fromV] || []), toV].join(', ')}]`,
        whyExplanation: `Done. Adjacency list updated in O(1). The edge is now reflected in both endpoints' lists${directed ? '' : ' (undirected)'}. No scanning required.`,
        message: `Edge ${fromV}${directed ? '→' : '–'}${toV} added successfully. O(1) complete.`,
      });
      break;

    case 'removeEdge': {
      const neighbors = adjList[fromV] || [];
      steps.push({
        graphStep: buildStep(vertices, adjList, directed, {
          currentNode: fromV,
          highlightEdges: [[fromV, toV]],
        }),
        phase: 'traverse',
        codeSnippet: `adjList["${fromV}"].indexOf("${toV}")  // scan neighbor list`,
        whyExplanation: `Remove edge: must scan "${fromV}"'s neighbor list to find "${toV}". Adjacency lists don't support O(1) lookup by value — must scan linearly. O(degree("${fromV}")).`,
        message: `Scanning "${fromV}"'s neighbors [${neighbors.join(', ')}] to find "${toV}".`,
      });

      for (let i = 0; i < neighbors.length; i++) {
        const isTarget = neighbors[i] === toV;
        steps.push({
          graphStep: buildStep(vertices, adjList, directed, {
            currentNode: fromV,
            highlightEdges: [[fromV, neighbors[i]]],
            visitedNodes: isTarget ? [fromV, toV] : [],
          }),
          phase: isTarget ? 'found' : 'traverse',
          codeSnippet: isTarget
            ? `neighbors[${i}] === "${toV}"  // found — splice out`
            : `neighbors[${i}] = "${neighbors[i]}" ≠ "${toV}"; i++`,
          whyExplanation: isTarget
            ? `Found "${toV}" at position ${i}. Splice it out. O(degree) scan complete after ${i + 1} check(s).`
            : `"${neighbors[i]}" ≠ "${toV}". Advance. This linear scan is why removeEdge is O(degree), not O(1).`,
          message: isTarget
            ? `Found "${toV}" at index ${i}. Removing it from "${fromV}"'s list.`
            : `neighbors[${i}] = "${neighbors[i]}" ≠ "${toV}". Keep scanning.`,
        });
        if (isTarget) break;
      }

      const newAdj = {
        ...adjList,
        [fromV]: (adjList[fromV] || []).filter((n) => n !== toV),
        ...(!directed ? { [toV]: (adjList[toV] || []).filter((n) => n !== fromV) } : {}),
      };
      steps.push({
        graphStep: buildStep(vertices, newAdj, directed),
        phase: 'done',
        codeSnippet: `// edge ${fromV}${directed ? '→' : '–'}${toV} removed`,
        whyExplanation: `Edge removed after scanning ${neighbors.length} neighbor(s). O(degree) — proportional to how many edges "${fromV}" has.`,
        message: `Edge ${fromV}${directed ? '→' : '–'}${toV} removed. Scanned ${neighbors.length} neighbor(s) — O(degree).`,
      });
      break;
    }

    case 'hasEdge': {
      const neighbors = adjList[fromV] || [];
      steps.push({
        graphStep: buildStep(vertices, adjList, directed, {
          currentNode: fromV,
          highlightEdges: [[fromV, toV]],
        }),
        phase: 'traverse',
        codeSnippet: `adjList["${fromV}"].includes("${toV}")  // linear scan`,
        whyExplanation: `Has Edge check scans "${fromV}"'s neighbor list for "${toV}". If using an adjacency matrix instead, this would be O(1) — but matrix costs O(V²) space. Adjacency list tradeoff: O(degree) edge check, O(V+E) space.`,
        message: `Scanning "${fromV}"'s neighbors [${neighbors.join(', ')}] for "${toV}".`,
      });

      let found = false;
      for (let i = 0; i < neighbors.length; i++) {
        const isTarget = neighbors[i] === toV;
        steps.push({
          graphStep: buildStep(vertices, adjList, directed, {
            currentNode: fromV,
            highlightEdges: [[fromV, neighbors[i]]],
            visitedNodes: isTarget ? [fromV, toV] : [],
          }),
          phase: isTarget ? 'found' : 'traverse',
          codeSnippet: isTarget
            ? `neighbors[${i}] === "${toV}"  // edge EXISTS`
            : `neighbors[${i}] = "${neighbors[i]}" ≠ "${toV}"; i++`,
          whyExplanation: isTarget
            ? `Found "${toV}" at position ${i} — edge exists. Scanned ${i + 1} of ${neighbors.length} neighbors. Adjacency matrix would have answered this in O(1).`
            : `"${neighbors[i]}" ≠ "${toV}". This is why hasEdge is O(degree) in adjacency list representation.`,
          message: isTarget
            ? `"${toV}" found at index ${i} — edge EXISTS. O(degree) scan.`
            : `neighbors[${i}] = "${neighbors[i]}" ≠ "${toV}". Keep scanning.`,
        });
        if (isTarget) {
          found = true;
          break;
        }
      }

      if (!found) {
        steps.push({
          graphStep: buildStep(vertices, adjList, directed, { currentNode: fromV }),
          phase: 'done',
          codeSnippet: `// "${toV}" not in adjList["${fromV}"] — edge does NOT exist`,
          whyExplanation: `Scanned all ${neighbors.length} neighbors — "${toV}" not found. Edge does not exist. O(degree) confirmed.`,
          message: `Edge ${fromV}${directed ? '→' : '–'}${toV} does NOT exist. Scanned all ${neighbors.length} neighbor(s).`,
        });
      }
      break;
    }

    case 'neighbors': {
      const neighbors = adjList[fromV] || [];
      steps.push({
        graphStep: buildStep(vertices, adjList, directed, {
          currentNode: fromV,
          highlightEdges: neighbors.map((n) => [fromV, n]),
          visitedNodes: [fromV, ...neighbors],
        }),
        phase: 'instant',
        codeSnippet: `return adjList["${fromV}"]  // [${neighbors.join(', ')}]`,
        whyExplanation: `Get neighbors = direct adjacency list lookup. The neighbor list is already stored — just return it. O(1) hash map lookup. No traversal needed.`,
        message: `Neighbors of "${fromV}": [${neighbors.join(', ') || 'none'}]. O(1) direct lookup.`,
      });
      steps.push({
        graphStep: buildStep(vertices, adjList, directed, {
          currentNode: fromV,
          highlightEdges: neighbors.map((n) => [fromV, n]),
          visitedNodes: [fromV, ...neighbors],
        }),
        phase: 'done',
        codeSnippet: `// ${neighbors.length} neighbor(s) returned`,
        whyExplanation: `${neighbors.length} neighbor(s) returned in O(1). Compare: adjacency matrix getNeighbors requires scanning an entire row — O(V).`,
        message: `"${fromV}" has ${neighbors.length} neighbor(s): [${neighbors.join(', ') || 'none'}]. O(1) done.`,
      });
      break;
    }

    default:
      break;
  }

  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADJACENCY LIST DISPLAY
// ─────────────────────────────────────────────────────────────────────────────
function AdjacencyListPanel({ vertices, adjList, activeVertex }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!vertices.length) return null;

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.75 }}
      >
        Adjacency List
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
        {vertices.map((v) => {
          const isActive = v === activeVertex;
          const neighbors = adjList[v] || [];
          return (
            <Box
              key={v}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                bgcolor: isActive
                  ? alpha(theme.palette.primary.main, isDark ? 0.15 : 0.07)
                  : 'transparent',
                transition: 'all 200ms ease',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  minWidth: 20,
                  color: isActive ? 'primary.main' : 'text.primary',
                }}
              >
                {v}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                →
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {neighbors.length === 0 ? (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: 'monospace' }}
                  >
                    ∅
                  </Typography>
                ) : (
                  neighbors.map((n) => (
                    <Chip
                      key={n}
                      label={n}
                      size="small"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        height: 18,
                        bgcolor: isActive
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.text.primary, 0.06),
                      }}
                    />
                  ))
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY PANEL
// ─────────────────────────────────────────────────────────────────────────────
function WhyPanel({ traceStep }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  if (!traceStep) return null;

  const phaseColor =
    {
      instant: theme.palette.success.main,
      found: theme.palette.success.main,
      done: theme.palette.success.main,
      traverse: theme.palette.primary.main,
    }[traceStep.phase] ?? theme.palette.primary.main;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={traceStep.phase?.toUpperCase()}
          size="small"
          sx={{
            bgcolor: alpha(phaseColor, 0.15),
            color: phaseColor,
            fontWeight: 700,
            fontSize: 10,
            height: 20,
            fontFamily: 'monospace',
          }}
        />
      </Box>

      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 1,
          bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.04),
          border: '1px solid',
          borderColor: alpha(phaseColor, 0.3),
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: phaseColor,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          whiteSpace: 'pre-line',
        }}
      >
        <Box component="span" sx={{ color: 'text.disabled', userSelect: 'none', flexShrink: 0 }}>
          ▶
        </Box>
        {traceStep.codeSnippet}
      </Box>

      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.65 }}>
        {traceStep.message}
      </Typography>

      <Box
        sx={{
          px: 1.5,
          py: 1.25,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.warning.main, isDark ? 0.08 : 0.05),
          border: '1px solid',
          borderColor: alpha(theme.palette.warning.main, 0.25),
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'warning.main',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.6rem',
            display: 'block',
            mb: 0.5,
          }}
        >
          Why this step must happen
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {traceStep.whyExplanation}
        </Typography>
      </Box>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPERATION LOG
// ─────────────────────────────────────────────────────────────────────────────
function OperationLog({ entries }) {
  if (!entries.length) return null;
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Operation log
      </Typography>
      <Stack sx={{ gap: 0.5, mt: 0.5, maxHeight: 100, overflowY: 'auto' }}>
        {entries.map((e, i) => (
          <Box
            key={i}
            sx={(theme) => ({
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              px: 1.25,
              py: 0.5,
              borderRadius: 1,
              bgcolor:
                i === 0
                  ? alpha(theme.palette.primary.main, 0.04)
                  : alpha(theme.palette.text.primary, 0.03),
            })}
          >
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 90 }}
            >
              {e.op}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              {e.detail}
            </Typography>
            {e.steps > 0 && (
              <Chip
                label={`${e.steps} steps`}
                size="small"
                variant="outlined"
                sx={{ fontSize: 10, height: 18, fontFamily: 'monospace' }}
              />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH PANEL (per tab)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_VERTICES_U = ['A', 'B', 'C', 'D', 'E'];
const DEFAULT_ADJ_U = { A: ['B', 'C'], B: ['A', 'D'], C: ['A', 'E'], D: ['B'], E: ['C'] };
const DEFAULT_ADJ_D = { A: ['B', 'C'], B: ['D'], C: ['E'], D: [], E: [] };

function GraphPanel({ graphType, defaults }) {
  const directed = graphType.id === 'directed';

  const defaultVertices = useMemo(
    () =>
      Array.isArray(defaults?.initialVertices) ? defaults.initialVertices : DEFAULT_VERTICES_U,
    [defaults?.initialVertices],
  );

  const defaultAdj = useMemo(
    () => defaults?.initialAdj ?? (directed ? DEFAULT_ADJ_D : DEFAULT_ADJ_U),
    [defaults?.initialAdj, directed],
  );

  const [vertices, setVertices] = useState(defaultVertices);
  const [adjList, setAdjList] = useState(defaultAdj);
  const [vertexInput, setVertexInput] = useState('');
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [message, setMessage] = useState(
    'Add/remove vertices and edges, check neighbors, or run BFS/DFS traversal.',
  );
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [activeOp, setActiveOp] = useState(null);
  const [opLog, setOpLog] = useState([]);

  // Trace animation
  const [trace, setTrace] = useState([]);
  const [traceIdx, setTraceIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Current displayed graph state
  const currentTraceStep = trace[traceIdx] ?? null;
  const displayGraphStep = currentTraceStep?.graphStep ?? buildStep(vertices, adjList, directed);
  const activeVertex = displayGraphStep?.currentNode ?? null;

  const stopAnim = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const startAnim = useCallback(
    (t, speed = 900) => {
      if (!t.length) return;
      stopAnim();
      setTraceIdx(0);
      setIsPlaying(true);
      let idx = 0;
      intervalRef.current = setInterval(() => {
        idx++;
        if (idx >= t.length) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          setTraceIdx(t.length - 1);
          return;
        }
        setTraceIdx(idx);
      }, speed);
    },
    [stopAnim],
  );

  const stepForward = () => setTraceIdx((i) => Math.min(i + 1, trace.length - 1));
  const stepBackward = () => setTraceIdx((i) => Math.max(i - 1, 0));

  const runTrace = (op, t, newVertices, newAdj, desc, logDetail, severity = 'success') => {
    stopAnim();
    setActiveOp(op);
    setTrace(t);
    setTraceIdx(-1);
    if (newVertices) setVertices(newVertices);
    if (newAdj) setAdjList(newAdj);
    setMessage(desc);
    setMessageSeverity(severity);
    setOpLog((prev) =>
      [{ op: COMPLEXITY[op]?.label ?? op, detail: logDetail, steps: t.length }, ...prev].slice(
        0,
        8,
      ),
    );
    startAnim(t);
  };

  const setError = (msg) => {
    setMessage(msg);
    setMessageSeverity('error');
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const vertexExists = (v) => vertices.includes(v);
  const edgeExists = (f, t) => (adjList[f] || []).includes(t);

  // ── Operations ────────────────────────────────────────────────────────────
  const handleAddVertex = () => {
    const v = vertexInput.trim().toUpperCase();
    if (!v) return setError('Enter a vertex name.');
    if (vertexExists(v)) return setError(`Vertex "${v}" already exists.`);
    const newV = [...vertices, v];
    const newAdj = { ...adjList, [v]: [] };
    const t = buildStructureTrace('addVertex', vertices, adjList, directed, v, null);
    runTrace(
      'addVertex',
      t,
      newV,
      newAdj,
      `Vertex "${v}" added. O(1) — hash map insert.`,
      `added vertex "${v}"`,
    );
    setVertexInput('');
  };

  const handleRemoveVertex = () => {
    const v = vertexInput.trim().toUpperCase();
    if (!v) return setError('Enter a vertex name to remove.');
    if (!vertexExists(v)) return setError(`Vertex "${v}" does not exist.`);
    const newV = vertices.filter((x) => x !== v);
    const newAdj = Object.fromEntries(
      Object.entries(adjList)
        .filter(([k]) => k !== v)
        .map(([k, ns]) => [k, ns.filter((n) => n !== v)]),
    );
    const t = buildStructureTrace('removeVertex', vertices, adjList, directed, v, null);
    runTrace(
      'removeVertex',
      t,
      newV,
      newAdj,
      `Vertex "${v}" removed. O(V+E) — must clean all edge references.`,
      `removed vertex "${v}"`,
    );
    setVertexInput('');
  };

  const handleAddEdge = () => {
    const f = fromInput.trim().toUpperCase();
    const t = toInput.trim().toUpperCase();
    if (!f || !t) return setError('Enter both From and To vertices.');
    if (!vertexExists(f)) return setError(`Vertex "${f}" does not exist.`);
    if (!vertexExists(t)) return setError(`Vertex "${t}" does not exist.`);
    if (f === t) return setError('Self-loops not supported in this visualization.');
    if (edgeExists(f, t)) return setError(`Edge ${f}${directed ? '→' : '–'}${t} already exists.`);
    const newAdj = {
      ...adjList,
      [f]: [...(adjList[f] || []), t],
      ...(!directed ? { [t]: [...(adjList[t] || []), f] } : {}),
    };
    const trace = buildStructureTrace('addEdge', vertices, adjList, directed, f, t);
    runTrace(
      'addEdge',
      trace,
      null,
      newAdj,
      `Edge ${f}${directed ? '→' : '–'}${t} added. O(1) — list append.`,
      `added edge ${f}${directed ? '→' : '–'}${t}`,
    );
  };

  const handleRemoveEdge = () => {
    const f = fromInput.trim().toUpperCase();
    const t = toInput.trim().toUpperCase();
    if (!f || !t) return setError('Enter both From and To vertices.');
    if (!edgeExists(f, t)) return setError(`Edge ${f}${directed ? '→' : '–'}${t} does not exist.`);
    const newAdj = {
      ...adjList,
      [f]: (adjList[f] || []).filter((n) => n !== t),
      ...(!directed ? { [t]: (adjList[t] || []).filter((n) => n !== f) } : {}),
    };
    const trace = buildStructureTrace('removeEdge', vertices, adjList, directed, f, t);
    runTrace(
      'removeEdge',
      trace,
      null,
      newAdj,
      `Edge ${f}${directed ? '→' : '–'}${t} removed. O(degree) — list scan.`,
      `removed edge ${f}${directed ? '→' : '–'}${t}`,
    );
  };

  const handleHasEdge = () => {
    const f = fromInput.trim().toUpperCase();
    const t = toInput.trim().toUpperCase();
    if (!f || !t) return setError('Enter both From and To vertices.');
    if (!vertexExists(f)) return setError(`Vertex "${f}" does not exist.`);
    const exists = edgeExists(f, t);
    const trace = buildStructureTrace('hasEdge', vertices, adjList, directed, f, t);
    runTrace(
      'hasEdge',
      trace,
      null,
      null,
      `Has edge ${f}${directed ? '→' : '–'}${t}? → ${exists ? 'YES' : 'NO'}. Watch Why panel show O(degree) scan.`,
      `hasEdge(${f},${t}) → ${exists}`,
      exists ? 'success' : 'warning',
    );
  };

  const handleNeighbors = () => {
    const v = fromInput.trim().toUpperCase();
    if (!v) return setError('Enter a vertex in the From field.');
    if (!vertexExists(v)) return setError(`Vertex "${v}" does not exist.`);
    const trace = buildStructureTrace('neighbors', vertices, adjList, directed, v, null);
    runTrace(
      'neighbors',
      trace,
      null,
      null,
      `Neighbors of "${v}": [${(adjList[v] || []).join(', ') || 'none'}]. O(1) — direct lookup.`,
      `neighbors("${v}") → [${(adjList[v] || []).join(', ')}]`,
    );
    setFromInput(v);
  };

  const handleBFS = () => {
    const start = fromInput.trim().toUpperCase() || vertices[0];
    if (!vertexExists(start))
      return setError(`Start vertex "${start}" does not exist. Enter it in the From field.`);
    const t = buildBFSTrace(vertices, adjList, directed, start);
    runTrace(
      'bfs',
      t,
      null,
      null,
      `BFS from "${start}". Watch Why panel animate each queue step — O(V+E).`,
      `BFS from "${start}"`,
      'info',
    );
  };

  const handleDFS = () => {
    const start = fromInput.trim().toUpperCase() || vertices[0];
    if (!vertexExists(start))
      return setError(`Start vertex "${start}" does not exist. Enter it in the From field.`);
    const t = buildDFSTrace(vertices, adjList, directed, start);
    runTrace(
      'dfs',
      t,
      null,
      null,
      `DFS from "${start}". Watch Why panel animate each recursive call — O(V+E).`,
      `DFS from "${start}"`,
      'info',
    );
  };

  const handleReset = () => {
    stopAnim();
    setActiveOp(null);
    setOpLog([]);
    setVertices(defaultVertices);
    setAdjList(defaultAdj);
    setTrace([]);
    setTraceIdx(-1);
    setVertexInput('');
    setFromInput('');
    setToInput('');
    setMessage('Reset. Add/remove vertices and edges, or run BFS/DFS traversal.');
    setMessageSeverity('info');
  };

  const progress =
    trace.length > 1 ? (Math.max(0, traceIdx) / (trace.length - 1)) * 100 : traceIdx >= 0 ? 100 : 0;

  const complexityRows = ALL_OPS.map((op) => {
    const isActive = activeOp === op.id;
    return {
      id: op.id,
      highlight: isActive,
      label: op.label,
      value: isActive
        ? { value: op.value, tone: op.color === 'success' ? 'good' : 'worse' }
        : op.value,
      note: isActive ? { value: op.note, tone: 'highlight' } : op.note,
    };
  });

  return (
    <Stack sx={{ gap: 2 }}>
      {/* Inputs */}
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.25}>
        <TextField
          label="Vertex"
          size="small"
          value={vertexInput}
          onChange={(e) => setVertexInput(e.target.value.toUpperCase())}
          placeholder="e.g. F"
          sx={{ maxWidth: 120 }}
          inputProps={{ maxLength: 3 }}
        />
        <TextField
          label="From"
          size="small"
          value={fromInput}
          onChange={(e) => setFromInput(e.target.value.toUpperCase())}
          placeholder="e.g. A"
          sx={{ maxWidth: 120 }}
          inputProps={{ maxLength: 3 }}
        />
        <TextField
          label="To"
          size="small"
          value={toInput}
          onChange={(e) => setToInput(e.target.value.toUpperCase())}
          placeholder="e.g. B"
          sx={{ maxWidth: 120 }}
          inputProps={{ maxLength: 3 }}
        />
      </Stack>

      {/* Buttons */}
      <Stack
        sx={(theme) => ({
          gap: 1.5,
          flexDirection: 'row',
          flexWrap: 'wrap',
          p: 1,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.text.primary, 0.02),
        })}
      >
        {/* Vertex ops */}
        <Tooltip title="O(1) — add vertex (uses Vertex field)">
          <Button
            size="small"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleAddVertex}
          >
            Add Vertex
          </Button>
        </Tooltip>
        <Tooltip title="O(V+E) — remove vertex + all its edges (uses Vertex field)">
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<RemoveRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleRemoveVertex}
          >
            Remove Vertex
          </Button>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Edge ops */}
        <Tooltip title="O(1) — add edge (uses From→To)">
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<AddRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleAddEdge}
          >
            Add Edge
          </Button>
        </Tooltip>
        <Tooltip title="O(degree) — remove edge (uses From→To)">
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<RemoveRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleRemoveEdge}
          >
            Remove Edge
          </Button>
        </Tooltip>
        <Tooltip title="O(degree) — check if edge exists (uses From→To)">
          <Button
            size="small"
            variant="outlined"
            startIcon={<SearchRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleHasEdge}
          >
            Has Edge
          </Button>
        </Tooltip>
        <Tooltip title="O(1) — get neighbor list (uses From field)">
          <Button
            size="small"
            variant="outlined"
            color="info"
            sx={{ textTransform: 'none' }}
            onClick={handleNeighbors}
          >
            Neighbors
          </Button>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Traversals */}
        <Tooltip title="O(V+E) — breadth-first traversal (start = From field or first vertex)">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<AccountTreeRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleBFS}
          >
            BFS
          </Button>
        </Tooltip>
        <Tooltip title="O(V+E) — depth-first traversal (start = From field or first vertex)">
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<AccountTreeRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleDFS}
          >
            DFS
          </Button>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Reset to default graph">
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<RestartAltRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Tooltip>
      </Stack>

      {/* Message */}
      <Alert severity={messageSeverity}>{message}</Alert>

      {/* Animation controls */}
      {trace.length > 0 && (
        <Paper
          variant="outlined"
          sx={(theme) => ({
            p: 1.25,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant={isPlaying ? 'contained' : 'outlined'}
              color={isPlaying ? 'error' : 'primary'}
              startIcon={isPlaying ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />}
              onClick={() => (isPlaying ? stopAnim() : startAnim(trace))}
              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
            >
              {isPlaying ? 'Pause' : traceIdx >= 0 ? 'Replay' : 'Play'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={stepBackward}
              disabled={traceIdx <= 0 || isPlaying}
              startIcon={<SkipPreviousRoundedIcon />}
              sx={{ textTransform: 'none', minWidth: 0, px: 1 }}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={stepForward}
              disabled={traceIdx >= trace.length - 1 || isPlaying}
              startIcon={<SkipNextRoundedIcon />}
              sx={{ textTransform: 'none', minWidth: 0, px: 1 }}
            />
            <Box sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
              {traceIdx >= 0 ? `${traceIdx + 1} / ${trace.length}` : `0 / ${trace.length}`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1, borderRadius: 1, height: 3 }}
          />
        </Paper>
      )}

      {/* Graph viz + Why panel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <GraphVisualization steps={[displayGraphStep]} stepIndex={0} mode={graphType.id} />
        <WhyPanel traceStep={currentTraceStep} />
      </Box>

      {/* Adjacency list */}
      <AdjacencyListPanel vertices={vertices} adjList={adjList} activeVertex={activeVertex} />

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1.5 }}>
        <StatCard label="Vertices" value={vertices.length} color="info" />
        <StatCard
          label="Edges"
          value={Object.values(adjList).reduce((s, ns) => s + ns.length, 0) / (directed ? 1 : 2)}
          color="primary"
        />
        <StatCard
          label="Last op"
          value={activeOp ? COMPLEXITY[activeOp]?.label : '—'}
          color="secondary"
        />
        <StatCard
          label="Complexity"
          value={activeOp ? COMPLEXITY[activeOp]?.value : '—'}
          color={activeOp ? COMPLEXITY[activeOp]?.color : 'secondary'}
        />
      </Box>

      {/* Complexity table */}
      <BasicTable
        columns={COMPLEXITY_COLUMNS}
        rows={complexityRows}
        dense
        striped
        hover={false}
        tableVariant="comparison"
        caption="Active operation highlighted. Green = O(1), yellow = O(degree) or O(V+E)."
        sx={{ mt: 0, mb: 0 }}
      />

      {/* Op log */}
      <OperationLog entries={opLog} />

      <Typography variant="caption" color="text.secondary">
        Graph uses adjacency list representation: O(V+E) space, O(1) add-vertex/add-edge, O(degree)
        edge-check. BFS and DFS are both O(V+E) — every vertex and edge visited exactly once.
      </Typography>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function GraphOperationsVisualization({ defaults = {} }) {
  const [activeTab, setActiveTab] = useState(0);
  const graphType = GRAPH_TYPES[activeTab];

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Stack sx={{ gap: 2 }}>
        <Box>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
          >
            {GRAPH_TYPES.map((t) => (
              <Tab
                key={t.id}
                label={t.label}
                sx={{ textTransform: 'none', minHeight: 40, py: 0.5 }}
              />
            ))}
          </Tabs>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
            {graphType.description}
          </Typography>
        </Box>
        <GraphPanel key={graphType.id} graphType={graphType} defaults={defaults} />
      </Stack>
    </Paper>
  );
}
