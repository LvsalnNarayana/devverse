import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
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
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Alert, StatCard } from '../../shared';
import BasicTable from '../../shared/BasicTable';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BASE_ADDR = 0x1000;
const ELEM_SIZE = 4; // bytes per int

/** Contiguous address for index i — this is the KEY contrast with linked list */
const addr = (i) => `0x${(BASE_ADDR + i * ELEM_SIZE).toString(16).toUpperCase()}`;

const COMPLEXITY = {
  get: {
    label: 'Get',
    value: 'O(1)',
    color: 'success',
    note: 'base_addr + index × size — one arithmetic jump',
  },
  find: {
    label: 'Find',
    value: 'O(n)',
    color: 'warning',
    note: 'No index known — scan every element',
  },
  update: {
    label: 'Update',
    value: 'O(1)',
    color: 'success',
    note: 'Direct address write — same as Get',
  },
  push: {
    label: 'Push',
    value: 'O(1) amortized',
    color: 'success',
    note: 'Append to end — no shifting needed',
  },
  pop: {
    label: 'Pop',
    value: 'O(1) amortized',
    color: 'success',
    note: 'Decrement length — no shifting needed',
  },
  insert: {
    label: 'Insert',
    value: 'O(n)',
    color: 'warning',
    note: 'Shift every element after index right by one',
  },
  delete: {
    label: 'Delete',
    value: 'O(n)',
    color: 'warning',
    note: 'Shift every element after index left by one',
  },
};

const ALL_OPS = Object.entries(COMPLEXITY).map(([id, meta]) => ({ id, ...meta }));

const COMPLEXITY_COLUMNS = [
  { key: 'label', label: 'Operation', width: 120 },
  { key: 'value', label: 'Time', width: 140, mono: true },
  { key: 'note', label: 'Why' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDER
// Each step:
//   phase           'traverse'|'found'|'shift'|'relink'|'done'|'instant'
//   highlightIndex  current focus element
//   shiftRange      [from, to] indexes being shifted this step
//   visitedIndexes  elements already scanned (dimmed)
//   pointerLabel    label shown under highlighted element
//   codeSnippet     exact line executing
//   whyExplanation  fundamental reason this step must happen
//   message         human summary
// ─────────────────────────────────────────────────────────────────────────────
function buildTrace(op, arr, parsedIndex, parsedValue) {
  const n = arr.length;
  const steps = [];

  switch (op) {
    // ── O(1): GET ────────────────────────────────────────────────────────────
    case 'get':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: null,
        codeSnippet: `address = base + ${parsedIndex} × ${ELEM_SIZE}  // = ${addr(parsedIndex)}`,
        whyExplanation: `Arrays are contiguous. Element ${parsedIndex} always lives at base_addr + ${parsedIndex}×${ELEM_SIZE} = ${addr(parsedIndex)}. The CPU computes this in one instruction — no traversal, no searching.`,
        message: `Computing address: ${addr(0)} + ${parsedIndex}×${ELEM_SIZE} = ${addr(parsedIndex)}. One arithmetic operation.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: parsedIndex,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: 'arr[i]',
        codeSnippet: `return mem[${addr(parsedIndex)}]  // = ${arr[parsedIndex]}`,
        whyExplanation: `Direct memory read at ${addr(parsedIndex)}. No loop, no pointer chasing — O(1) regardless of array size. Compare: linked list get(${parsedIndex}) requires ${parsedIndex} pointer hops.`,
        message: `arr[${parsedIndex}] = ${arr[parsedIndex]} read directly from ${addr(parsedIndex)} — O(1).`,
      });
      break;

    // ── O(1): UPDATE ─────────────────────────────────────────────────────────
    case 'update':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: null,
        codeSnippet: `address = base + ${parsedIndex} × ${ELEM_SIZE}  // = ${addr(parsedIndex)}`,
        whyExplanation: `Same address formula as Get. We don't need to find the element — we already know exactly where it lives in memory.`,
        message: `Address formula: ${addr(0)} + ${parsedIndex}×${ELEM_SIZE} = ${addr(parsedIndex)}.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: parsedIndex,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: `← ${parsedValue}`,
        codeSnippet: `mem[${addr(parsedIndex)}] = ${parsedValue}  // overwrite`,
        whyExplanation: `Direct memory write at ${addr(parsedIndex)}. Old value ${arr[parsedIndex]} overwritten with ${parsedValue}. Single write — O(1). No other elements touched.`,
        message: `arr[${parsedIndex}]: ${arr[parsedIndex]} → ${parsedValue} written to ${addr(parsedIndex)} — O(1).`,
      });
      break;

    // ── O(1) amortized: PUSH ─────────────────────────────────────────────────
    case 'push':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: null,
        codeSnippet: `address = base + ${n} × ${ELEM_SIZE}  // = ${addr(n)}`,
        whyExplanation: `Push appends at index ${n}. Address is base + ${n}×${ELEM_SIZE} = ${addr(n)}. No elements need to move — we write past the end of the existing data.`,
        message: `New slot at [${n}] = ${addr(n)}. No shifting needed.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: n,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: `NEW: ${parsedValue}`,
        codeSnippet: `mem[${addr(n)}] = ${parsedValue}; length++`,
        whyExplanation: `Write ${parsedValue} at ${addr(n)}, increment length to ${n + 1}. O(1) amortized — when the buffer is full, reallocation doubles capacity (O(n)) but that's rare enough the average stays O(1).`,
        message: `${parsedValue} written to [${n}] at ${addr(n)}. Length ${n} → ${n + 1}. O(1) amortized.`,
      });
      break;

    // ── O(1) amortized: POP ──────────────────────────────────────────────────
    case 'pop':
      steps.push({
        phase: 'found',
        highlightIndex: n - 1,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: 'last',
        codeSnippet: `last = arr[${n - 1}]  // value = ${arr[n - 1]}`,
        whyExplanation: `Pop removes the last element. Its address is ${addr(n - 1)} — computed instantly. No other elements shift. Length simply decrements.`,
        message: `Last element arr[${n - 1}] = ${arr[n - 1]} at ${addr(n - 1)}. About to remove.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: null,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: null,
        codeSnippet: `length--  // ${arr[n - 1]} is now unreachable`,
        whyExplanation: `Decrementing length makes ${arr[n - 1]} unreachable — no data erased, no shifting. This is why pop is O(1): one decrement, zero element movement.`,
        message: `Length ${n} → ${n - 1}. ${arr[n - 1]} removed — O(1) amortized.`,
      });
      break;

    // ── O(n): FIND ───────────────────────────────────────────────────────────
    case 'find': {
      steps.push({
        phase: 'traverse',
        highlightIndex: 0,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: 'i=0',
        codeSnippet: `i = 0; arr[0] = ${arr[0]} at ${addr(0)}`,
        whyExplanation: `No index known for value ${parsedValue}. Even though addresses are contiguous, we have no formula to compute WHICH index holds this value — must check each one. Starting at [0].`,
        message: `arr[0] = ${arr[0]} — is it ${parsedValue}? ${arr[0] === parsedValue ? 'YES!' : 'No. Advance i.'}`,
      });
      const visited = [];
      let foundAt = -1;
      for (let i = 0; i < n; i++) {
        if (i > 0) {
          const isMatch = arr[i] === parsedValue;
          steps.push({
            phase: isMatch ? 'found' : 'traverse',
            highlightIndex: i,
            visitedIndexes: [...visited],
            shiftRange: null,
            pointerLabel: isMatch ? 'FOUND' : `i=${i}`,
            codeSnippet: isMatch
              ? `arr[${i}] === ${parsedValue}  // match at ${addr(i)}`
              : `arr[${i}] = ${arr[i]} ≠ ${parsedValue}; i++`,
            whyExplanation: isMatch
              ? `Found ${parsedValue} at index ${i} (${addr(i)}) after ${i + 1} comparison(s). Worst case: value at last index or absent — O(n) comparisons.`
              : `arr[${i}] = ${arr[i]} ≠ ${parsedValue}. Must check next element at ${addr(i + 1)}. No shortcut exists without a hash or sorted order.`,
            message: isMatch
              ? `arr[${i}] === ${parsedValue} at ${addr(i)} — found after ${i + 1} comparison(s)!`
              : `arr[${i}] = ${arr[i]} ≠ ${parsedValue}. i++ → check [${i + 1}].`,
          });
          if (isMatch) {
            foundAt = i;
            break;
          }
        }
        visited.push(i);
        if (i === n - 1 && foundAt === -1) {
          steps.push({
            phase: 'done',
            highlightIndex: null,
            visitedIndexes: Array.from({ length: n }, (_, k) => k),
            shiftRange: null,
            pointerLabel: null,
            codeSnippet: `i === n  // exhausted array`,
            whyExplanation: `Checked all ${n} elements — ${parsedValue} not present. This is O(n) worst case: every element visited before confirming absence.`,
            message: `${parsedValue} not found after checking all ${n} elements — O(n) worst case.`,
          });
        }
      }
      break;
    }

    // ── O(n): INSERT ─────────────────────────────────────────────────────────
    case 'insert': {
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: null,
        codeSnippet: `// insert ${parsedValue} at [${parsedIndex}] — must shift [${parsedIndex}..${n - 1}] right`,
        whyExplanation: `Arrays are contiguous. Every element at index ≥ ${parsedIndex} occupies addresses ${addr(parsedIndex)}–${addr(n - 1)}. To make room at [${parsedIndex}], ALL of them must physically move one slot right. This is unavoidable — you cannot leave gaps in contiguous memory.`,
        message: `Inserting at [${parsedIndex}]. Elements [${parsedIndex}..${n - 1}] must shift right — starting from the end to avoid overwriting.`,
      });
      // Animate each element shifting right, from the end backwards
      for (let i = n - 1; i >= parsedIndex; i--) {
        steps.push({
          phase: 'shift',
          highlightIndex: i,
          visitedIndexes: Array.from({ length: n - 1 - i }, (_, k) => n - 1 - k),
          shiftRange: [i, i + 1],
          pointerLabel: `→ [${i + 1}]`,
          codeSnippet: `arr[${i + 1}] = arr[${i}]  // ${arr[i]} moves ${addr(i)} → ${addr(i + 1)}`,
          whyExplanation: `arr[${i}] = ${arr[i]} at ${addr(i)} must move to ${addr(i + 1)}. Each element occupies exactly ${ELEM_SIZE} bytes — the shift is a memory copy, not a pointer update. ${n - i} more element(s) to shift.`,
          message: `Shifting arr[${i}] = ${arr[i]} from ${addr(i)} → ${addr(i + 1)}. (${i - parsedIndex} more after this.)`,
        });
      }
      steps.push({
        phase: 'done',
        highlightIndex: parsedIndex,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: `NEW: ${parsedValue}`,
        codeSnippet: `arr[${parsedIndex}] = ${parsedValue}; length++`,
        whyExplanation: `Slot [${parsedIndex}] at ${addr(parsedIndex)} is now free. Write ${parsedValue} and increment length. Total: ${n - parsedIndex} element(s) shifted + 1 write = O(n).`,
        message: `${parsedValue} written to [${parsedIndex}] at ${addr(parsedIndex)}. ${n - parsedIndex} shift(s) + 1 write — O(n).`,
      });
      break;
    }

    // ── O(n): DELETE ─────────────────────────────────────────────────────────
    case 'delete': {
      steps.push({
        phase: 'found',
        highlightIndex: parsedIndex,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: `del: ${arr[parsedIndex]}`,
        codeSnippet: `// delete arr[${parsedIndex}] = ${arr[parsedIndex]} at ${addr(parsedIndex)}`,
        whyExplanation: `Removing arr[${parsedIndex}] = ${arr[parsedIndex]}. Arrays must stay contiguous — no gaps allowed. Every element at index > ${parsedIndex} must shift left to fill the hole at ${addr(parsedIndex)}.`,
        message: `Deleting arr[${parsedIndex}] = ${arr[parsedIndex]}. Elements [${parsedIndex + 1}..${n - 1}] must shift left.`,
      });
      for (let i = parsedIndex + 1; i < n; i++) {
        steps.push({
          phase: 'shift',
          highlightIndex: i,
          visitedIndexes: Array.from({ length: i - parsedIndex - 1 }, (_, k) => parsedIndex + k),
          shiftRange: [i, i - 1],
          pointerLabel: `← [${i - 1}]`,
          codeSnippet: `arr[${i - 1}] = arr[${i}]  // ${arr[i]} moves ${addr(i)} → ${addr(i - 1)}`,
          whyExplanation: `arr[${i}] = ${arr[i]} at ${addr(i)} shifts left to ${addr(i - 1)} to close the gap. ${n - i} more element(s) to shift after this.`,
          message: `Shifting arr[${i}] = ${arr[i]} from ${addr(i)} → ${addr(i - 1)}. (${n - 1 - i} more.)`,
        });
      }
      steps.push({
        phase: 'done',
        highlightIndex: null,
        visitedIndexes: [],
        shiftRange: null,
        pointerLabel: null,
        codeSnippet: `length--  // was ${n}, now ${n - 1}`,
        whyExplanation: `All ${n - parsedIndex - 1} element(s) shifted left. Length decremented. Total work = number of elements after deleted index = O(n) worst case (deleting index 0).`,
        message: `Delete complete. ${n - parsedIndex - 1} shift(s). Length ${n} → ${n - 1} — O(n).`,
      });
      break;
    }

    default:
      break;
  }

  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY PANEL — explains each step fundamentally
// ─────────────────────────────────────────────────────────────────────────────
function WhyPanel({ step, arrLength, op }) {
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

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      {/* Phase + pointer chip */}
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

      {/* Code line */}
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

      {/* WHY */}
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

      {/* Contiguous memory strip — the contrast to linked list's scattered addresses */}
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
          Contiguous heap memory (why the formula works)
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {Array.from({ length: arrLength }, (_, i) => {
            const isHighlight = i === step.highlightIndex;
            const isVisited = step.visitedIndexes?.includes(i);
            const isShift = step.shiftRange && i === step.shiftRange[0];
            const c = isHighlight
              ? phaseColor
              : isShift
                ? theme.palette.warning.main
                : isVisited
                  ? alpha(theme.palette.text.secondary, 0.4)
                  : 'divider';
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
                  bgcolor: isHighlight || isShift ? alpha(c, isDark ? 0.2 : 0.1) : 'transparent',
                  color: isHighlight || isShift ? c : 'text.disabled',
                  transition: 'all 200ms ease',
                }}
              >
                [{i}]={addr(i)}
              </Box>
            );
          })}
        </Box>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 0.5, display: 'block', fontSize: '0.6rem' }}
        >
          Contiguous +{ELEM_SIZE}B steps — base+i×{ELEM_SIZE} always valid
        </Typography>
      </Box>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED ARRAY VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedArray({ arr, traceStep }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

  const highlightIndex = traceStep?.highlightIndex ?? -1;
  const visitedIndexes = traceStep?.visitedIndexes ?? [];
  const shiftRange = traceStep?.shiftRange ?? null;
  const phase = traceStep?.phase ?? null;
  const pointerLabel = traceStep?.pointerLabel ?? null;

  const cellColor = (idx) => {
    if (idx === highlightIndex) {
      if (phase === 'found' || phase === 'done') return success;
      if (phase === 'shift') return warning;
      return primary;
    }
    if (shiftRange && idx === shiftRange[0]) return warning;
    if (visitedIndexes.includes(idx)) return alpha(theme.palette.text.secondary, 0.35);
    return 'divider';
  };

  const cellBg = (idx) => {
    const c = cellColor(idx);
    if (idx === highlightIndex || (shiftRange && idx === shiftRange[0]))
      return alpha(c, isDark ? 0.2 : 0.1);
    if (visitedIndexes.includes(idx)) return alpha(theme.palette.text.primary, 0.02);
    return alpha(theme.palette.text.primary, 0.03);
  };

  const cellOpacity = (idx) => (visitedIndexes.includes(idx) && idx !== highlightIndex ? 0.45 : 1);

  if (!arr.length) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
        <Typography color="text.secondary">Array is empty.</Typography>
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
        Array — Live State
      </Typography>
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 0, alignItems: 'flex-end', minWidth: 'max-content' }}>
          {arr.map((val, idx) => {
            const color = cellColor(idx);
            const isShiftSrc = shiftRange && idx === shiftRange[0];
            const isHighlight = idx === highlightIndex;

            return (
              <Box
                key={idx}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* Shift arrow above cell */}
                <Box
                  sx={{
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isShiftSrc && shiftRange && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.65rem',
                        color: warning,
                        fontWeight: 700,
                      }}
                    >
                      {shiftRange[1] > shiftRange[0] ? '→' : '←'}
                    </Typography>
                  )}
                </Box>

                {/* Cell */}
                <Box
                  sx={{
                    width: 58,
                    height: 46,
                    border: '2px solid',
                    borderColor: color,
                    borderRight: idx < arr.length - 1 ? '1px solid' : '2px solid',
                    borderRightColor: 'divider',
                    bgcolor: cellBg(idx),
                    opacity: cellOpacity(idx),
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: isHighlight ? color : 'text.primary',
                    transition: 'all 200ms ease',
                    boxShadow: isHighlight ? `0 0 0 3px ${alpha(color, 0.25)}` : 'none',
                    // Shift source gets dashed right border
                    ...(isShiftSrc ? { borderStyle: 'dashed' } : {}),
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

                {/* Index */}
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                >
                  [{idx}]
                </Typography>

                {/* Address */}
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: 'monospace', fontSize: '0.55rem', mt: 0.25 }}
                >
                  {addr(idx)}
                </Typography>
              </Box>
            );
          })}
        </Box>
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
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 46 }}
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
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ArrayOperationsVisualization({ defaults = {}, onHighlightChange }) {
  const initial = useMemo(() => {
    if (Array.isArray(defaults.initialArray)) return defaults.initialArray;
    return [10, 20, 30, 40];
  }, [defaults.initialArray]);

  const defaultArr = initial.length ? initial : [10, 20, 30, 40];

  const [arr, setArr] = useState(defaultArr);
  const [preArr, setPreArr] = useState(defaultArr); // snapshot before op — for manual replay
  const [valueInput, setValueInput] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [message, setMessage] = useState(
    'Try any operation — the Why panel explains each step as it animates.',
  );
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [activeOp, setActiveOp] = useState(null);
  const [opLog, setOpLog] = useState([]);

  // Animation
  const [trace, setTrace] = useState([]);
  const [traceIdx, setTraceIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const currentStep = trace[traceIdx] ?? null;
  const isLastStep = traceIdx === trace.length - 1;
  const onDoneStep = currentStep?.phase === 'done';

  // During manual step-through: show preArr until the done step
  // During autoplay or after: show arr (post-op)
  const displayArr = isPlaying || traceIdx < 0 || isLastStep || onDoneStep ? arr : preArr;

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
      }, 800);
    },
    [stopAnim],
  );

  const stepForward = () => setTraceIdx((i) => Math.min(i + 1, trace.length - 1));
  const stepBackward = () => setTraceIdx((i) => Math.max(i - 1, 0));

  const runOp = (op, nextArr, desc, logDetail, severity = 'success') => {
    stopAnim();
    setActiveOp(op);
    setPreArr([...arr]); // snapshot before mutation
    const t = buildTrace(op, arr, parsedIndex, parsedValue); // trace uses pre-op arr
    setTrace(t);
    setTraceIdx(-1);
    setArr(nextArr);
    setMessage(desc);
    setMessageSeverity(severity);
    setOpLog((prev) =>
      [{ op: COMPLEXITY[op]?.label ?? op, detail: logDetail, steps: t.length }, ...prev].slice(
        0,
        8,
      ),
    );
    onHighlightChange?.(null);
    startAnim(t);
  };

  const setError = (msg) => {
    setMessage(msg);
    setMessageSeverity('error');
  };

  // ── Operations ─────────────────────────────────────────────────────────────
  const handleGet = () => {
    if (Number.isNaN(parsedIndex)) return setError('Get needs a valid index.');
    if (parsedIndex < 0 || parsedIndex >= arr.length)
      return setError(`Index out of bounds. Valid range: 0–${arr.length - 1}.`);
    runOp(
      'get',
      arr,
      `arr[${parsedIndex}] = ${arr[parsedIndex]}. Watch Why panel show direct address jump — O(1).`,
      `arr[${parsedIndex}] → ${arr[parsedIndex]}`,
    );
  };

  const handleFind = () => {
    if (Number.isNaN(parsedValue)) return setError('Find needs a valid value.');
    const idx = arr.indexOf(parsedValue);
    runOp(
      'find',
      arr,
      idx === -1
        ? `${parsedValue} not found. Scanned all ${arr.length} elements — O(n). Watch Why panel.`
        : `Found ${parsedValue} at [${idx}]. Watch Why panel show each comparison — O(n).`,
      idx === -1 ? `${parsedValue} → not found` : `${parsedValue} → [${idx}]`,
      idx === -1 ? 'warning' : 'success',
    );
  };

  const handleUpdate = () => {
    if (Number.isNaN(parsedIndex) || Number.isNaN(parsedValue))
      return setError('Update needs both value and index.');
    if (parsedIndex < 0 || parsedIndex >= arr.length)
      return setError(`Index out of bounds. Valid range: 0–${arr.length - 1}.`);
    const next = [...arr];
    next[parsedIndex] = parsedValue;
    runOp(
      'update',
      next,
      `arr[${parsedIndex}] updated to ${parsedValue}. Watch Why panel show direct write — O(1).`,
      `arr[${parsedIndex}]: ${arr[parsedIndex]} → ${parsedValue}`,
    );
  };

  const handlePush = () => {
    if (Number.isNaN(parsedValue)) return setError('Push needs a valid value.');
    const next = [...arr, parsedValue];
    runOp(
      'push',
      next,
      `Pushed ${parsedValue} at [${arr.length}]. No shifting — watch Why panel.`,
      `arr[${arr.length}] ← ${parsedValue}`,
    );
  };

  const handlePop = () => {
    if (!arr.length) return setError('Array is empty — nothing to pop.');
    const removed = arr[arr.length - 1];
    const next = arr.slice(0, -1);
    runOp(
      'pop',
      next,
      `Popped ${removed}. No shifting — watch Why panel show O(1).`,
      `removed ${removed} from [${arr.length - 1}]`,
    );
  };

  const handleInsert = () => {
    if (Number.isNaN(parsedIndex) || Number.isNaN(parsedValue))
      return setError('Insert needs both value and index.');
    if (parsedIndex < 0 || parsedIndex > arr.length)
      return setError(`Index must be 0–${arr.length}.`);
    const next = [...arr];
    next.splice(parsedIndex, 0, parsedValue);
    runOp(
      'insert',
      next,
      `Inserting ${parsedValue} at [${parsedIndex}]. Watch every shift step in the Why panel — O(n).`,
      `arr[${parsedIndex}] ← ${parsedValue}, len ${arr.length} → ${next.length}`,
    );
  };

  const handleDelete = () => {
    if (Number.isNaN(parsedIndex)) return setError('Delete needs a valid index.');
    if (parsedIndex < 0 || parsedIndex >= arr.length)
      return setError(`Index out of bounds. Valid range: 0–${arr.length - 1}.`);
    const removed = arr[parsedIndex];
    const next = [...arr];
    next.splice(parsedIndex, 1);
    runOp(
      'delete',
      next,
      `Deleting arr[${parsedIndex}] = ${removed}. Watch each left-shift in Why panel — O(n).`,
      `arr[${parsedIndex}]=${removed} removed, len → ${next.length}`,
    );
  };

  const handleReset = () => {
    stopAnim();
    setActiveOp(null);
    setOpLog([]);
    setArr(defaultArr);
    setPreArr(defaultArr);
    setTrace([]);
    setTraceIdx(-1);
    setMessage('Reset. Try any operation — Why panel explains each step.');
    setMessageSeverity('info');
    onHighlightChange?.(null);
  };

  const progress =
    trace.length > 1 ? (Math.max(0, traceIdx) / (trace.length - 1)) * 100 : traceIdx >= 0 ? 100 : 0;

  // Complexity table rows — active op gets row.highlight + toned value cell
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
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Stack sx={{ gap: 2 }}>
        {/* ── Inputs ── */}
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

        {/* ── Buttons ── */}
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
          <Tooltip title="O(1) — direct address jump">
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
          <Tooltip title="O(n) — linear scan">
            <Button
              size="small"
              variant="outlined"
              startIcon={<SearchRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handleFind}
            >
              Find
            </Button>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <Tooltip title="O(1) — direct address write">
            <Button
              size="small"
              variant="outlined"
              color="info"
              startIcon={<EditRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Tooltip>
          <Tooltip title="O(1) amortized — append to end">
            <Button
              size="small"
              variant="contained"
              startIcon={<ArrowDownwardRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handlePush}
            >
              Push
            </Button>
          </Tooltip>
          <Tooltip title="O(1) amortized — remove from end">
            <Button
              size="small"
              variant="outlined"
              startIcon={<ArrowUpwardRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handlePop}
            >
              Pop
            </Button>
          </Tooltip>
          <Tooltip title="O(n) — shifts elements right">
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<AddRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handleInsert}
            >
              Insert
            </Button>
          </Tooltip>
          <Tooltip title="O(n) — shifts elements left">
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<DeleteOutlineRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Tooltip>

          <Box sx={{ flex: 1 }} />

          <Tooltip title="Reset to initial array">
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

        {/* ── Message ── */}
        <Alert severity={messageSeverity}>{message}</Alert>

        {/* ── Animation controls ── */}
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

        {/* ── Two column: array viz + why panel ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <AnimatedArray arr={displayArr} traceStep={currentStep} />
          <WhyPanel step={currentStep} arrLength={displayArr.length} op={activeOp} />
        </Box>

        {/* ── Stats ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
          <StatCard label="Length" value={arr.length} color="info" />
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

        {/* ── Complexity table — using BasicTable ── */}
        <BasicTable
          columns={COMPLEXITY_COLUMNS}
          rows={complexityRows}
          dense
          striped
          hover={false}
          tableVariant="comparison"
          caption="Active operation is highlighted. Green = O(1), yellow = O(n)."
        />

        {/* ── Operation log ── */}
        <OperationLog entries={opLog} />

        <Typography variant="caption" color="text.secondary">
          O(1) ops jump directly to memory via base+i×size. O(n) ops must scan or shift — cost grows
          linearly. Step through the Why panel to see exactly which memory addresses are touched.
        </Typography>
      </Stack>
    </Paper>
  );
}
