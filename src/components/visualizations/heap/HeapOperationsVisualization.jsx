import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
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
import TreeNodeVisualization from '../types/TreeNodeVisualization';

// ─────────────────────────────────────────────────────────────────────────────
// HEAP TYPES
// ─────────────────────────────────────────────────────────────────────────────
const HEAP_TYPES = [
  {
    id: 'min',
    label: 'Min-Heap',
    description: 'Parent ≤ children — root is always the minimum element.',
    compare: (a, b) => a < b,
  },
  {
    id: 'max',
    label: 'Max-Heap',
    description: 'Parent ≥ children — root is always the maximum element.',
    compare: (a, b) => a > b,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEXITY
// ─────────────────────────────────────────────────────────────────────────────
const COMPLEXITY = {
  insert: {
    label: 'Insert',
    value: 'O(log n)',
    color: 'warning',
    note: 'Add at end, bubble-up to restore heap property — height = log n',
  },
  extract: {
    label: 'Extract Root',
    value: 'O(log n)',
    color: 'warning',
    note: 'Remove root, move last to root, sift-down — height = log n',
  },
  peek: {
    label: 'Peek',
    value: 'O(1)',
    color: 'success',
    note: 'Root is always min/max — direct read at index 0',
  },
  heapify: {
    label: 'Heapify',
    value: 'O(n)',
    color: 'warning',
    note: 'Build heap from array — sift-down from middle, not O(n log n)',
  },
  deleteAt: {
    label: 'Delete At',
    value: 'O(log n)',
    color: 'warning',
    note: 'Replace with last, remove last, bubble-up or sift-down',
  },
  updateKey: {
    label: 'Update Key',
    value: 'O(log n)',
    color: 'warning',
    note: 'Change value, then bubble-up or sift-down depending on direction',
  },
};

const ALL_OPS = Object.entries(COMPLEXITY).map(([id, m]) => ({ id, ...m }));

const COMPLEXITY_COLUMNS = [
  { key: 'label', label: 'Operation', width: 120 },
  { key: 'value', label: 'Time', width: 110, mono: true },
  { key: 'note', label: 'Why' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HEAP HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const parentIdx = (i) => Math.floor((i - 1) / 2);
const leftIdx = (i) => 2 * i + 1;
const rightIdx = (i) => 2 * i + 2;

function swap(arr, i, j) {
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP BUILDER — packages heap array into TreeNodeVisualization step shape
// comparingIds / highlightIds / currentId use array indexes as node ids
// ─────────────────────────────────────────────────────────────────────────────
function makeStep(heap, opts = {}) {
  return {
    nodes: heap, // level-order array — TreeNodeVisualization handles layout
    highlightIds: opts.highlightIds ?? [],
    currentId: opts.currentId ?? null,
    visitedIds: opts.visitedIds ?? [],
    comparingIds: opts.comparingIds ?? [],
    pathIds: opts.pathIds ?? [],
    label: opts.label ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

function buildInsertTrace(heap, value, isMin) {
  const steps = [];
  let h = [...heap, value];
  let i = h.length - 1;
  const label = isMin ? 'Min-Heap' : 'Max-Heap';
  const cmp = isMin ? (a, b) => a < b : (a, b) => a > b;

  steps.push({
    heapStep: makeStep(h, { highlightIds: [i], label }),
    phase: 'traverse',
    codeSnippet: `heap[${i}] = ${value}  // append at end (index ${i})`,
    whyExplanation: `Heap is stored as a complete binary tree in an array. New element always goes at index ${i} — the next open slot at the bottom-right. Parent is at ⌊(${i}-1)/2⌋ = ${parentIdx(i)}. Now bubble-up to restore the heap property.`,
    message: `${value} inserted at index [${i}]. Parent is heap[${parentIdx(i)}] = ${h[parentIdx(i)]}. Starting bubble-up.`,
  });

  while (i > 0) {
    const p = parentIdx(i);
    steps.push({
      heapStep: makeStep(h, { comparingIds: [i, p], label }),
      phase: 'traverse',
      codeSnippet: `heap[${i}]=${h[i]} vs heap[${p}]=${h[p]}  // compare with parent`,
      whyExplanation: `Compare child [${i}] with parent [${p}]. ${isMin ? 'Min' : 'Max'}-heap property: parent must be ${isMin ? '≤' : '≥'} child. If violated, swap. Parent index formula: ⌊(i-1)/2⌋ — this is why we can navigate up in O(1) per step.`,
      message: `Compare heap[${i}]=${h[i]} with parent heap[${p}]=${h[p]}. ${cmp(h[i], h[p]) ? 'Heap property violated — swap!' : 'Property satisfied — stop.'}`,
    });

    if (!cmp(h[i], h[p])) {
      steps.push({
        heapStep: makeStep(h, { highlightIds: [i], label }),
        phase: 'done',
        codeSnippet: `// heap[${i}]=${h[i]} satisfies property vs parent[${p}]=${h[p]}`,
        whyExplanation: `heap[${p}]=${h[p]} ${isMin ? '≤' : '≥'} heap[${i}]=${h[i]} — heap property holds. Bubble-up stops. We ascend at most log₂(n) levels = O(log n) total.`,
        message: `Property satisfied. Bubble-up complete at index [${i}]. Insert done in O(log n).`,
      });
      break;
    }

    h = swap(h, i, p);
    steps.push({
      heapStep: makeStep(h, { highlightIds: [p], currentId: p, label }),
      phase: 'traverse',
      codeSnippet: `swap(heap[${i}], heap[${p}])  // ${h[i]} ↔ ${h[p]}`,
      whyExplanation: `Swap child and parent. The element moves one level up. Tree height = ⌊log₂(n)⌋ — maximum swaps possible before reaching root. That's why insert is O(log n).`,
      message: `Swapped. ${value} now at [${p}]. ${p > 0 ? `Continue comparing with parent [${parentIdx(p)}].` : 'Reached root — done.'}`,
    });

    i = p;
    if (i === 0) {
      steps.push({
        heapStep: makeStep(h, { pathIds: [0], label }),
        phase: 'done',
        codeSnippet: `// index 0 is root — bubble-up complete`,
        whyExplanation: `Reached root — no parent to compare with. Insert complete. Visited ⌊log₂(n)⌋ levels — O(log n).`,
        message: `${value} bubbled up to root [0]. Insert complete — O(log n).`,
      });
    }
  }

  return { steps, finalHeap: h };
}

function buildExtractTrace(heap, isMin) {
  if (heap.length === 0) return { steps: [], finalHeap: [] };
  const label = isMin ? 'Min-Heap' : 'Max-Heap';
  const cmp = isMin ? (a, b) => a < b : (a, b) => a > b;
  const steps = [];
  const root = heap[0];
  let h = [...heap];

  steps.push({
    heapStep: makeStep(h, { highlightIds: [0], label }),
    phase: 'found',
    codeSnippet: `root = heap[0] = ${root}  // O(1) read`,
    whyExplanation: `Root at index 0 is always the ${isMin ? 'minimum' : 'maximum'} — heap property guarantees this. Reading it is O(1). Removing it requires restoring the heap — that costs O(log n).`,
    message: `Extracting root: ${root}. Now move last element to root and sift-down.`,
  });

  const last = h[h.length - 1];
  h = [last, ...h.slice(1, -1)];

  steps.push({
    heapStep: makeStep(h, { currentId: 0, label }),
    phase: 'traverse',
    codeSnippet: `heap[0] = heap[${heap.length - 1}] = ${last}; heap.pop()`,
    whyExplanation: `Move last element (${last}) to root position. Remove the last slot. The tree remains a complete binary tree — shape property preserved. Now sift-down to restore heap order.`,
    message: `${last} moved to root [0]. Removed last slot. Starting sift-down.`,
  });

  let i = 0;
  while (true) {
    const l = leftIdx(i);
    const r = rightIdx(i);
    let target = i;

    if (l < h.length && cmp(h[l], h[target])) target = l;
    if (r < h.length && cmp(h[r], h[target])) target = r;

    steps.push({
      heapStep: makeStep(h, {
        comparingIds: [i, ...(l < h.length ? [l] : []), ...(r < h.length ? [r] : [])],
        label,
      }),
      phase: 'traverse',
      codeSnippet: `compare heap[${i}]=${h[i]} with children${l < h.length ? ` L[${l}]=${h[l]}` : ''}${r < h.length ? ` R[${r}]=${h[r]}` : ''}`,
      whyExplanation: `Sift-down: find the ${isMin ? 'smallest' : 'largest'} among node and its children. Children are at 2i+1 and 2i+2 — O(1) index arithmetic. If a child violates the property, swap with it and continue down.`,
      message: `Comparing [${i}]=${h[i]} with children. ${target === i ? 'Both children satisfy property — stop.' : `Swap with [${target}]=${h[target]}.`}`,
    });

    if (target === i) {
      steps.push({
        heapStep: makeStep(h, { pathIds: [i], label }),
        phase: 'done',
        codeSnippet: `// heap property restored at [${i}]`,
        whyExplanation: `Both children satisfy the heap property — sift-down stops. Maximum depth is ⌊log₂(n)⌋ levels — O(log n) total. ${root} has been extracted.`,
        message: `Sift-down complete at [${i}]. Heap restored — O(log n). Extracted value: ${root}.`,
      });
      break;
    }

    h = swap(h, i, target);
    steps.push({
      heapStep: makeStep(h, { currentId: target, label }),
      phase: 'traverse',
      codeSnippet: `swap(heap[${i}]=${h[target]}, heap[${target}]=${h[i]})`,
      whyExplanation: `Swap with ${isMin ? 'smaller' : 'larger'} child [${target}]. Element moves one level down. Continue sifting until both children satisfy property or leaf is reached.`,
      message: `Swapped [${i}] ↔ [${target}]. Continuing sift-down from [${target}].`,
    });

    i = target;
  }

  return { steps, finalHeap: h, extractedValue: root };
}

function buildHeapifyTrace(arr, isMin) {
  const label = isMin ? 'Min-Heap' : 'Max-Heap';
  const cmp = isMin ? (a, b) => a < b : (a, b) => a > b;
  const steps = [];
  let h = [...arr];
  const startIdx = Math.floor(h.length / 2) - 1;

  steps.push({
    heapStep: makeStep(h, { label }),
    phase: 'instant',
    codeSnippet: `// heapify: sift-down from index ${startIdx} to 0`,
    whyExplanation: `Heapify builds a heap bottom-up. Leaf nodes (indices > ⌊n/2⌋-1) are already valid single-element heaps. We only need to sift-down internal nodes — starting at the last internal node: ⌊n/2⌋-1 = ${startIdx}. This is O(n), not O(n log n).`,
    message: `Starting heapify on [${arr.join(', ')}]. ${arr.length} elements. Sift-down from index [${startIdx}] up to [0].`,
  });

  for (let root = startIdx; root >= 0; root--) {
    steps.push({
      heapStep: makeStep(h, { currentId: root, label }),
      phase: 'traverse',
      codeSnippet: `siftDown(heap, i=${root}, n=${h.length})`,
      whyExplanation: `Sift-down index [${root}] = ${h[root]}. Nodes at lower levels have shorter sub-trees — most work is done on nodes near the bottom where sift paths are short. This asymmetry is why heapify is O(n), not O(n log n).`,
      message: `Sifting down index [${root}] = ${h[root]}. Checking children.`,
    });

    let i = root;
    while (true) {
      const l = leftIdx(i);
      const r = rightIdx(i);
      let target = i;
      if (l < h.length && cmp(h[l], h[target])) target = l;
      if (r < h.length && cmp(h[r], h[target])) target = r;
      if (target === i) break;

      steps.push({
        heapStep: makeStep(h, { comparingIds: [i, target], label }),
        phase: 'traverse',
        codeSnippet: `swap(heap[${i}]=${h[i]}, heap[${target}]=${h[target]})`,
        whyExplanation: `heap[${i}]=${h[i]} violates property with child [${target}]=${h[target]}. Swap and continue down.`,
        message: `Swap [${i}]=${h[i]} ↔ [${target}]=${h[target]}.`,
      });

      h = swap(h, i, target);
      i = target;
    }
  }

  steps.push({
    heapStep: makeStep(h, { pathIds: [0], label }),
    phase: 'done',
    codeSnippet: `// heapify complete — all ${h.length} nodes satisfy heap property`,
    whyExplanation: `Heapify complete. O(n) time — sum of sift-down heights across all levels converges to O(n) by the geometric series argument. Far better than inserting n elements one by one (O(n log n)).`,
    message: `Heap built: [${h.join(', ')}]. Root = ${h[0]} (${isMin ? 'minimum' : 'maximum'}). O(n) heapify done.`,
  });

  return { steps, finalHeap: h };
}

function buildDeleteAtTrace(heap, index, isMin) {
  if (index < 0 || index >= heap.length) return { steps: [], finalHeap: heap };
  const label = isMin ? 'Min-Heap' : 'Max-Heap';
  const cmp = isMin ? (a, b) => a < b : (a, b) => a > b;
  const steps = [];
  let h = [...heap];
  const deletedVal = h[index];
  const lastVal = h[h.length - 1];

  steps.push({
    heapStep: makeStep(h, { highlightIds: [index], label }),
    phase: 'found',
    codeSnippet: `// delete heap[${index}] = ${deletedVal}`,
    whyExplanation: `Delete at index ${index}: replace with last element (${lastVal}), remove last slot, then restore heap property. The replacement may need to bubble-up OR sift-down depending on whether it is smaller/larger than its parent/children.`,
    message: `Deleting heap[${index}] = ${deletedVal}. Replacing with last element ${lastVal}.`,
  });

  h[index] = lastVal;
  h = h.slice(0, -1);

  steps.push({
    heapStep: makeStep(h, { currentId: index, label }),
    phase: 'traverse',
    codeSnippet: `heap[${index}] = ${lastVal}; heap.pop()  // replace + shrink`,
    whyExplanation: `${lastVal} placed at [${index}]. Now check: should it bubble-up (${lastVal} better than parent?) or sift-down (${lastVal} worse than a child?). At most one direction is needed.`,
    message: `${lastVal} at [${index}]. Checking whether to bubble-up or sift-down.`,
  });

  // Try bubble-up first
  let i = index;
  let bubbled = false;
  while (i > 0 && h.length > 0) {
    const p = parentIdx(i);
    if (cmp(h[i], h[p])) {
      steps.push({
        heapStep: makeStep(h, { comparingIds: [i, p], label }),
        phase: 'traverse',
        codeSnippet: `heap[${i}]=${h[i]} better than parent[${p}]=${h[p]} — bubble-up`,
        whyExplanation: `${h[i]} satisfies property better than parent ${h[p]}. Bubble-up needed. This happens when the replacement value is "better" (smaller for min-heap, larger for max-heap) than its parent.`,
        message: `Bubble-up: swap [${i}]=${h[i]} with parent [${p}]=${h[p]}.`,
      });
      h = swap(h, i, p);
      i = p;
      bubbled = true;
    } else break;
  }

  // If no bubble-up, try sift-down
  if (!bubbled) {
    i = index;
    while (true) {
      const l = leftIdx(i);
      const r = rightIdx(i);
      let target = i;
      if (l < h.length && cmp(h[l], h[target])) target = l;
      if (r < h.length && cmp(h[r], h[target])) target = r;
      if (target === i) break;
      steps.push({
        heapStep: makeStep(h, { comparingIds: [i, target], label }),
        phase: 'traverse',
        codeSnippet: `heap[${i}]=${h[i]} worse than child[${target}]=${h[target]} — sift-down`,
        whyExplanation: `${h[i]} violates property with child ${h[target]}. Sift-down needed. This happens when the replacement value is "worse" than its children.`,
        message: `Sift-down: swap [${i}]=${h[i]} with child [${target}]=${h[target]}.`,
      });
      h = swap(h, i, target);
      i = target;
    }
  }

  steps.push({
    heapStep: makeStep(h, { pathIds: h.length > 0 ? [0] : [], label }),
    phase: 'done',
    codeSnippet: `// ${deletedVal} deleted. Heap restored.`,
    whyExplanation: `Deletion complete. Replace + single direction restore = O(log n) — at most one path from replaced node to leaf or root is traversed. Never both directions simultaneously.`,
    message: `${deletedVal} deleted. Heap restored: [${h.join(', ')}]. O(log n) done.`,
  });

  return { steps, finalHeap: h };
}

function buildUpdateKeyTrace(heap, index, newValue, isMin) {
  if (index < 0 || index >= heap.length) return { steps: [], finalHeap: heap };
  const label = isMin ? 'Min-Heap' : 'Max-Heap';
  const cmp = isMin ? (a, b) => a < b : (a, b) => a > b;
  const steps = [];
  const oldVal = heap[index];
  let h = [...heap];
  h[index] = newValue;

  const direction = cmp(newValue, oldVal) ? 'bubble-up' : 'sift-down';

  steps.push({
    heapStep: makeStep(h, { highlightIds: [index], label }),
    phase: 'instant',
    codeSnippet: `heap[${index}] = ${newValue}  // was ${oldVal}`,
    whyExplanation: `Update key at [${index}]: ${oldVal} → ${newValue}. Since ${newValue} is ${cmp(newValue, oldVal) ? `"better" (${isMin ? 'smaller' : 'larger'}) than before` : `"worse" (${isMin ? 'larger' : 'smaller'}) than before`}, we need to ${direction} to restore the heap property.`,
    message: `heap[${index}] updated: ${oldVal} → ${newValue}. Need to ${direction}.`,
  });

  let i = index;
  if (cmp(newValue, oldVal)) {
    // Bubble-up
    while (i > 0) {
      const p = parentIdx(i);
      if (!cmp(h[i], h[p])) break;
      steps.push({
        heapStep: makeStep(h, { comparingIds: [i, p], label }),
        phase: 'traverse',
        codeSnippet: `heap[${i}]=${h[i]} better than parent[${p}]=${h[p]} — swap`,
        whyExplanation: `New value ${h[i]} violates property with parent ${h[p]}. Swap and continue up. Each swap moves one level up — max ⌊log₂(n)⌋ swaps — O(log n).`,
        message: `Bubble-up: swap [${i}]=${h[i]} ↔ parent [${p}]=${h[p]}.`,
      });
      h = swap(h, i, p);
      i = p;
    }
  } else {
    // Sift-down
    while (true) {
      const l = leftIdx(i);
      const r = rightIdx(i);
      let target = i;
      if (l < h.length && cmp(h[l], h[target])) target = l;
      if (r < h.length && cmp(h[r], h[target])) target = r;
      if (target === i) break;
      steps.push({
        heapStep: makeStep(h, { comparingIds: [i, target], label }),
        phase: 'traverse',
        codeSnippet: `heap[${i}]=${h[i]} worse than child[${target}]=${h[target]} — swap`,
        whyExplanation: `New value ${h[i]} violates property with child ${h[target]}. Swap and continue down. Max ⌊log₂(n)⌋ swaps — O(log n).`,
        message: `Sift-down: swap [${i}]=${h[i]} ↔ child [${target}]=${h[target]}.`,
      });
      h = swap(h, i, target);
      i = target;
    }
  }

  steps.push({
    heapStep: makeStep(h, { pathIds: [0], label }),
    phase: 'done',
    codeSnippet: `// key updated ${oldVal} → ${newValue}. Heap restored.`,
    whyExplanation: `Update complete. A single up or down traversal restores the heap — O(log n). Decrease-key is used in Dijkstra's algorithm to relax edges efficiently.`,
    message: `Key updated: ${oldVal} → ${newValue}. Heap: [${h.join(', ')}]. O(log n) done.`,
  });

  return { steps, finalHeap: h };
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
          alignItems: 'flex-start',
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
// ARRAY INDEX STRIP — shows heap as array with index formulas
// ─────────────────────────────────────────────────────────────────────────────
function HeapArrayStrip({ heap, currentId, comparingIds }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primary = theme.palette.primary.main;
  const warning = theme.palette.warning.main;

  if (!heap.length) return null;

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.75 }}
      >
        Array representation — parent/child index formulas
      </Typography>
      <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
        <Box sx={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
          {heap.map((val, idx) => {
            const isCurrent = idx === currentId;
            const isComparing = comparingIds?.includes(idx);
            const color = isCurrent ? warning : isComparing ? primary : 'divider';
            return (
              <Box
                key={idx}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 38,
                    border: '1.5px solid',
                    borderColor: color,
                    borderRight: idx < heap.length - 1 ? '1px solid' : '1.5px solid',
                    borderRightColor: idx < heap.length - 1 ? 'divider' : color,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    bgcolor: isCurrent
                      ? alpha(warning, isDark ? 0.2 : 0.1)
                      : isComparing
                        ? alpha(primary, isDark ? 0.2 : 0.1)
                        : alpha(theme.palette.text.primary, 0.03),
                    color: isCurrent ? warning : isComparing ? primary : 'text.primary',
                    transition: 'all 220ms ease',
                  }}
                >
                  {val}
                </Box>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                >
                  [{idx}]
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.5rem',
                    color: 'text.disabled',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {idx === 0 ? 'root' : `p:${parentIdx(idx)}`}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ mt: 0.5, display: 'block', fontSize: '0.6rem' }}
      >
        parent(i)=⌊(i-1)/2⌋ · left(i)=2i+1 · right(i)=2i+2
      </Typography>
    </Box>
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
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 80 }}
            >
              {e.op}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              {e.detail}
            </Typography>
            <Chip
              label={`${e.steps} steps`}
              size="small"
              variant="outlined"
              sx={{ fontSize: 10, height: 18, fontFamily: 'monospace' }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEAP PANEL (per tab)
// ─────────────────────────────────────────────────────────────────────────────
function HeapPanel({ heapType, defaults }) {
  const isMin = heapType.id === 'min';
  const defaultHeap = useMemo(
    () =>
      Array.isArray(defaults?.initialHeap)
        ? defaults.initialHeap
        : isMin
          ? [1, 3, 5, 7, 9, 8]
          : [9, 7, 8, 3, 5, 1],
    [defaults?.initialHeap, isMin],
  );

  const [heap, setHeap] = useState(defaultHeap);
  const [preHeap, setPreHeap] = useState(defaultHeap);
  const [valueInput, setValueInput] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [message, setMessage] = useState(
    'Insert, Extract, Heapify, or modify keys — Why panel explains each step.',
  );
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [activeOp, setActiveOp] = useState(null);
  const [opLog, setOpLog] = useState([]);

  const [trace, setTrace] = useState([]);
  const [traceIdx, setTraceIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const currentStep = trace[traceIdx] ?? null;
  const isLastStep = traceIdx === trace.length - 1;
  const onDoneStep = currentStep?.phase === 'done';

  // Pre/post snapshot — show original heap during manual step replay
  const displayHeap = isPlaying || traceIdx < 0 || isLastStep || onDoneStep ? heap : preHeap;

  const displayStep =
    currentStep?.heapStep ?? makeStep(displayHeap, { label: isMin ? 'Min-Heap' : 'Max-Heap' });

  const parsedValue = Number.parseInt(valueInput, 10);
  const parsedIndex = Number.parseInt(indexInput, 10);

  const stopAnim = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const startAnim = useCallback(
    (t) => {
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
      }, 900);
    },
    [stopAnim],
  );

  const stepForward = () => setTraceIdx((i) => Math.min(i + 1, trace.length - 1));
  const stepBackward = () => setTraceIdx((i) => Math.max(i - 1, 0));

  const runOp = (op, finalHeap, t, desc, logDetail, severity = 'success') => {
    stopAnim();
    setActiveOp(op);
    setPreHeap([...heap]);
    setTrace(t);
    setTraceIdx(-1);
    setHeap(finalHeap);
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

  // ── Operations ────────────────────────────────────────────────────────────
  const handleInsert = () => {
    if (Number.isNaN(parsedValue)) return setError('Insert needs a valid integer value.');
    const { steps, finalHeap } = buildInsertTrace(heap, parsedValue, isMin);
    runOp(
      'insert',
      finalHeap,
      steps,
      `Inserted ${parsedValue}. Watch Why panel show bubble-up — O(log n).`,
      `inserted ${parsedValue}, size → ${finalHeap.length}`,
    );
    setValueInput('');
  };

  const handleExtract = () => {
    if (!heap.length) return setError(`Heap is empty — nothing to extract.`);
    const { steps, finalHeap, extractedValue } = buildExtractTrace(heap, isMin);
    runOp(
      'extract',
      finalHeap,
      steps,
      `Extracted ${isMin ? 'min' : 'max'} = ${extractedValue}. Watch Why panel show sift-down — O(log n).`,
      `extracted ${extractedValue} (${isMin ? 'min' : 'max'}), size → ${finalHeap.length}`,
    );
  };

  const handlePeek = () => {
    if (!heap.length) return setError('Heap is empty.');
    setActiveOp('peek');
    const root = heap[0];
    setMessage(
      `Peek → ${isMin ? 'min' : 'max'} = ${root} at index [0]. O(1) — root is always the ${isMin ? 'minimum' : 'maximum'}.`,
    );
    setMessageSeverity('success');
    const t = [
      {
        heapStep: makeStep(heap, { highlightIds: [0], label: isMin ? 'Min-Heap' : 'Max-Heap' }),
        phase: 'found',
        codeSnippet: `return heap[0]  // ${root} — always the ${isMin ? 'min' : 'max'}`,
        whyExplanation: `The heap property guarantees index 0 is always the ${isMin ? 'minimum' : 'maximum'}. Direct read — O(1). No traversal needed.`,
        message: `heap[0] = ${root}. Root is always the ${isMin ? 'minimum' : 'maximum'} by the heap invariant. O(1).`,
      },
    ];
    stopAnim();
    setTrace(t);
    setTraceIdx(-1);
    setOpLog((prev) => [{ op: 'Peek', detail: `root = ${root}`, steps: 1 }, ...prev].slice(0, 8));
    startAnim(t);
  };

  const handleHeapify = () => {
    const raw = valueInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    const input =
      raw.length >= 2
        ? raw
        : heap.length >= 2
          ? [...heap].sort(() => Math.random() - 0.5)
          : [5, 3, 8, 1, 9, 2, 7];
    const { steps, finalHeap } = buildHeapifyTrace(input, isMin);
    runOp(
      'heapify',
      finalHeap,
      steps,
      `Heapify [${input.join(', ')}]. Watch Why panel show O(n) bottom-up build.`,
      `heapify [${input.slice(0, 4).join(',')}${input.length > 4 ? '...' : ''}] → [${finalHeap.slice(0, 3).join(',')}...]`,
      'info',
    );
    setValueInput('');
  };

  const handleDeleteAt = () => {
    if (Number.isNaN(parsedIndex)) return setError('Delete At needs a valid index.');
    if (parsedIndex < 0 || parsedIndex >= heap.length)
      return setError(`Index out of bounds. Valid range: 0–${heap.length - 1}.`);
    const { steps, finalHeap } = buildDeleteAtTrace(heap, parsedIndex, isMin);
    runOp(
      'deleteAt',
      finalHeap,
      steps,
      `Deleted heap[${parsedIndex}] = ${heap[parsedIndex]}. Watch Why panel show replace + restore — O(log n).`,
      `deleted [${parsedIndex}]=${heap[parsedIndex]}, size → ${finalHeap.length}`,
    );
    setIndexInput('');
  };

  const handleUpdateKey = () => {
    if (Number.isNaN(parsedIndex) || Number.isNaN(parsedValue))
      return setError('Update Key needs both Index and Value.');
    if (parsedIndex < 0 || parsedIndex >= heap.length)
      return setError(`Index out of bounds. Valid range: 0–${heap.length - 1}.`);
    const { steps, finalHeap } = buildUpdateKeyTrace(heap, parsedIndex, parsedValue, isMin);
    runOp(
      'updateKey',
      finalHeap,
      steps,
      `Updated heap[${parsedIndex}]: ${heap[parsedIndex]} → ${parsedValue}. Watch Why panel — O(log n).`,
      `heap[${parsedIndex}]: ${heap[parsedIndex]} → ${parsedValue}`,
    );
    setValueInput('');
    setIndexInput('');
  };

  const handleReset = () => {
    stopAnim();
    setActiveOp(null);
    setOpLog([]);
    setHeap(defaultHeap);
    setPreHeap(defaultHeap);
    setTrace([]);
    setTraceIdx(-1);
    setValueInput('');
    setIndexInput('');
    setMessage('Reset. Insert, Extract, Heapify, or modify keys — Why panel explains each step.');
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
          label="Value"
          size="small"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder={activeOp === 'heapify' ? 'e.g. 5,3,8,1' : 'e.g. 4'}
          sx={{ maxWidth: 200 }}
        />
        <TextField
          label="Index"
          size="small"
          value={indexInput}
          onChange={(e) => setIndexInput(e.target.value)}
          placeholder="e.g. 2"
          sx={{ maxWidth: 120 }}
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
        <Tooltip title="O(log n) — append + bubble-up (uses Value)">
          <Button
            size="small"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleInsert}
          >
            Insert
          </Button>
        </Tooltip>
        <Tooltip title={`O(log n) — remove ${isMin ? 'min' : 'max'} root + sift-down`}>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<RemoveRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleExtract}
          >
            Extract {isMin ? 'Min' : 'Max'}
          </Button>
        </Tooltip>
        <Tooltip title="O(1) — read root without removing">
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handlePeek}
          >
            Peek
          </Button>
        </Tooltip>
        <Tooltip title="O(n) — build heap from array (uses Value as comma-separated list, or shuffles current)">
          <Button
            size="small"
            variant="outlined"
            color="info"
            startIcon={<BuildRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleHeapify}
          >
            Heapify
          </Button>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="O(log n) — replace with last + restore (uses Index)">
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<RemoveRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleDeleteAt}
          >
            Delete At
          </Button>
        </Tooltip>
        <Tooltip title="O(log n) — change key + bubble-up or sift-down (uses Index + Value)">
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<AddRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleUpdateKey}
          >
            Update Key
          </Button>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Reset to default heap">
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

      {/* Tree viz + Why panel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <TreeNodeVisualization steps={[displayStep]} stepIndex={0} mode="heap" />
        <WhyPanel traceStep={currentStep} />
      </Box>

      {/* Array strip */}
      <HeapArrayStrip
        heap={displayHeap}
        currentId={displayStep?.currentId ?? null}
        comparingIds={displayStep?.comparingIds ?? []}
      />

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1.5 }}>
        <StatCard label="Size" value={heap.length} color="info" />
        <StatCard
          label={isMin ? 'Min' : 'Max'}
          value={heap.length ? heap[0] : '∅'}
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
        caption="Active operation highlighted. Green = O(1), yellow = O(log n) or O(n)."
        sx={{ mt: 0, mb: 0 }}
      />

      {/* Op log */}
      <OperationLog entries={opLog} />

      <Typography variant="caption" color="text.secondary">
        Heap stored as level-order array: parent(i)=⌊(i-1)/2⌋, left(i)=2i+1, right(i)=2i+2. Insert
        and Extract are O(log n) — tree height. Heapify is O(n) — bottom-up sift-down.
      </Typography>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function HeapOperationsVisualization({ defaults = {} }) {
  const [activeTab, setActiveTab] = useState(0);
  const heapType = HEAP_TYPES[activeTab];

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
            {HEAP_TYPES.map((t) => (
              <Tab
                key={t.id}
                label={t.label}
                sx={{ textTransform: 'none', minHeight: 40, py: 0.5 }}
              />
            ))}
          </Tabs>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
            {heapType.description}
          </Typography>
        </Box>
        <HeapPanel key={heapType.id} heapType={heapType} defaults={defaults} />
      </Stack>
    </Paper>
  );
}
