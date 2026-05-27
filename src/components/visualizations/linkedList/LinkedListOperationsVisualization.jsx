import { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  LinearProgress,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Alert, StatCard } from '../../shared';

// ─────────────────────────────────────────────────────────────────────────────
// LIST TYPES
// ─────────────────────────────────────────────────────────────────────────────
const LIST_TYPES = [
  {
    id: 'singly',
    label: 'Singly',
    description: 'Each node has one next pointer. No backward traversal.',
    mode: 'singly',
  },
  {
    id: 'doubly',
    label: 'Doubly',
    description: 'Each node has next and prev pointers. O(1) delete at known node.',
    mode: 'doubly',
  },
  {
    id: 'circular',
    label: 'Circular',
    description: "Tail's next points back to head. Cycles endlessly.",
    mode: 'circular',
  },
  {
    id: 'circular-doubly',
    label: 'Circular Doubly',
    description: 'Tail ↔ head connected in both directions. Used in OS schedulers.',
    mode: 'circular-doubly',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEXITY META
// ─────────────────────────────────────────────────────────────────────────────
const COMPLEXITY = {
  prepend: {
    label: 'Prepend',
    value: 'O(1)',
    color: 'success',
    note: 'Insert at head — just update head pointer',
  },
  append: {
    label: 'Append',
    value: 'O(n)',
    color: 'warning',
    note: 'Traverse to tail — O(1) only with tail pointer',
  },
  'insert-at': {
    label: 'Insert At',
    value: 'O(n)',
    color: 'warning',
    note: 'Traverse to target index, then re-link',
  },
  'delete-head': {
    label: 'Delete Head',
    value: 'O(1)',
    color: 'success',
    note: 'Move head pointer to next node',
  },
  'delete-tail': {
    label: 'Delete Tail',
    value: 'O(n)',
    color: 'warning',
    note: 'Traverse to second-to-last node',
  },
  'delete-at': {
    label: 'Delete At',
    value: 'O(n)',
    color: 'warning',
    note: 'Traverse to target index, then re-link',
  },
  search: {
    label: 'Search',
    value: 'O(n)',
    color: 'warning',
    note: 'Scan nodes one by one from head',
  },
  get: {
    label: 'Get',
    value: 'O(n)',
    color: 'warning',
    note: 'No random access — traverse from head',
  },
};

const ALL_OPS = Object.entries(COMPLEXITY).map(([id, meta]) => ({ id, ...meta }));

// ─────────────────────────────────────────────────────────────────────────────
// FAKE MEMORY ADDRESSES
// Assigned once per node so they look like real heap addresses.
// This is the KEY visual — nodes are scattered, not contiguous.
// ─────────────────────────────────────────────────────────────────────────────
function generateAddresses(count) {
  const base = [0x1a4c, 0x3f80, 0x2b10, 0x5d44, 0x0e28, 0x47ac, 0x6c30, 0x39f0];
  return Array.from(
    { length: count },
    (_, i) => `0x${(base[i % base.length] + i * 0x14).toString(16).toUpperCase().padStart(4, '0')}`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDER
// Each step has:
//   currIndex      — which node `curr` pointer is at right now
//   visitedIndexes — nodes already passed (dimmed)
//   highlightIndex — current focus node
//   phase          — 'traverse' | 'found' | 'relink' | 'done' | 'instant'
//   pointerVar     — the variable being shown: 'curr', 'prev', 'head', etc.
//   codeSnippet    — the actual line of code executing right now
//   whyExplanation — the fundamental reason this step must happen
//   relinkFrom     — index of node whose pointer is being changed (for relink phase)
//   relinkTo       — index of new target (for relink phase)
// ─────────────────────────────────────────────────────────────────────────────
function buildTrace(op, list, parsedIndex, parsedValue, addresses) {
  const n = list.length;
  const steps = [];

  const visitStep = (i, visited, opts = {}) => ({
    currIndex: i,
    visitedIndexes: [...visited],
    highlightIndex: i,
    phase: 'traverse',
    pointerVar: opts.pointerVar ?? 'curr',
    codeSnippet: opts.code ?? 'curr = curr.next',
    whyExplanation:
      opts.why ??
      `No index formula exists. The only way to reach node[${i}] is to follow the .next chain from head. Memory address: ${addresses[i]} — unrelated to ${addresses[Math.max(0, i - 1)]}.`,
    relinkFrom: null,
    relinkTo: null,
    message:
      opts.message ??
      `curr is at node[${i}] (addr ${addresses[i]}) — checking if this is the target...`,
  });

  switch (op) {
    // ── O(1): PREPEND ──────────────────────────────────────────────────────
    case 'prepend':
      steps.push({
        currIndex: null,
        visitedIndexes: [],
        highlightIndex: null,
        phase: 'instant',
        pointerVar: 'newNode',
        codeSnippet: 'newNode.next = head',
        whyExplanation:
          "We already hold the head reference. No traversal needed — just redirect one pointer. This is why it's O(1): constant work regardless of list size.",
        relinkFrom: null,
        relinkTo: 0,
        message: 'newNode.next = head  →  new node now points to old head.',
      });
      steps.push({
        currIndex: null,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'done',
        pointerVar: 'head',
        codeSnippet: 'head = newNode',
        whyExplanation:
          "head pointer updated to newNode. Total work: 2 pointer writes. Always 2, never more — that's O(1).",
        relinkFrom: null,
        relinkTo: null,
        message: 'head = newNode  →  done. 1 step no matter how large the list — O(1).',
      });
      break;

    // ── O(1): DELETE HEAD ─────────────────────────────────────────────────
    case 'delete-head':
      steps.push({
        currIndex: 0,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'instant',
        pointerVar: 'head',
        codeSnippet: 'head = head.next',
        whyExplanation:
          'head already points to node[0]. Moving it to node[1] (addr: ' +
          (addresses[1] ?? 'null') +
          ') is a single pointer write — O(1). No other nodes touched.',
        relinkFrom: null,
        relinkTo: null,
        message: `head.next is ${addresses[1] ?? 'null'}. Updating head to point there directly.`,
      });
      steps.push({
        currIndex: null,
        visitedIndexes: [],
        highlightIndex: 1,
        phase: 'done',
        pointerVar: 'head',
        codeSnippet: '// node[0] is now unreferenced → GC',
        whyExplanation:
          'Done. 1 pointer update, zero traversal — always O(1) regardless of list length.',
        relinkFrom: null,
        relinkTo: null,
        message: 'head now points to node[1]. Old head is garbage collected. O(1) complete.',
      });
      break;

    // ── O(n): APPEND ──────────────────────────────────────────────────────
    case 'append': {
      // Step 0 — explain WHY we must traverse
      steps.push({
        currIndex: 0,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'traverse',
        pointerVar: 'curr',
        codeSnippet: 'curr = head  // start at head',
        whyExplanation:
          "Unlike arrays (base + i×size = direct address), linked list nodes are scattered in heap memory. There is NO formula to compute the tail's address. We must walk the chain.",
        relinkFrom: null,
        relinkTo: null,
        message: `curr = head  →  starting at node[0] (addr: ${addresses[0]}). Must walk to find null terminus.`,
      });
      const visited = [];
      for (let i = 0; i < n; i++) {
        if (i > 0) {
          steps.push(
            visitStep(i, visited, {
              code: 'curr = curr.next',
              why: `curr.next holds address ${addresses[i]} — the only way to get here. We have no other reference to node[${i}]. This pointer hop is mandatory — it's why append is O(n).`,
              message: `curr.next = ${addresses[i]}  →  hopping to node[${i}]. Still looking for node where next = null...`,
            }),
          );
        }
        visited.push(i);
        if (i === n - 1) {
          steps.push({
            currIndex: i,
            visitedIndexes: [...visited],
            highlightIndex: i,
            phase: 'found',
            pointerVar: 'curr (tail)',
            codeSnippet: 'curr.next === null  // found tail',
            whyExplanation: `curr.next is null — this is the tail. We had to visit all ${n} nodes to discover this. That's the O(n) cost.`,
            relinkFrom: null,
            relinkTo: null,
            message: `Node[${i}].next = null — this is the tail after ${n} hops. Now we can append.`,
          });
          steps.push({
            currIndex: i,
            visitedIndexes: [...visited],
            highlightIndex: n,
            phase: 'relink',
            pointerVar: 'curr.next',
            codeSnippet: 'curr.next = newNode',
            whyExplanation: `tail.next now points to the new node. Visited ${n} nodes to get here — O(n). With a tail pointer we'd skip all this.`,
            relinkFrom: i,
            relinkTo: n,
            message: `curr.next = newNode  →  new node linked at position [${n}]. Done after ${n} hops — O(n).`,
          });
        }
      }
      break;
    }

    // ── O(n): INSERT AT ───────────────────────────────────────────────────
    case 'insert-at': {
      if (parsedIndex === 0) {
        steps.push({
          currIndex: null,
          visitedIndexes: [],
          highlightIndex: null,
          phase: 'instant',
          pointerVar: 'head',
          codeSnippet: 'newNode.next = head; head = newNode',
          whyExplanation:
            'Index 0 means insert before head. We already hold head reference — zero traversal needed. O(1) for this case.',
          relinkFrom: null,
          relinkTo: null,
          message: 'Inserting at index 0 = prepend. Head pointer updated directly — O(1).',
        });
        break;
      }
      steps.push({
        currIndex: 0,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'traverse',
        pointerVar: 'prev',
        codeSnippet: 'prev = head  // need predecessor of target',
        whyExplanation: `To insert at index ${parsedIndex}, we need node[${parsedIndex - 1}] (the predecessor). We have no direct address for it — must walk from head.`,
        relinkFrom: null,
        relinkTo: null,
        message: `prev = head  →  at node[0] (${addresses[0]}). Need to reach node[${parsedIndex - 1}] — walking...`,
      });
      const visited = [0];
      for (let i = 1; i < parsedIndex; i++) {
        steps.push(
          visitStep(i, [...visited], {
            pointerVar: i === parsedIndex - 1 ? 'prev (target predecessor)' : 'prev',
            code: 'prev = prev.next',
            why: `prev.next = ${addresses[i]}. Hopping there now. No shortcut exists — each hop is mandatory. This is why insert-at is O(n).`,
            message: `prev = prev.next  →  now at node[${i}] (${addresses[i]}). ${i === parsedIndex - 1 ? 'This is the predecessor!' : `Need node[${parsedIndex - 1}] — keep going...`}`,
          }),
        );
        visited.push(i);
      }
      steps.push({
        currIndex: parsedIndex - 1,
        visitedIndexes: [...visited],
        highlightIndex: parsedIndex - 1,
        phase: 'found',
        pointerVar: 'prev',
        codeSnippet: `// prev = node[${parsedIndex - 1}], found after ${parsedIndex} hops`,
        whyExplanation: `Found predecessor node[${parsedIndex - 1}] after ${parsedIndex} hop(s). Now perform 2 pointer writes to re-link. The traversal cost was O(${parsedIndex}) → O(n).`,
        relinkFrom: null,
        relinkTo: null,
        message: `Found predecessor node[${parsedIndex - 1}] after ${parsedIndex} hop(s). Re-linking now...`,
      });
      steps.push({
        currIndex: parsedIndex - 1,
        visitedIndexes: [...visited],
        highlightIndex: parsedIndex,
        phase: 'relink',
        pointerVar: 'newNode.next',
        codeSnippet: 'newNode.next = prev.next',
        whyExplanation:
          'Step 1 of re-linking: newNode.next → old successor. Must do this BEFORE overwriting prev.next or we lose the chain.',
        relinkFrom: parsedIndex,
        relinkTo: parsedIndex + 1,
        message: 'newNode.next = prev.next  →  new node now points to old successor.',
      });
      steps.push({
        currIndex: parsedIndex - 1,
        visitedIndexes: [...visited],
        highlightIndex: parsedIndex,
        phase: 'done',
        pointerVar: 'prev.next',
        codeSnippet: 'prev.next = newNode',
        whyExplanation: `Step 2: predecessor now points to newNode. Insert complete. Total: ${parsedIndex} traversal hops + 2 pointer writes = O(n).`,
        relinkFrom: parsedIndex - 1,
        relinkTo: parsedIndex,
        message: `prev.next = newNode  →  done. Inserted at [${parsedIndex}] after ${parsedIndex} hops — O(n).`,
      });
      break;
    }

    // ── O(n): DELETE TAIL ─────────────────────────────────────────────────
    case 'delete-tail': {
      steps.push({
        currIndex: 0,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'traverse',
        pointerVar: 'curr',
        codeSnippet: 'curr = head  // find node before tail',
        whyExplanation: `We need node[${n - 2}] (second-to-last) to set its .next = null. Its address is ${addresses[n - 2]} — unknown to us unless we walk the chain.`,
        relinkFrom: null,
        relinkTo: null,
        message: `curr = head. Need to reach node[${n - 2}] (second-to-last). Walking...`,
      });
      const visited = [0];
      for (let i = 1; i < n - 1; i++) {
        steps.push(
          visitStep(i, [...visited], {
            pointerVar: i === n - 2 ? 'curr (new tail)' : 'curr',
            code: 'curr = curr.next',
            why: `curr.next = ${addresses[i]}. Following pointer. Cannot skip — linked list has no backward index. This mandatory walk makes delete-tail O(n).`,
            message: `curr = curr.next  →  node[${i}] (${addresses[i]}). ${i === n - 2 ? 'curr.next is the tail — found it!' : 'curr.next is not tail yet...'}`,
          }),
        );
        visited.push(i);
      }
      steps.push({
        currIndex: n - 2,
        visitedIndexes: [...visited],
        highlightIndex: n - 2,
        phase: 'found',
        pointerVar: 'curr (new tail)',
        codeSnippet: 'curr.next === tail  // found second-to-last',
        whyExplanation: `curr.next is the tail. Visited ${n - 1} nodes to get here. Setting curr.next = null removes the tail. Total cost: O(n).`,
        relinkFrom: null,
        relinkTo: null,
        message: `node[${n - 2}].next is the tail. Severing link now...`,
      });
      steps.push({
        currIndex: n - 2,
        visitedIndexes: [...visited],
        highlightIndex: n - 2,
        phase: 'done',
        pointerVar: 'tail',
        codeSnippet: 'curr.next = null; tail = curr',
        whyExplanation: `curr.next = null severs the tail. tail pointer updated to curr. ${n - 1} hops were required — O(n). A doubly linked list wouldn't help here either without a tail pointer.`,
        relinkFrom: n - 2,
        relinkTo: null,
        message: `curr.next = null  →  tail removed after ${n - 1} hops. O(n) complete.`,
      });
      break;
    }

    // ── O(n): DELETE AT ───────────────────────────────────────────────────
    case 'delete-at': {
      if (parsedIndex === 0) {
        steps.push({
          currIndex: 0,
          visitedIndexes: [],
          highlightIndex: 0,
          phase: 'instant',
          pointerVar: 'head',
          codeSnippet: 'head = head.next',
          whyExplanation:
            'Deleting index 0 = delete head. We hold head reference directly — no traversal. O(1).',
          relinkFrom: null,
          relinkTo: null,
          message: 'head = head.next  →  head pointer moved forward. O(1) — no traversal.',
        });
        break;
      }
      steps.push({
        currIndex: 0,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'traverse',
        pointerVar: 'prev',
        codeSnippet: 'prev = head',
        whyExplanation: `Need predecessor of node[${parsedIndex}] to re-link. Its address ${addresses[parsedIndex - 1]} is unreachable without walking the chain.`,
        relinkFrom: null,
        relinkTo: null,
        message: `prev = head  →  at node[0]. Need node[${parsedIndex - 1}] as predecessor. Walking...`,
      });
      const visited = [0];
      for (let i = 1; i < parsedIndex; i++) {
        steps.push(
          visitStep(i, [...visited], {
            pointerVar: i === parsedIndex - 1 ? 'prev (predecessor)' : 'prev',
            code: 'prev = prev.next',
            why: `Following prev.next = ${addresses[i]}. Each hop is a mandatory memory dereference — the fundamental reason linked list delete-at is O(n).`,
            message: `prev.next = ${addresses[i]}  →  at node[${i}]. ${i === parsedIndex - 1 ? 'This is the predecessor of target!' : 'Not there yet...'}`,
          }),
        );
        visited.push(i);
      }
      steps.push({
        currIndex: parsedIndex - 1,
        visitedIndexes: [...visited],
        highlightIndex: parsedIndex,
        phase: 'found',
        pointerVar: 'prev.next = target',
        codeSnippet: `curr = prev.next  // this is node[${parsedIndex}]`,
        whyExplanation: `Found node[${parsedIndex}] via predecessor after ${parsedIndex} hops. Now bypass it: prev.next = curr.next.`,
        relinkFrom: null,
        relinkTo: null,
        message: `curr = prev.next = node[${parsedIndex}] (${addresses[parsedIndex]}). Bypassing it now...`,
      });
      steps.push({
        currIndex: parsedIndex - 1,
        visitedIndexes: [...visited],
        highlightIndex: parsedIndex - 1,
        phase: 'done',
        pointerVar: 'prev.next',
        codeSnippet: 'prev.next = curr.next  // bypass deleted node',
        whyExplanation: `prev.next now skips over node[${parsedIndex}] and points to its successor. The deleted node has no references → GC. Total: ${parsedIndex} hops — O(n).`,
        relinkFrom: parsedIndex - 1,
        relinkTo: parsedIndex + 1 < n ? parsedIndex + 1 : null,
        message: `prev.next = curr.next  →  node[${parsedIndex}] bypassed. Deleted after ${parsedIndex} hops — O(n).`,
      });
      break;
    }

    // ── O(n): SEARCH ──────────────────────────────────────────────────────
    case 'search': {
      steps.push({
        currIndex: 0,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'traverse',
        pointerVar: 'curr',
        codeSnippet: 'curr = head',
        whyExplanation: `Searching for value ${parsedValue}. Linked list has no hash, no index, no sorted order to exploit — must check every node. Starting at head (${addresses[0]}).`,
        relinkFrom: null,
        relinkTo: null,
        message: `curr = head  →  node[0] = ${list[0]?.value}. Is this ${parsedValue}? ${list[0]?.value === parsedValue ? 'YES!' : 'No — keep scanning.'}`,
      });
      const visited = [];
      let foundIdx = -1;
      for (let i = 0; i < n; i++) {
        if (i > 0) {
          const isMatch = list[i].value === parsedValue;
          steps.push({
            currIndex: i,
            visitedIndexes: [...visited],
            highlightIndex: i,
            phase: isMatch ? 'found' : 'traverse',
            pointerVar: isMatch ? 'curr (FOUND)' : 'curr',
            codeSnippet: isMatch
              ? `curr.value === ${parsedValue}  // match!`
              : `curr.value !== ${parsedValue}; curr = curr.next`,
            whyExplanation: isMatch
              ? `Found at node[${i}] after ${i + 1} comparisons. In worst case (not found) we'd check all ${n}. That's O(n).`
              : `curr.value = ${list[i].value} ≠ ${parsedValue}. Must follow .next to ${i + 1 < n ? addresses[i + 1] : 'null'}. No way to skip — no hash, no sort order.`,
            relinkFrom: null,
            relinkTo: null,
            message: isMatch
              ? `curr.value === ${parsedValue}  →  FOUND at node[${i}] after ${i + 1} comparisons!`
              : `node[${i}].value = ${list[i].value} ≠ ${parsedValue}. curr = curr.next (${i + 1 < n ? addresses[i + 1] : 'null'}).`,
          });
          if (isMatch) {
            foundIdx = i;
            break;
          }
        }
        visited.push(i);
      }
      if (foundIdx === -1) {
        steps.push({
          currIndex: null,
          visitedIndexes: Array.from({ length: n }, (_, i) => i),
          highlightIndex: null,
          phase: 'done',
          pointerVar: 'curr',
          codeSnippet: 'curr === null  // exhausted list',
          whyExplanation: `curr is null — end of list. Checked all ${n} nodes without finding ${parsedValue}. Worst case O(n) — every node visited.`,
          relinkFrom: null,
          relinkTo: null,
          message: `curr = null. ${parsedValue} not found after scanning all ${n} nodes — O(n) worst case.`,
        });
      }
      break;
    }

    // ── O(n): GET ─────────────────────────────────────────────────────────
    case 'get': {
      steps.push({
        currIndex: 0,
        visitedIndexes: [],
        highlightIndex: 0,
        phase: 'traverse',
        pointerVar: 'curr',
        codeSnippet: 'curr = head  // index 0 costs nothing extra',
        whyExplanation: `Getting node[${parsedIndex}]. Arrays use: address = base + ${parsedIndex}×size — instant. Linked lists have NO such formula. Each node's address is stored only in the previous node's .next field.`,
        relinkFrom: null,
        relinkTo: null,
        message: `curr = head = node[0] (${addresses[0]}). To reach index ${parsedIndex}, must hop ${parsedIndex} time(s).`,
      });
      const visited = [0];
      for (let i = 1; i <= parsedIndex; i++) {
        steps.push({
          currIndex: i,
          visitedIndexes: [...visited],
          highlightIndex: i,
          phase: i === parsedIndex ? 'found' : 'traverse',
          pointerVar: i === parsedIndex ? `curr [index ${parsedIndex}]` : 'curr',
          codeSnippet: i === parsedIndex ? `// reached index ${parsedIndex}` : 'curr = curr.next',
          whyExplanation:
            i === parsedIndex
              ? `Reached node[${parsedIndex}] after ${parsedIndex} hops. An array would have done this in 1 step. Linked list: O(n). This is the fundamental trade-off — O(1) insert/delete vs O(n) access.`
              : `curr.next = ${addresses[i]}. Hop ${i} of ${parsedIndex}. Array access (base+i×size) would skip this entirely — linked list cannot.`,
          relinkFrom: null,
          relinkTo: null,
          message:
            i === parsedIndex
              ? `Reached node[${parsedIndex}] = ${list[parsedIndex]?.value} after ${parsedIndex} hops — O(n).`
              : `Hop ${i}: curr = curr.next = ${addresses[i]}  →  node[${i}]. ${parsedIndex - i} more hop(s) to go.`,
        });
        visited.push(i);
      }
      break;
    }

    default:
      break;
  }

  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY PANEL — the core educational piece
// Shows: current code line, why it must happen, memory context
// ─────────────────────────────────────────────────────────────────────────────
function WhyPanel({ step, addresses, listLength, op }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!step) return null;

  const isO1 =
    step.phase === 'instant' ||
    (step.phase === 'done' && (op === 'prepend' || op === 'delete-head'));
  const phaseColor =
    {
      instant: theme.palette.success.main,
      found: theme.palette.success.main,
      done: theme.palette.success.main,
      relink: theme.palette.warning.main,
      traverse: theme.palette.primary.main,
    }[step.phase] ?? theme.palette.primary.main;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      {/* Header */}
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
        {step.pointerVar && (
          <Chip
            label={step.pointerVar}
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

      {/* Executing code line */}
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

      {/* Step message */}
      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.65 }}>
        {step.message}
      </Typography>

      {/* WHY explanation */}
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

      {/* Memory address strip — the visual proof nodes are scattered */}
      {step.currIndex !== null && addresses.length > 0 && (
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
            Heap memory (why no formula exists)
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {addresses.slice(0, listLength).map((addr, i) => (
              <Box
                key={i}
                sx={{
                  px: 1,
                  py: 0.4,
                  borderRadius: 0.75,
                  fontFamily: 'monospace',
                  fontSize: '0.65rem',
                  border: '1px solid',
                  borderColor:
                    i === step.currIndex
                      ? phaseColor
                      : step.visitedIndexes?.includes(i)
                        ? alpha(theme.palette.text.secondary, 0.3)
                        : 'divider',
                  bgcolor:
                    i === step.currIndex ? alpha(phaseColor, isDark ? 0.2 : 0.1) : 'transparent',
                  color: i === step.currIndex ? phaseColor : 'text.disabled',
                  transition: 'all 200ms ease',
                }}
              >
                [{i}]={addr}
              </Box>
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mt: 0.5, display: 'block', fontSize: '0.6rem' }}
          >
            Non-contiguous addresses — no base+i×size formula possible
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED LIST VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedLinkedList({ nodes, mode, traceStep }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

  const highlightIndex = traceStep?.highlightIndex ?? -1;
  const visitedIndexes = traceStep?.visitedIndexes ?? [];
  const phase = traceStep?.phase ?? null;
  const pointerVar = traceStep?.pointerVar ?? null;
  const relinkFrom = traceStep?.relinkFrom ?? null;
  const relinkTo = traceStep?.relinkTo ?? null;

  const isDoubly = mode === 'doubly' || mode === 'circular-doubly';
  const isCircular = mode === 'circular' || mode === 'circular-doubly';

  const nodeColor = (idx) => {
    if (idx === highlightIndex) {
      if (phase === 'found' || phase === 'done') return success;
      if (phase === 'relink') return warning;
      return primary;
    }
    if (visitedIndexes.includes(idx)) return alpha(theme.palette.text.secondary, 0.4);
    return 'divider';
  };

  const nodeBg = (idx) => {
    if (idx === highlightIndex) {
      const c = nodeColor(idx);
      return alpha(c, isDark ? 0.2 : 0.1);
    }
    if (visitedIndexes.includes(idx)) return alpha(theme.palette.text.primary, 0.02);
    return alpha(theme.palette.text.primary, 0.03);
  };

  const nodeOpacity = (idx) => {
    if (visitedIndexes.includes(idx) && idx !== highlightIndex) return 0.4;
    return 1;
  };

  if (!nodes.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">List is empty.</Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        {isCircular && isDoubly
          ? 'Circular Doubly'
          : isCircular
            ? 'Circular Singly'
            : isDoubly
              ? 'Doubly'
              : 'Singly'}{' '}
        — Live State
      </Typography>

      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
          {nodes.map((node, idx) => {
            const val = typeof node === 'object' ? node.value : node;
            const isHighlighted = idx === highlightIndex;
            const isRelinkSrc = idx === relinkFrom;
            const color = nodeColor(idx);

            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Labels above */}
                  <Box sx={{ height: 22, display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    {idx === 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'text.disabled',
                          fontSize: '0.6rem',
                        }}
                      >
                        HEAD
                      </Typography>
                    )}
                    {idx === nodes.length - 1 && nodes.length > 1 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'text.disabled',
                          fontSize: '0.6rem',
                        }}
                      >
                        TAIL
                      </Typography>
                    )}
                  </Box>

                  {/* Node */}
                  <Box
                    sx={{
                      display: 'flex',
                      border: '2px solid',
                      borderColor: color,
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      width: 64,
                      height: 44,
                      bgcolor: nodeBg(idx),
                      opacity: nodeOpacity(idx),
                      transition: 'all 220ms ease',
                      boxShadow: isHighlighted ? `0 0 0 4px ${alpha(color, 0.2)}` : 'none',
                      // Relink source gets a dashed border
                      ...(isRelinkSrc ? { borderStyle: 'dashed' } : {}),
                    }}
                  >
                    {isDoubly && (
                      <Box
                        sx={{
                          width: 16,
                          display: 'grid',
                          placeItems: 'center',
                          borderRight: '1px solid',
                          borderColor: 'divider',
                          bgcolor: alpha(theme.palette.text.primary, 0.03),
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.disabled',
                            fontSize: '0.5rem',
                            writingMode: 'vertical-rl',
                          }}
                        >
                          ←
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        flex: 1,
                        display: 'grid',
                        placeItems: 'center',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: isHighlighted ? color : 'text.primary',
                        transition: 'color 220ms ease',
                      }}
                    >
                      {String(val)}
                    </Box>
                    <Box
                      sx={{
                        width: 16,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: alpha(theme.palette.text.primary, 0.04),
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.disabled',
                          fontSize: '0.5rem',
                          writingMode: 'vertical-rl',
                        }}
                      >
                        {idx === nodes.length - 1 && !isCircular ? 'null' : '→'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pointer label below node */}
                  <Box
                    sx={{
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isHighlighted && pointerVar && (
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
                          transition: 'color 220ms ease',
                        }}
                      >
                        {pointerVar}
                      </Typography>
                    )}
                  </Box>

                  {/* Index */}
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                  >
                    [{idx}]
                  </Typography>
                </Box>

                {/* Arrow — dashed when this is the relink source */}
                {idx < nodes.length - 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: 32,
                      flexShrink: 0,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        sx={{
                          flex: 1,
                          height: 2,
                          bgcolor: isRelinkSrc ? warning : alpha(theme.palette.text.secondary, 0.3),
                          borderTop: isRelinkSrc ? '2px dashed' : 'none',
                          borderColor: warning,
                          transition: 'all 220ms ease',
                        }}
                      />
                      <Typography
                        sx={{
                          color: isRelinkSrc ? warning : 'text.secondary',
                          fontSize: '0.65rem',
                          ml: -0.4,
                          transition: 'color 220ms ease',
                        }}
                      >
                        ▶
                      </Typography>
                    </Box>
                    {isDoubly && (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem', mr: -0.4 }}>
                          ◀
                        </Typography>
                        <Box
                          sx={{
                            flex: 1,
                            height: 1.5,
                            bgcolor: alpha(theme.palette.text.secondary, 0.2),
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}

          {/* Null / circular wrap */}
          {isCircular ? (
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', color: 'text.disabled', ml: 1, flexShrink: 0 }}
            >
              ↩ HEAD
            </Typography>
          ) : (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontFamily: 'monospace', ml: 1, flexShrink: 0 }}
            >
              NULL
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEXITY TABLE
// ─────────────────────────────────────────────────────────────────────────────
function ComplexityTable({ activeOp }) {
  return (
    <Box
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}
    >
      {ALL_OPS.map((op, i) => {
        const isActive = activeOp === op.id;
        return (
          <Box
            key={op.id}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.75,
              borderBottom: i < ALL_OPS.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              bgcolor: isActive ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
              transition: 'background 0.3s',
            })}
          >
            <Typography
              variant="caption"
              sx={{
                color: isActive ? 'text.primary' : 'text.secondary',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {op.label}
              {isActive && (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ ml: 1, color: 'text.disabled' }}
                >
                  — {op.note}
                </Typography>
              )}
            </Typography>
            <Chip
              label={op.value}
              size="small"
              color={isActive ? op.color : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              sx={{ fontFamily: 'monospace', fontSize: 11, height: 20 }}
            />
          </Box>
        );
      })}
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
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 72 }}
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
// LIST PANEL — per tab state + animation engine
// ─────────────────────────────────────────────────────────────────────────────
function ListPanel({ listType, defaults }) {
  const initial = useMemo(() => {
    if (Array.isArray(defaults?.initialList)) return defaults.initialList;
    return [10, 20, 30, 40];
  }, [defaults?.initialList]);

  const defaultList = initial.map((v) => ({ value: v }));

  // Stable addresses — regenerated only when list length changes meaningfully
  const [addresses, setAddresses] = useState(() => generateAddresses(initial.length + 6));

  const [list, setList] = useState(defaultList);
  const [valueInput, setValueInput] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [message, setMessage] = useState(
    'Perform any operation — the Why panel will explain each step as it animates.',
  );
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [activeOp, setActiveOp] = useState(null);
  const [opLog, setOpLog] = useState([]);

  // Animation
  const [trace, setTrace] = useState([]);
  const [traceIdx, setTraceIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  // Snapshot of list BEFORE the operation — used for manual step replay
  // so the node being deleted/inserted is visible until the done step
  const [preList, setPreList] = useState(defaultList);

  const currentStep = trace[traceIdx] ?? null;

  // During manual step-through: show preList until the final done step hits.
  // During autoplay or after animation ends: always show current list (postList).
  // Read/non-mutating ops (search, get): preList === list so no difference.
  const isLastStep = traceIdx === trace.length - 1;
  const onDoneStep = currentStep?.phase === 'done';
  const displayList =
    isPlaying || traceIdx < 0 || isLastStep || onDoneStep
      ? list // post-op state
      : preList; // pre-op state — node still visible during replay

  const parsedIndex = Number.parseInt(indexInput, 10);
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
      }, 900);
    },
    [stopAnim],
  );

  const stepForward = () => setTraceIdx((i) => Math.min(i + 1, trace.length - 1));
  const stepBackward = () => setTraceIdx((i) => Math.max(i - 1, 0));

  const runOp = (op, nextList, desc, logDetail, severity = 'success') => {
    stopAnim();
    setActiveOp(op);
    // Snapshot pre-op list BEFORE mutating — replay will show this
    setPreList([...list]);
    // Build trace against PRE-op list so addresses/indices are correct
    const t = buildTrace(op, list, parsedIndex, parsedValue, addresses);
    setTrace(t);
    setTraceIdx(-1);
    // Apply post-op list
    setList(nextList);
    setMessage(desc);
    setMessageSeverity(severity);
    setOpLog((prev) =>
      [{ op: COMPLEXITY[op]?.label ?? op, detail: logDetail, steps: t.length }, ...prev].slice(
        0,
        8,
      ),
    );
    // Ensure enough addresses
    if (nextList.length + 4 > addresses.length)
      setAddresses(generateAddresses(nextList.length + 6));
    // Auto-play — uses postList throughout (immediate)
    startAnim(t);
  };

  const setError = (msg) => {
    setMessage(msg);
    setMessageSeverity('error');
  };

  // ── Operations ──────────────────────────────────────────────────────────
  const handlePrepend = () => {
    if (Number.isNaN(parsedValue)) return setError('Prepend needs a valid value.');
    const next = [{ value: parsedValue }, ...list];
    runOp(
      'prepend',
      next,
      `Prepended ${parsedValue}. Watch the Why panel — see why it's O(1).`,
      `${parsedValue} → head, len → ${next.length}`,
    );
  };
  const handleAppend = () => {
    if (Number.isNaN(parsedValue)) return setError('Append needs a valid value.');
    const next = [...list, { value: parsedValue }];
    runOp(
      'append',
      next,
      `Appended ${parsedValue}. Watch the Why panel animate each mandatory hop.`,
      `${parsedValue} → tail, len → ${next.length}`,
    );
  };
  const handleInsertAt = () => {
    if (Number.isNaN(parsedValue) || Number.isNaN(parsedIndex))
      return setError('Insert At needs both value and index.');
    if (parsedIndex < 0 || parsedIndex > list.length)
      return setError(`Index must be 0–${list.length}.`);
    const next = [...list];
    next.splice(parsedIndex, 0, { value: parsedValue });
    runOp(
      'insert-at',
      next,
      `Inserting at [${parsedIndex}]. Watch Why panel show each hop + the re-link.`,
      `[${parsedIndex}] ← ${parsedValue}, len → ${next.length}`,
    );
  };
  const handleDeleteHead = () => {
    if (!list.length) return setError('List is empty.');
    const removed = list[0].value;
    const next = list.slice(1);
    runOp(
      'delete-head',
      next,
      `Deleted head (${removed}). Watch why no traversal happens — O(1).`,
      `removed head=${removed}, len → ${next.length}`,
    );
  };
  const handleDeleteTail = () => {
    if (!list.length) return setError('List is empty.');
    const removed = list[list.length - 1].value;
    const next = list.slice(0, -1);
    runOp(
      'delete-tail',
      next,
      `Deleted tail (${removed}). Watch Why panel show each mandatory hop to reach second-to-last.`,
      `removed tail=${removed}, len → ${next.length}`,
    );
  };
  const handleDeleteAt = () => {
    if (Number.isNaN(parsedIndex)) return setError('Delete At needs a valid index.');
    if (parsedIndex < 0 || parsedIndex >= list.length)
      return setError(`Index out of bounds: 0–${list.length - 1}.`);
    const removed = list[parsedIndex].value;
    const next = [...list];
    next.splice(parsedIndex, 1);
    runOp(
      'delete-at',
      next,
      `Deleted node[${parsedIndex}] (${removed}). See each hop + pointer bypass in Why panel.`,
      `[${parsedIndex}]=${removed} removed, len → ${next.length}`,
    );
  };
  const handleSearch = () => {
    if (Number.isNaN(parsedValue)) return setError('Search needs a valid value.');
    const idx = list.findIndex((n) => n.value === parsedValue);
    runOp(
      'search',
      list,
      `Searching for ${parsedValue}. Watch Why panel show each comparison.`,
      idx === -1 ? `${parsedValue} → not found` : `${parsedValue} → [${idx}]`,
      idx === -1 ? 'warning' : 'success',
    );
  };
  const handleGet = () => {
    if (Number.isNaN(parsedIndex)) return setError('Get needs a valid index.');
    if (parsedIndex < 0 || parsedIndex >= list.length)
      return setError(`Index out of bounds: 0–${list.length - 1}.`);
    runOp(
      'get',
      list,
      `Getting node[${parsedIndex}]. See why linked list can't jump directly like an array.`,
      `node[${parsedIndex}] → ${list[parsedIndex].value}`,
    );
  };
  const handleReset = () => {
    stopAnim();
    setActiveOp(null);
    setOpLog([]);
    setList(defaultList);
    setPreList(defaultList);
    setTrace([]);
    setTraceIdx(-1);
    setMessage('Reset. Perform any operation — the Why panel will explain each step.');
    setMessageSeverity('info');
  };

  const progress =
    trace.length > 1 ? (Math.max(0, traceIdx) / (trace.length - 1)) * 100 : traceIdx >= 0 ? 100 : 0;

  return (
    <Stack sx={{ gap: 2 }}>
      {/* Inputs */}
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.25}>
        <TextField
          label="Value"
          size="small"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="e.g. 25"
          sx={{ maxWidth: 180 }}
        />
        <TextField
          label="Index"
          size="small"
          value={indexInput}
          onChange={(e) => setIndexInput(e.target.value)}
          placeholder="e.g. 2"
          sx={{ maxWidth: 180 }}
        />
      </Stack>

      {/* Operation buttons */}
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
        <Tooltip title="O(n)">
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleGet}
          >
            Get
          </Button>
        </Tooltip>
        <Tooltip title="O(n)">
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
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="O(1)">
          <Button
            size="small"
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handlePrepend}
          >
            Prepend
          </Button>
        </Tooltip>
        <Tooltip title="O(n)">
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<ArrowForwardRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleAppend}
          >
            Append
          </Button>
        </Tooltip>
        <Tooltip title="O(n)">
          <Button
            size="small"
            variant="outlined"
            color="info"
            startIcon={<AddRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleInsertAt}
          >
            Insert At
          </Button>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="O(1)">
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleDeleteHead}
          >
            Del Head
          </Button>
        </Tooltip>
        <Tooltip title="O(n)">
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleDeleteTail}
          >
            Del Tail
          </Button>
        </Tooltip>
        <Tooltip title="O(n)">
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleDeleteAt}
          >
            Del At
          </Button>
        </Tooltip>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Reset">
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

      {/* Animation controls — only shown after an op */}
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
              sx={{ textTransform: 'none', fontSize: '0.75rem', minWidth: 0, px: 1 }}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={stepForward}
              disabled={traceIdx >= trace.length - 1 || isPlaying}
              startIcon={<SkipNextRoundedIcon />}
              sx={{ textTransform: 'none', fontSize: '0.75rem', minWidth: 0, px: 1 }}
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

      {/* Two-column: list viz + why panel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <AnimatedLinkedList nodes={displayList} mode={listType.mode} traceStep={currentStep} />
        <WhyPanel step={currentStep} addresses={addresses} listLength={list.length} op={activeOp} />
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
        <StatCard label="Length" value={list.length} color="info" />
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
      <ComplexityTable activeOp={activeOp} />

      {/* Op log */}
      <OperationLog entries={opLog} />
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function LinkedListOperationsVisualization({ defaults = {} }) {
  const [activeTab, setActiveTab] = useState(0);
  const listType = LIST_TYPES[activeTab];

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
            {LIST_TYPES.map((t) => (
              <Tab
                key={t.id}
                label={t.label}
                sx={{ textTransform: 'none', minHeight: 40, py: 0.5 }}
              />
            ))}
          </Tabs>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
            {listType.description}
          </Typography>
        </Box>
        <ListPanel key={listType.id} listType={listType} defaults={defaults} />
      </Stack>
    </Paper>
  );
}
