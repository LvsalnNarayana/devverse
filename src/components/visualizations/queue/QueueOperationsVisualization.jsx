import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LayersClearRoundedIcon from '@mui/icons-material/LayersClearRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
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

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE TYPES
// ─────────────────────────────────────────────────────────────────────────────
const QUEUE_TYPES = [
  {
    id: 'simple',
    label: 'Simple Queue',
    description: 'FIFO — elements enqueued at rear, dequeued from front.',
  },
  {
    id: 'circular',
    label: 'Circular Queue',
    description: 'Fixed-size ring buffer — rear wraps around to reuse freed slots.',
  },
  {
    id: 'deque',
    label: 'Deque',
    description: 'Double-ended queue — push/pop at both front and rear in O(1).',
  },
  {
    id: 'priority',
    label: 'Priority Queue',
    description: 'Elements dequeued by priority (min heap), not arrival order.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BASE_ADDR = 0x3000;
const ELEM_SIZE = 4;
const addr = (i) => `0x${(BASE_ADDR + Math.max(0, i) * ELEM_SIZE).toString(16).toUpperCase()}`;

// ── Base complexity (all queue types) ────────────────────────────────────────
const BASE_COMPLEXITY = {
  enqueue: {
    label: 'Enqueue',
    value: 'O(1)',
    color: 'success',
    note: 'Add at rear — rear pointer advances, no shifting',
  },
  dequeue: {
    label: 'Dequeue',
    value: 'O(1)',
    color: 'success',
    note: 'Remove from front — front pointer advances, no shifting',
  },
  peek: {
    label: 'Peek Front',
    value: 'O(1)',
    color: 'success',
    note: 'Read front without removing — direct pointer access',
  },
  isEmpty: {
    label: 'isEmpty',
    value: 'O(1)',
    color: 'success',
    note: 'Check front === rear (or size === 0)',
  },
  search: {
    label: 'Search',
    value: 'O(n)',
    color: 'warning',
    note: 'No index — must scan front to rear',
  },
  clear: {
    label: 'Clear',
    value: 'O(n)',
    color: 'warning',
    note: 'Each element must be individually dequeued',
  },
};

// ── Extra ops for Deque ───────────────────────────────────────────────────────
const DEQUE_EXTRA_COMPLEXITY = {
  pushFront: {
    label: 'Push Front',
    value: 'O(1)',
    color: 'success',
    note: 'Add at front — shift front pointer back, no element movement',
  },
  popRear: {
    label: 'Pop Rear',
    value: 'O(1)',
    color: 'success',
    note: 'Remove from rear — rear pointer moves back, no shifting',
  },
  peekRear: {
    label: 'Peek Rear',
    value: 'O(1)',
    color: 'success',
    note: 'Read rear without removing — direct rear pointer access',
  },
};

// ── Extra ops for Priority Queue ──────────────────────────────────────────────
const PRIORITY_EXTRA_COMPLEXITY = {
  enqueue: {
    label: 'Enqueue',
    value: 'O(log n)',
    color: 'warning',
    note: 'Heap insert — element bubbles up to maintain heap property',
  },
  dequeue: {
    label: 'Dequeue',
    value: 'O(log n)',
    color: 'warning',
    note: 'Extract min — sift-down restores heap property',
  },
  peek: {
    label: 'Peek Min',
    value: 'O(1)',
    color: 'success',
    note: 'Root is always the minimum — direct read, no traversal',
  },
};

const COMPLEXITY_COLUMNS = [
  { key: 'label', label: 'Operation', width: 110 },
  { key: 'value', label: 'Time', width: 110, mono: true },
  { key: 'note', label: 'Why' },
];

// Returns the merged complexity map for a given queue type
function getComplexity(typeId) {
  if (typeId === 'deque') return { ...BASE_COMPLEXITY, ...DEQUE_EXTRA_COMPLEXITY };
  if (typeId === 'priority') return { ...BASE_COMPLEXITY, ...PRIORITY_EXTRA_COMPLEXITY };
  return BASE_COMPLEXITY;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildTrace(op, values, parsedValue, typeId) {
  const n = values.length;
  const front = 0;
  const rear = n - 1;
  const steps = [];

  switch (op) {
    // ── O(1): ENQUEUE / PUSH REAR ────────────────────────────────────────────
    case 'enqueue':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `rear = ${n}; address = base + ${n} × ${ELEM_SIZE}  →  ${addr(n)}`,
        whyExplanation:
          typeId === 'priority'
            ? `Priority queue enqueue writes at the next heap slot [${n}], then bubbles up. The write itself is O(1) but restoring heap order takes O(log n) comparisons.`
            : `Queue tracks a rear pointer. New slot is always rear+1 = [${n}] at ${addr(n)}. One arithmetic operation — no traversal, no shifting. O(1).`,
        message: `New slot at rear [${n}] = ${addr(n)}. rear pointer moves ${rear} → ${n}.`,
      });
      if (typeId === 'priority' && n > 0) {
        // Simulate bubble-up steps
        let i = n;
        while (i > 0) {
          const parent = Math.floor((i - 1) / 2);
          steps.push({
            phase: 'traverse',
            highlightIndex: parent,
            visitedIndexes: [],
            dimIndexes: [],
            pointerLabel: `parent[${parent}]`,
            codeSnippet: `heap[${i}] < heap[${parent}]? bubble up`,
            whyExplanation: `Heap property: every parent ≤ children. New element at [${i}] must compare with parent at [${parent}]. If smaller, swap. This is O(log n) — tree height.`,
            message: `Bubble-up: comparing new element with parent at [${parent}]. Swapping if new element is smaller.`,
          });
          i = parent;
          if (i === 0) break;
        }
      }
      steps.push({
        phase: 'done',
        highlightIndex: n,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `REAR ← ${parsedValue}`,
        codeSnippet:
          typeId === 'priority'
            ? `heap[${n}] = ${parsedValue}; bubbleUp(${n})`
            : `queue[${n}] = ${parsedValue}; rear++`,
        whyExplanation:
          typeId === 'priority'
            ? `${parsedValue} inserted at heap[${n}], bubbled up to correct position. Total: O(log n).`
            : `Write ${parsedValue} at ${addr(n)}, increment rear. Two operations — always two. O(1).`,
        message: `${parsedValue} enqueued at [${n}]. ${typeId === 'priority' ? 'Heap property restored. O(log n).' : `rear = ${n}. O(1).`}`,
      });
      break;

    // ── O(1): DEQUEUE / POP FRONT ────────────────────────────────────────────
    case 'dequeue':
      steps.push({
        phase: 'found',
        highlightIndex: front,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: typeId === 'priority' ? `MIN = ${values[0]}` : `FRONT = ${values[front]}`,
        codeSnippet: `val = queue[front]  // queue[0] at ${addr(0)} = ${values[front]}`,
        whyExplanation:
          typeId === 'priority'
            ? `Min-heap root is always the minimum — direct read at [0]. But after removal we must sift-down the replacement to restore heap order. That costs O(log n).`
            : `front pointer directly holds index 0 (${addr(0)}). No traversal — front is always the next element to serve. FIFO guarantee.`,
        message: `front = 0. Reading queue[0] = ${values[front]} at ${addr(0)} directly.`,
      });
      if (typeId === 'priority' && n > 1) {
        steps.push({
          phase: 'shift',
          highlightIndex: 0,
          visitedIndexes: [],
          dimIndexes: [],
          pointerLabel: 'sift-down',
          codeSnippet: `heap[0] = heap[${n - 1}]; heap.pop(); siftDown(0)`,
          whyExplanation: `Last element moved to root to fill the gap. Sift-down restores heap property by repeatedly swapping with the smaller child. O(log n) swaps.`,
          message: `Last element moved to root. Sifting down to restore min-heap property — O(log n).`,
        });
      }
      steps.push({
        phase: 'done',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet:
          typeId === 'priority' ? '// heap property restored' : `front++  // front: 0 → 1`,
        whyExplanation:
          typeId === 'priority'
            ? `Heap restored. ${values[0]} removed. Total cost: O(log n) for sift-down.`
            : `front advanced 0 → 1. ${values[front]} dequeued. No shifts — O(1).`,
        message:
          typeId === 'priority'
            ? `${values[0]} dequeued (minimum). Heap restored — O(log n).`
            : `front advanced: 0 → 1. ${values[front]} dequeued. O(1).`,
      });
      break;

    // ── O(1): PEEK FRONT ─────────────────────────────────────────────────────
    case 'peek':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `address = base + front × ${ELEM_SIZE}  →  ${addr(front)}`,
        whyExplanation:
          typeId === 'priority'
            ? `Min-heap always keeps the minimum at root [0]. Peek is a single read — O(1).`
            : `Peek reads the front element. Address = base + 0 × ${ELEM_SIZE} = ${addr(0)}. front pointer gives this instantly.`,
        message: `front = 0. Address: ${addr(0)}. One computation — no traversal.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: front,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: typeId === 'priority' ? `MIN = ${values[0]}` : `FRONT = ${values[0]}`,
        codeSnippet: `return queue[0]  // ${values[0]}, front unchanged`,
        whyExplanation: `Direct read at ${addr(0)}. front stays at 0 — queue is unchanged. One memory read — O(1).`,
        message: `Peek → ${values[0]} at ${addr(0)}. Queue untouched. O(1).`,
      });
      break;

    // ── O(1): IS EMPTY ───────────────────────────────────────────────────────
    case 'isEmpty':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `return size === 0  // size is currently ${n}`,
        whyExplanation: `isEmpty is a single integer comparison — size === 0. No elements examined. Always O(1) regardless of queue size.`,
        message: `size = ${n}. size === 0 → ${n === 0}. Queue is ${n === 0 ? 'empty' : 'not empty'}.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: n > 0 ? 0 : null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: n > 0 ? `front=0` : null,
        codeSnippet: `// result: ${n === 0 ? 'true — queue empty' : `false — ${n} element(s) present`}`,
        whyExplanation: `Whether the queue holds 0 or 1,000,000 elements, isEmpty takes exactly one comparison — O(1).`,
        message: `isEmpty → ${n === 0}. ${n === 0 ? 'Queue is empty.' : `${n} element(s) in queue.`}`,
      });
      break;

    // ── O(1): PUSH FRONT (deque only) ────────────────────────────────────────
    case 'pushFront':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `front--; address = base + 0 × ${ELEM_SIZE}  →  ${addr(0)} (new slot)`,
        whyExplanation: `Deque uses a doubly-linked list or circular buffer. Push-front just moves the front pointer back one slot and writes — no elements shift. O(1).`,
        message: `front pointer moves back. Writing ${parsedValue} at new front slot [0].`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: 0,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `FRONT ← ${parsedValue}`,
        codeSnippet: `deque[front] = ${parsedValue}; front--`,
        whyExplanation: `${parsedValue} written at new front. Existing elements not touched — pointers do the work. O(1) regardless of deque size.`,
        message: `${parsedValue} pushed to front [0]. All existing elements shifted right in index view. O(1).`,
      });
      break;

    // ── O(1): POP REAR (deque only) ──────────────────────────────────────────
    case 'popRear':
      steps.push({
        phase: 'found',
        highlightIndex: rear,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `REAR = ${values[rear]}`,
        codeSnippet: `val = deque[rear]  // deque[${rear}] at ${addr(rear)} = ${values[rear]}`,
        whyExplanation: `rear pointer directly holds the index of the last element (${addr(rear)}). No traversal — we know exactly where it is. This is why deque pop-rear is O(1).`,
        message: `rear = ${rear}. Reading deque[${rear}] = ${values[rear]} at ${addr(rear)} directly.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `rear--  // rear: ${rear} → ${rear - 1}`,
        whyExplanation: `rear pointer decremented. ${values[rear]} is now unreachable — just a pointer move, no memory clearing or shifting. O(1).`,
        message: `rear decremented: ${rear} → ${rear - 1}. ${values[rear]} removed from rear. O(1).`,
      });
      break;

    // ── O(1): PEEK REAR (deque only) ─────────────────────────────────────────
    case 'peekRear':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `address = base + ${rear} × ${ELEM_SIZE}  →  ${addr(rear)}`,
        whyExplanation: `rear pointer gives the index of the last element directly. address = base + ${rear} × ${ELEM_SIZE} = ${addr(rear)}. One arithmetic op — O(1).`,
        message: `rear = ${rear}. Address: ${addr(rear)}. Direct access — no traversal.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: rear,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `REAR = ${values[rear]}`,
        codeSnippet: `return deque[${rear}]  // ${values[rear]}, rear unchanged`,
        whyExplanation: `Direct read at ${addr(rear)}. rear stays at ${rear} — deque unchanged. O(1).`,
        message: `Peek rear → ${values[rear]} at ${addr(rear)}. Deque untouched. O(1).`,
      });
      break;

    // ── O(n): SEARCH ─────────────────────────────────────────────────────────
    case 'search': {
      // Intro step — explain WHY we must scan
      steps.push({
        phase: 'traverse',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `i = front  // begin scan at [0], looking for ${parsedValue}`,
        whyExplanation: `No value-to-index mapping exists. Even with contiguous memory we cannot compute which slot holds ${parsedValue} without a hash or sorted order. Must scan front → rear sequentially.`,
        message: `Starting search for ${parsedValue}. No shortcut — must check every element from front [0] to rear [${n - 1}].`,
      });
      const visited = [];
      let foundAt = -1;
      for (let i = 0; i < n; i++) {
        const isMatch = values[i] === parsedValue;
        steps.push({
          phase: isMatch ? 'found' : 'traverse',
          highlightIndex: i,
          visitedIndexes: [...visited],
          dimIndexes: [],
          pointerLabel: isMatch ? 'FOUND' : `scan: ${values[i]}`,
          codeSnippet: isMatch
            ? `queue[${i}] === ${parsedValue}  // match at ${addr(i)}`
            : `queue[${i}] = ${values[i]} ≠ ${parsedValue}; i++`,
          whyExplanation: isMatch
            ? `Found ${parsedValue} at [${i}] (${addr(i)}) after ${i + 1} comparison(s). Worst case: last position or absent — O(n).`
            : i + 1 < n
              ? `queue[${i}] = ${values[i]} ≠ ${parsedValue}. No shortcut — must check next element at ${addr(i + 1)}.`
              : `queue[${i}] = ${values[i]} ≠ ${parsedValue}. This was the last element — search exhausted.`,
          message: isMatch
            ? `queue[${i}] === ${parsedValue} at ${addr(i)} — found after ${i + 1} comparison(s)!`
            : `queue[${i}] = ${values[i]} ≠ ${parsedValue}. i++ → ${i + 1 < n ? `check [${i + 1}]` : 'end of queue'}.`,
        });
        if (isMatch) {
          foundAt = i;
          break;
        }
        visited.push(i);
      }
      if (foundAt === -1) {
        steps.push({
          phase: 'done',
          highlightIndex: null,
          visitedIndexes: Array.from({ length: n }, (_, k) => k),
          dimIndexes: [],
          pointerLabel: null,
          codeSnippet: `i > rear  // exhausted queue`,
          whyExplanation: `Checked all ${n} elements front to rear — ${parsedValue} not present. O(n) worst case confirmed: every element visited.`,
          message: `${parsedValue} not found after scanning all ${n} element(s) — O(n).`,
        });
      }
      break;
    }

    // ── O(n): CLEAR ──────────────────────────────────────────────────────────
    case 'clear': {
      steps.push({
        phase: 'traverse',
        highlightIndex: 0,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `front=0`,
        codeSnippet: `while (!isEmpty()) dequeue()  // ${n} dequeue(s) needed`,
        whyExplanation: `Clear removes every element individually from front. With ${n} element(s), that is ${n} dequeue(s) — O(n) linear in queue size.`,
        message: `Starting clear. ${n} element(s) to remove. Dequeuing from front [0]...`,
      });
      const dimSoFar = [];
      for (let i = 0; i < n; i++) {
        dimSoFar.push(i);
        steps.push({
          phase: i === n - 1 ? 'done' : 'shift',
          highlightIndex: i < n - 1 ? i + 1 : null,
          visitedIndexes: [],
          dimIndexes: [...dimSoFar],
          pointerLabel: i < n - 1 ? `front=${i + 1}` : null,
          codeSnippet: `dequeue()  // removed queue[${i}] = ${values[i]}; front → ${i + 1}`,
          whyExplanation:
            i < n - 1
              ? `Dequeued queue[${i}] = ${values[i]}. front advanced to ${i + 1}. ${n - i - 1} element(s) remaining.`
              : `Last element dequeued. Queue empty. Total: ${n} dequeue(s) = O(n).`,
          message:
            i < n - 1
              ? `Dequeued ${values[i]} (${i + 1} of ${n}). ${n - i - 1} remaining.`
              : `Dequeued ${values[n - 1]} (${n} of ${n}). Queue empty — O(n) done.`,
        });
      }
      break;
    }

    default:
      break;
  }

  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY PANEL
// ─────────────────────────────────────────────────────────────────────────────
function WhyPanel({ step, values, typeId }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  if (!step) return null;

  const phaseColor =
    {
      instant: theme.palette.success.main,
      found: theme.palette.success.main,
      done: theme.palette.success.main,
      shift: theme.palette.warning.main,
      traverse: theme.palette.primary.main,
    }[step.phase] ?? theme.palette.primary.main;

  const n = values.length;
  const rear = n - 1;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={step.phase?.toUpperCase()}
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
        {step.pointerLabel && (
          <Chip
            label={step.pointerLabel}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontSize: 10,
              height: 20,
              borderColor: phaseColor,
              color: phaseColor,
            }}
          />
        )}
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
        }}
      >
        <Box component="span" sx={{ color: 'text.disabled', userSelect: 'none' }}>
          ▶
        </Box>
        {step.codeSnippet}
      </Box>

      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.65 }}>
        {step.message}
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
          {step.whyExplanation}
        </Typography>
      </Box>

      {/* Memory strip */}
      {n > 0 && (
        <Box>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: '0.6rem',
              display: 'block',
              mb: 0.5,
            }}
          >
            {typeId === 'deque'
              ? 'Deque memory — both ends accessible'
              : 'Queue memory — front and rear pointers'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {values.map((_, i) => {
              const isFront = i === 0;
              const isRear = i === rear;
              const isHighlight = i === step.highlightIndex;
              const isVisited = step.visitedIndexes?.includes(i);
              const isDimmed = step.dimIndexes?.includes(i);
              const c = isHighlight
                ? phaseColor
                : isFront
                  ? theme.palette.success.main
                  : isRear
                    ? theme.palette.warning.main
                    : isVisited
                      ? alpha(theme.palette.text.secondary, 0.4)
                      : isDimmed
                        ? alpha(theme.palette.error.main, 0.4)
                        : 'divider';
              const label =
                isFront && isRear
                  ? 'F+R'
                  : isFront
                    ? typeId === 'deque'
                      ? 'FRONT'
                      : 'FRONT'
                    : isRear
                      ? typeId === 'deque'
                        ? 'REAR'
                        : 'REAR'
                      : '';
              return (
                <Box
                  key={i}
                  sx={{
                    px: 0.75,
                    py: 0.3,
                    borderRadius: 0.75,
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    border: '1px solid',
                    borderColor: c,
                    bgcolor:
                      isHighlight || isFront || isRear
                        ? alpha(c, isDark ? 0.2 : 0.1)
                        : 'transparent',
                    color:
                      isHighlight || isFront || isRear
                        ? c
                        : isDimmed
                          ? alpha(theme.palette.error.main, 0.5)
                          : 'text.disabled',
                    transition: 'all 200ms ease',
                    textDecoration: isDimmed ? 'line-through' : 'none',
                  }}
                >
                  [{i}]={addr(i)}
                  {label ? ` ← ${label}` : ''}
                </Box>
              );
            })}
          </Box>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mt: 0.5, display: 'block', fontSize: '0.6rem' }}
          >
            {typeId === 'deque'
              ? 'front pointer ← dequeue/peek-front · rear pointer → enqueue/peek-rear'
              : 'front pointer = 0 (dequeue) · rear pointer = ' + rear + ' (enqueue)'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED QUEUE VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedQueue({ values, traceStep, typeId }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;

  const highlightIndex = traceStep?.highlightIndex ?? -1;
  const visitedIndexes = traceStep?.visitedIndexes ?? [];
  const dimIndexes = traceStep?.dimIndexes ?? [];
  const phase = traceStep?.phase ?? null;
  const pointerLabel = traceStep?.pointerLabel ?? null;

  const front = 0;
  const rear = values.length - 1;
  const isDeque = typeId === 'deque';
  const isPriority = typeId === 'priority';

  const cellColor = (idx) => {
    if (idx === highlightIndex) {
      if (phase === 'found' || phase === 'done') return success;
      if (phase === 'shift') return warning;
      return primary;
    }
    if (dimIndexes.includes(idx)) return error;
    if (visitedIndexes.includes(idx)) return alpha(theme.palette.text.secondary, 0.35);
    if (idx === front) return success;
    if (idx === rear && values.length > 1) return warning;
    return 'divider';
  };

  const cellBg = (idx) => {
    if (dimIndexes.includes(idx)) return alpha(error, isDark ? 0.1 : 0.05);
    if (idx === highlightIndex) return alpha(cellColor(idx), isDark ? 0.2 : 0.1);
    if (idx === front) return alpha(success, isDark ? 0.08 : 0.04);
    if (idx === rear && values.length > 1) return alpha(warning, isDark ? 0.08 : 0.04);
    return alpha(theme.palette.text.primary, 0.03);
  };

  const cellOpacity = (idx) => (visitedIndexes.includes(idx) && idx !== highlightIndex ? 0.4 : 1);

  if (!values.length) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          [ Empty queue ]
        </Typography>
      </Paper>
    );
  }

  const typeLabel =
    {
      simple: 'Simple Queue (FIFO)',
      circular: 'Circular Queue',
      deque: 'Deque (Double-Ended)',
      priority: 'Priority Queue (Min-Heap)',
    }[typeId] ?? 'Queue';

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        {typeLabel} — Live State
      </Typography>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        {/* Top row: PUSH FRONT arrow (deque) or ENQUEUE arrow */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          {isDeque ? (
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', color: success, fontSize: '0.6rem', fontWeight: 700 }}
            >
              ← PUSH FRONT
            </Typography>
          ) : null}
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', color: warning, fontSize: '0.6rem', fontWeight: 700 }}
          >
            ENQUEUE →
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', gap: 0 }}>
          {/* DEQUEUE / POP FRONT arrow on left */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mr: 0.5,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: success,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              {isDeque ? '← POP FRONT' : '← DEQUEUE'}
            </Typography>
          </Box>

          {values.map((val, idx) => {
            const isFront = idx === front;
            const isRear = idx === rear && values.length > 1;
            const isHighlight = idx === highlightIndex;
            const isDim = dimIndexes.includes(idx);
            const color = cellColor(idx);

            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* FRONT / REAR labels above */}
                  <Box
                    sx={{
                      height: 20,
                      display: 'flex',
                      gap: 0.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isFront && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: success,
                          fontSize: '0.6rem',
                        }}
                      >
                        {isPriority ? 'MIN' : 'FRONT'}
                      </Typography>
                    )}
                    {isRear && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: warning,
                          fontSize: '0.6rem',
                        }}
                      >
                        REAR
                      </Typography>
                    )}
                  </Box>

                  {/* Cell */}
                  <Box
                    sx={{
                      width: 60,
                      height: 46,
                      border: '2px solid',
                      borderColor: color,
                      borderRight: idx < values.length - 1 ? '1px solid' : '2px solid',
                      borderRightColor: idx < values.length - 1 ? 'divider' : color,
                      bgcolor: cellBg(idx),
                      opacity: cellOpacity(idx),
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: isHighlight ? color : isDim ? error : 'text.primary',
                      transition: 'all 220ms ease',
                      boxShadow: isHighlight ? `0 0 0 3px ${alpha(color, 0.25)}` : 'none',
                      textDecoration: isDim ? 'line-through' : 'none',
                    }}
                  >
                    {String(val)}
                  </Box>

                  {/* Pointer label below */}
                  <Box
                    sx={{
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isHighlight && pointerLabel && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.6rem',
                          color,
                          px: 0.75,
                          py: 0.15,
                          borderRadius: 0.5,
                          bgcolor: alpha(color, 0.12),
                        }}
                      >
                        {pointerLabel}
                      </Typography>
                    )}
                  </Box>

                  {/* Index + address */}
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                  >
                    [{idx}]
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: 'monospace', fontSize: '0.55rem' }}
                  >
                    {addr(idx)}
                  </Typography>
                </Box>
              </Box>
            );
          })}

          {/* Circular wrap indicator */}
          {typeId === 'circular' && (
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', color: 'text.disabled', ml: 1, fontSize: '0.65rem' }}
            >
              ↩ wraps
            </Typography>
          )}
        </Box>

        {/* Bottom row: POP REAR arrow (deque only) */}
        {isDeque && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', color: warning, fontSize: '0.6rem', fontWeight: 700 }}
            >
              POP REAR →
            </Typography>
          </Box>
        )}
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
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 70 }}
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
// QUEUE PANEL (per tab)
// ─────────────────────────────────────────────────────────────────────────────
function QueuePanel({ queueType, defaults }) {
  const initial = useMemo(() => {
    if (Array.isArray(defaults?.initialValues)) return defaults.initialValues;
    return [10, 20, 30];
  }, [defaults?.initialValues]);

  const defaultValues = initial.length ? initial : [10, 20, 30];
  const typeId = queueType.id;
  const isDeque = typeId === 'deque';
  const isPriority = typeId === 'priority';
  const COMPLEXITY = getComplexity(typeId);

  const [values, setValues] = useState(defaultValues);
  const [preValues, setPreValues] = useState(defaultValues);
  const [valueInput, setValueInput] = useState('');
  const [message, setMessage] = useState('Perform any operation — Why panel explains each step.');
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

  const displayValues = isPlaying || traceIdx < 0 || isLastStep || onDoneStep ? values : preValues;

  const parsedValue = Number.parseInt(valueInput, 10);

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
      }, 850);
    },
    [stopAnim],
  );

  const stepForward = () => setTraceIdx((i) => Math.min(i + 1, trace.length - 1));
  const stepBackward = () => setTraceIdx((i) => Math.max(i - 1, 0));

  const runOp = (op, nextValues, desc, logDetail, severity = 'success') => {
    stopAnim();
    setActiveOp(op);
    setPreValues([...values]);
    const t = buildTrace(op, values, parsedValue, typeId);
    setTrace(t);
    setTraceIdx(-1);
    setValues(nextValues);
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

  // ── Standard operations ───────────────────────────────────────────────────
  const handleEnqueue = () => {
    if (Number.isNaN(parsedValue)) return setError('Enqueue needs a valid integer value.');
    const next = isPriority
      ? [...values, parsedValue].sort((a, b) => a - b) // min-heap sort for display
      : [...values, parsedValue];
    runOp(
      'enqueue',
      next,
      `Enqueued ${parsedValue}. Watch Why panel — ${isPriority ? 'O(log n) bubble-up.' : 'O(1) rear pointer advance.'}`,
      `${parsedValue} → rear [${values.length}]`,
    );
  };

  const handleDequeue = () => {
    if (!values.length) return setError('Queue is empty — nothing to dequeue.');
    const removed = values[0];
    const next = values.slice(1);
    runOp(
      'dequeue',
      next,
      `Dequeued ${removed} from front. Watch Why panel — ${isPriority ? 'O(log n) sift-down.' : 'O(1) front pointer advance.'}`,
      `removed ${removed}, size → ${next.length}`,
    );
  };

  const handlePeek = () => {
    if (!values.length) return setError('Queue is empty — nothing to peek.');
    runOp(
      'peek',
      values,
      `Peek → front = ${values[0]}. Watch Why panel show direct read — O(1).`,
      `front = ${values[0]}`,
    );
  };

  const handleIsEmpty = () => {
    runOp(
      'isEmpty',
      values,
      values.length === 0
        ? 'isEmpty → true. Watch Why panel — O(1).'
        : `isEmpty → false. ${values.length} element(s). Watch Why panel — O(1).`,
      values.length === 0 ? 'true' : `false (size ${values.length})`,
      values.length === 0 ? 'warning' : 'success',
    );
  };

  const handleSearch = () => {
    if (Number.isNaN(parsedValue)) return setError('Search needs a valid integer value.');
    const idx = values.indexOf(parsedValue);
    runOp(
      'search',
      values,
      idx === -1
        ? `${parsedValue} not found. Watch Why panel scan each element — O(n).`
        : `Found ${parsedValue} at [${idx}]. Watch Why panel — O(n).`,
      idx === -1 ? `${parsedValue} → not found` : `${parsedValue} → [${idx}]`,
      idx === -1 ? 'warning' : 'success',
    );
  };

  const handleClear = () => {
    const size = values.length;
    runOp(
      'clear',
      [],
      `Cleared all ${size} element(s). Watch Why panel dequeue each one — O(n).`,
      `removed ${size} element(s)`,
      'info',
    );
  };

  // ── Deque-only operations ─────────────────────────────────────────────────
  const handlePushFront = () => {
    if (Number.isNaN(parsedValue)) return setError('Push Front needs a valid integer value.');
    const next = [parsedValue, ...values];
    runOp(
      'pushFront',
      next,
      `Pushed ${parsedValue} to front. Watch Why panel show O(1) front pointer move.`,
      `${parsedValue} → front [0]`,
    );
  };

  const handlePopRear = () => {
    if (!values.length) return setError('Deque is empty — nothing to pop from rear.');
    const removed = values[values.length - 1];
    const next = values.slice(0, -1);
    runOp(
      'popRear',
      next,
      `Popped ${removed} from rear. Watch Why panel show O(1) rear pointer decrement.`,
      `removed rear=${removed}, size → ${next.length}`,
    );
  };

  const handlePeekRear = () => {
    if (!values.length) return setError('Deque is empty — nothing to peek at rear.');
    runOp(
      'peekRear',
      values,
      `Peek rear → ${values[values.length - 1]}. Watch Why panel show direct read — O(1).`,
      `rear = ${values[values.length - 1]}`,
    );
  };

  const handleReset = () => {
    stopAnim();
    setActiveOp(null);
    setOpLog([]);
    setValues(defaultValues);
    setPreValues(defaultValues);
    setTrace([]);
    setTraceIdx(-1);
    setMessage('Reset. Perform any operation — Why panel explains each step.');
    setMessageSeverity('info');
  };

  const progress =
    trace.length > 1 ? (Math.max(0, traceIdx) / (trace.length - 1)) * 100 : traceIdx >= 0 ? 100 : 0;

  const complexityRows = Object.entries(COMPLEXITY).map(([id, meta]) => {
    const isActive = activeOp === id;
    return {
      id,
      highlight: isActive,
      label: meta.label,
      value: isActive
        ? { value: meta.value, tone: meta.color === 'success' ? 'good' : 'worse' }
        : meta.value,
      note: isActive ? { value: meta.note, tone: 'highlight' } : meta.note,
    };
  });

  return (
    <Stack sx={{ gap: 2 }}>
      {/* Input */}
      <TextField
        label="Value"
        size="small"
        value={valueInput}
        onChange={(e) => setValueInput(e.target.value)}
        placeholder="e.g. 40"
        sx={{ maxWidth: 200 }}
      />

      {/* ── Standard buttons ── */}
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
        <Tooltip title={isPriority ? 'O(log n) — heap insert + bubble-up' : 'O(1) — add at rear'}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleEnqueue}
          >
            Enqueue
          </Button>
        </Tooltip>
        <Tooltip
          title={isPriority ? 'O(log n) — extract min + sift-down' : 'O(1) — remove from front'}
        >
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<RemoveRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleDequeue}
          >
            Dequeue
          </Button>
        </Tooltip>
        <Tooltip title="O(1) — read front without removing">
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handlePeek}
          >
            Peek {isPriority ? 'Min' : 'Front'}
          </Button>
        </Tooltip>

        {/* Deque-only buttons */}
        {isDeque && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Tooltip title="O(1) — add at front, front pointer moves back">
              <Button
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<KeyboardArrowLeftRoundedIcon />}
                sx={{ textTransform: 'none' }}
                onClick={handlePushFront}
              >
                Push Front
              </Button>
            </Tooltip>
            <Tooltip title="O(1) — remove from rear, rear pointer moves back">
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<KeyboardArrowRightRoundedIcon />}
                sx={{ textTransform: 'none' }}
                onClick={handlePopRear}
              >
                Pop Rear
              </Button>
            </Tooltip>
            <Tooltip title="O(1) — read rear without removing">
              <Button
                size="small"
                variant="outlined"
                color="info"
                startIcon={<VisibilityRoundedIcon />}
                sx={{ textTransform: 'none' }}
                onClick={handlePeekRear}
              >
                Peek Rear
              </Button>
            </Tooltip>
          </>
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="O(1) — check size === 0">
          <Button
            size="small"
            variant="outlined"
            color="info"
            sx={{ textTransform: 'none' }}
            onClick={handleIsEmpty}
          >
            isEmpty
          </Button>
        </Tooltip>
        <Tooltip title="O(n) — scan front to rear">
          <Button
            size="small"
            variant="outlined"
            startIcon={<SearchRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Tooltip>
        <Tooltip title="O(n) — n individual dequeues">
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<LayersClearRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Reset to initial state">
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

      {/* Two column: viz + why panel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <AnimatedQueue values={displayValues} traceStep={currentStep} typeId={typeId} />
        <WhyPanel step={currentStep} values={displayValues} typeId={typeId} />
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isDeque ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr',
          gap: 1.5,
        }}
      >
        <StatCard label="Size" value={values.length} color="info" />
        <StatCard
          label={isPriority ? 'Min' : 'Front'}
          value={values.length ? values[0] : '∅'}
          color="success"
        />
        {isDeque && (
          <StatCard
            label="Rear"
            value={values.length ? values[values.length - 1] : '∅'}
            color="warning"
          />
        )}
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

      {/* Operation log */}
      <OperationLog entries={opLog} />

      <Typography variant="caption" color="text.secondary">
        {isDeque
          ? 'Deque — push/pop/peek at both front and rear in O(1). All 6 core ops are constant time.'
          : isPriority
            ? 'Priority Queue — enqueue/dequeue O(log n) to maintain heap order. Peek min is O(1).'
            : 'Queue FIFO — enqueue at rear, dequeue from front. Core ops O(1). Search and clear O(n).'}
      </Typography>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function QueueOperationsVisualization({ defaults = {} }) {
  const [activeTab, setActiveTab] = useState(0);
  const queueType = QUEUE_TYPES[activeTab];

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
            {QUEUE_TYPES.map((t) => (
              <Tab
                key={t.id}
                label={t.label}
                sx={{ textTransform: 'none', minHeight: 40, py: 0.5 }}
              />
            ))}
          </Tabs>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
            {queueType.description}
          </Typography>
        </Box>
        <QueuePanel key={queueType.id} queueType={queueType} defaults={defaults} />
      </Stack>
    </Paper>
  );
}
