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
const BASE_ADDR = 0x2000;
const ELEM_SIZE = 4;
const addr = (i) => `0x${(BASE_ADDR + i * ELEM_SIZE).toString(16).toUpperCase()}`;

const COMPLEXITY = {
  push: {
    label: 'Push',
    value: 'O(1)',
    color: 'success',
    note: 'Add to top — just write at stack[size] and increment size pointer',
  },
  pop: {
    label: 'Pop',
    value: 'O(1)',
    color: 'success',
    note: 'Remove from top — read stack[size-1] and decrement size pointer',
  },
  peek: {
    label: 'Peek',
    value: 'O(1)',
    color: 'success',
    note: 'Read top without removing — direct access to stack[size-1]',
  },
  isEmpty: {
    label: 'isEmpty',
    value: 'O(1)',
    color: 'success',
    note: 'Check size === 0 — one comparison, no traversal',
  },
  search: {
    label: 'Search',
    value: 'O(n)',
    color: 'warning',
    note: 'LIFO — no index, no address formula for values — must scan from top',
  },
  clear: {
    label: 'Clear',
    value: 'O(n)',
    color: 'warning',
    note: 'Each element must be individually removed — n pops',
  },
};

const ALL_OPS = Object.entries(COMPLEXITY).map(([id, m]) => ({ id, ...m }));

const COMPLEXITY_COLUMNS = [
  { key: 'label', label: 'Operation', width: 100 },
  { key: 'value', label: 'Time', width: 110, mono: true },
  { key: 'note', label: 'Why' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDER
// Stack is implemented as an array with a `top` pointer = size - 1.
// Steps:
//   phase: 'instant'|'traverse'|'found'|'shift'|'done'
//   highlightIndex   — which element is focused (0-based from bottom)
//   visitedIndexes   — elements already scanned (dimmed)
//   dimIndexes       — elements being cleared
//   pointerLabel     — label shown on highlighted element
//   codeSnippet      — exact line executing
//   whyExplanation   — fundamental reason this step must happen
//   message          — human summary
// ─────────────────────────────────────────────────────────────────────────────
function buildTrace(op, values, parsedValue) {
  const n = values.length;
  const top = n - 1;
  const steps = [];

  switch (op) {
    // ── O(1): PUSH ───────────────────────────────────────────────────────────
    case 'push':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `address = base + ${n} × ${ELEM_SIZE}  →  ${addr(n)}`,
        whyExplanation: `The top pointer holds the current size (${n}). The new element's address is always base + size × ${ELEM_SIZE} = ${addr(n)} — computed in one instruction. No scan needed.`,
        message: `New slot at [${n}] = ${addr(n)}. top pointer will move from ${n - 1} → ${n}.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: n,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `TOP ← ${parsedValue}`,
        codeSnippet: `stack[${n}] = ${parsedValue}; top++`,
        whyExplanation: `Write ${parsedValue} at ${addr(n)}, increment top to ${n}. Two operations — always two, never more. O(1) regardless of stack size.`,
        message: `${parsedValue} pushed at [${n}] (${addr(n)}). top = ${n}. O(1) done.`,
      });
      break;

    // ── O(1): POP ────────────────────────────────────────────────────────────
    case 'pop':
      steps.push({
        phase: 'found',
        highlightIndex: top,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `TOP = ${values[top]}`,
        codeSnippet: `val = stack[top]  // stack[${top}] at ${addr(top)} = ${values[top]}`,
        whyExplanation: `top pointer directly gives us the address: base + ${top} × ${ELEM_SIZE} = ${addr(top)}. No traversal — we know exactly where the top element lives.`,
        message: `top = ${top}. Reading stack[${top}] = ${values[top]} at ${addr(top)} directly.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `top--  // top: ${top} → ${top - 1}`,
        whyExplanation: `Decrement top pointer. ${values[top]} is now unreachable (memory not cleared — just inaccessible). Zero element shifts, zero scanning — O(1).`,
        message: `top decremented: ${top} → ${top - 1}. ${values[top]} removed. O(1).`,
      });
      break;

    // ── O(1): PEEK ───────────────────────────────────────────────────────────
    case 'peek':
      steps.push({
        phase: 'instant',
        highlightIndex: null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: null,
        codeSnippet: `address = base + ${top} × ${ELEM_SIZE}  →  ${addr(top)}`,
        whyExplanation: `Peek reads the top element without removing it. Address = base + top × ${ELEM_SIZE} = ${addr(top)}. Computed instantly from the top pointer.`,
        message: `top pointer = ${top}. Computing address: ${addr(0)} + ${top}×${ELEM_SIZE} = ${addr(top)}.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: top,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `TOP = ${values[top]}`,
        codeSnippet: `return stack[${top}]  // ${values[top]}, top unchanged`,
        whyExplanation: `Direct read at ${addr(top)}. top stays at ${top} — stack is unchanged. One memory read, no modification — O(1).`,
        message: `Peek → ${values[top]} at ${addr(top)}. Stack untouched. O(1).`,
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
        codeSnippet: `return top === -1  // top is currently ${top}`,
        whyExplanation: `isEmpty is a single integer comparison — top === -1. No elements examined, no memory read. This is always O(1) regardless of stack size.`,
        message: `top = ${top}. top === -1 → ${top === -1}. Stack is ${top === -1 ? 'empty' : 'not empty'}.`,
      });
      steps.push({
        phase: 'done',
        highlightIndex: top >= 0 ? top : null,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: top >= 0 ? `top=${top}` : null,
        codeSnippet: `// result: ${top === -1 ? 'true — stack empty' : `false — ${n} element(s) present`}`,
        whyExplanation: `Comparison complete. No matter if the stack has 0 or 1,000,000 elements, this check takes exactly one comparison — O(1).`,
        message: `isEmpty → ${top === -1}. ${top === -1 ? 'Stack is empty.' : `${n} element(s) in stack.`}`,
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
        codeSnippet: `i = top  // begin scan at top [${top}], looking for ${parsedValue}`,
        whyExplanation: `Stack search MUST start at the top and scan downward. There is no value-to-address mapping — we cannot compute which index holds ${parsedValue}. Must check each element.`,
        message: `Starting search for ${parsedValue} from top [${top}]. No shortcut — must scan downward.`,
      });
      const visited = [];
      let foundAt = -1;
      for (let i = top; i >= 0; i--) {
        const isMatch = values[i] === parsedValue;
        const posFromTop = top - i + 1;
        steps.push({
          phase: isMatch ? 'found' : 'traverse',
          highlightIndex: i,
          visitedIndexes: [...visited],
          dimIndexes: [],
          pointerLabel: isMatch ? 'FOUND' : `scan: ${values[i]}`,
          codeSnippet: isMatch
            ? `stack[${i}] === ${parsedValue}  // match at ${addr(i)}`
            : `stack[${i}] = ${values[i]} ≠ ${parsedValue}; i--`,
          whyExplanation: isMatch
            ? `Found ${parsedValue} at index ${i}, position ${posFromTop} from top. Visited ${posFromTop} element(s). Worst case: bottom or absent — O(n).`
            : `stack[${i}] = ${values[i]} ≠ ${parsedValue}. No shortcut — must check element below at ${i > 0 ? addr(i - 1) : 'bottom'}. LIFO gives no search benefit.`,
          message: isMatch
            ? `stack[${i}] === ${parsedValue} at ${addr(i)} — found at position ${posFromTop} from top!`
            : `stack[${i}] = ${values[i]} ≠ ${parsedValue}. i-- → ${i > 0 ? `check [${i - 1}]` : 'end of stack'}.`,
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
          codeSnippet: `i < 0  // exhausted stack`,
          whyExplanation: `Scanned all ${n} elements from top to bottom — ${parsedValue} not present. O(n) worst case confirmed: every element visited.`,
          message: `${parsedValue} not found after scanning all ${n} element(s) — O(n).`,
        });
      }
      break;
    }

    // ── O(n): CLEAR ──────────────────────────────────────────────────────────
    case 'clear': {
      steps.push({
        phase: 'traverse',
        highlightIndex: top,
        visitedIndexes: [],
        dimIndexes: [],
        pointerLabel: `top=${top}`,
        codeSnippet: `while (top >= 0) pop()  // ${n} pop(s) needed`,
        whyExplanation: `Clear must remove every element individually. With ${n} element(s) in the stack, that's ${n} pop operation(s). Total work = O(n) — linear in stack size.`,
        message: `Starting clear. ${n} element(s) to remove. Popping from top [${top}]...`,
      });
      const dimSoFar = [];
      for (let i = top; i >= 0; i--) {
        dimSoFar.push(i);
        steps.push({
          phase: i === 0 ? 'done' : 'shift',
          highlightIndex: i > 0 ? i - 1 : null,
          visitedIndexes: [],
          dimIndexes: [...dimSoFar],
          pointerLabel: i > 0 ? `top=${i - 1}` : null,
          codeSnippet: `pop()  // removed stack[${i}] = ${values[i]}; top → ${i - 1}`,
          whyExplanation:
            i > 0
              ? `Removed stack[${i}] = ${values[i]}. top decremented to ${i - 1}. ${i} element(s) remaining. Each requires its own pop — cannot batch-clear in O(1).`
              : `Last element removed. top = -1. Stack is now empty. Total: ${n} pop(s) = O(n).`,
          message:
            i > 0
              ? `Popped ${values[i]} (${n - i} of ${n}). ${i} remaining.`
              : `Popped ${values[0]} (${n} of ${n}). Stack empty. O(n) clear done.`,
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
function WhyPanel({ step, values, op }) {
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
  const top = n - 1;

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

      {/* Stack memory layout — contiguous like array, but only top is accessible */}
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
            Stack memory — only top is accessible
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {values.map((_, i) => {
              const isHighlight = i === step.highlightIndex;
              const isVisited = step.visitedIndexes?.includes(i);
              const isDimmed = step.dimIndexes?.includes(i);
              const isTopSlot = i === top;
              const c = isHighlight
                ? phaseColor
                : isTopSlot
                  ? theme.palette.primary.main
                  : isVisited
                    ? alpha(theme.palette.text.secondary, 0.4)
                    : isDimmed
                      ? alpha(theme.palette.error.main, 0.4)
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
                    bgcolor:
                      isHighlight || isTopSlot ? alpha(c, isDark ? 0.2 : 0.1) : 'transparent',
                    color:
                      isHighlight || isTopSlot
                        ? c
                        : isDimmed
                          ? alpha(theme.palette.error.main, 0.5)
                          : 'text.disabled',
                    transition: 'all 200ms ease',
                    textDecoration: isDimmed ? 'line-through' : 'none',
                  }}
                >
                  [{i}]={addr(i)}
                  {isTopSlot ? ' ← TOP' : ''}
                </Box>
              );
            })}
          </Box>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mt: 0.5, display: 'block', fontSize: '0.6rem' }}
          >
            top pointer = {top} — only stack[top] is directly accessible
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED STACK VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedStack({ values, traceStep }) {
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

  const top = values.length - 1;

  const cellColor = (idx) => {
    if (idx === highlightIndex) {
      if (phase === 'found' || phase === 'done') return success;
      if (phase === 'shift') return warning;
      return primary;
    }
    if (dimIndexes.includes(idx)) return error;
    if (visitedIndexes.includes(idx)) return alpha(theme.palette.text.secondary, 0.35);
    if (idx === top) return primary;
    return 'divider';
  };

  const cellBg = (idx) => {
    if (dimIndexes.includes(idx)) return alpha(error, isDark ? 0.1 : 0.05);
    if (idx === highlightIndex) return alpha(cellColor(idx), isDark ? 0.2 : 0.1);
    if (idx === top && !visitedIndexes.includes(idx) && idx !== highlightIndex)
      return alpha(primary, isDark ? 0.08 : 0.04);
    return alpha(theme.palette.text.primary, 0.03);
  };

  const cellOpacity = (idx) => (visitedIndexes.includes(idx) && idx !== highlightIndex ? 0.4 : 1);

  if (!values.length) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          [ Empty stack ]
        </Typography>
      </Paper>
    );
  }

  // Render top-to-bottom (top of stack at visual top)
  const reversed = [...values].map((v, i) => ({ value: v, origIdx: i })).reverse();

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        Stack (LIFO) — Live State
      </Typography>

      {/* Open top */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, opacity: 0.5 }}>
        <Box sx={{ flex: 1, borderTop: '2px dashed', borderColor: 'divider' }} />
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
        >
          ↑ PUSH / POP (top is open)
        </Typography>
        <Box sx={{ flex: 1, borderTop: '2px dashed', borderColor: 'divider' }} />
      </Box>

      <Stack sx={{ gap: 0.5 }}>
        {reversed.map(({ value, origIdx }) => {
          const isTop = origIdx === top;
          const isHighlight = origIdx === highlightIndex;
          const isDim = dimIndexes.includes(origIdx);
          const isVisited = visitedIndexes.includes(origIdx);
          const color = cellColor(origIdx);

          return (
            <Box key={origIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* TOP label */}
              <Box sx={{ width: 40, textAlign: 'right', flexShrink: 0 }}>
                {isTop && !isDim && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.6rem',
                      color: isHighlight ? color : primary,
                    }}
                  >
                    TOP→
                  </Typography>
                )}
              </Box>

              {/* Cell */}
              <Box
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  border: '1.5px solid',
                  borderColor: color,
                  bgcolor: cellBg(origIdx),
                  opacity: cellOpacity(origIdx),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 220ms ease',
                  boxShadow: isHighlight ? `0 0 0 3px ${alpha(color, 0.2)}` : 'none',
                  textDecoration: isDim ? 'line-through' : 'none',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: isHighlight ? color : isDim ? error : 'text.primary',
                    transition: 'color 220ms ease',
                  }}
                >
                  {String(value)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {isHighlight && pointerLabel && (
                    <Chip
                      label={pointerLabel}
                      size="small"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        height: 18,
                        bgcolor: alpha(color, 0.15),
                        color,
                        border: `1px solid ${alpha(color, 0.4)}`,
                      }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                  >
                    [{origIdx}] {addr(origIdx)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* Closed bottom */}
      <Box
        sx={{
          mt: 0.5,
          height: 4,
          borderRadius: 1,
          bgcolor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.08),
        }}
      />
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
      >
        ⊥ bottom (closed)
      </Typography>
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
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 52 }}
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
export default function StackOperationsVisualization({ defaults = {}, onHighlightChange }) {
  const initial = useMemo(() => {
    if (Array.isArray(defaults.initialValues)) return defaults.initialValues;
    return [10, 20, 30];
  }, [defaults.initialValues]);

  const defaultValues = initial.length ? initial : [10, 20, 30];

  const [values, setValues] = useState(defaultValues);
  const [preValues, setPreValues] = useState(defaultValues);
  const [valueInput, setValueInput] = useState('');
  const [message, setMessage] = useState(
    'Push, Pop, Peek, or Search — Why panel explains each step.',
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

  // Pre-op snapshot for manual replay — shows the removed element until done step
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
    const t = buildTrace(op, values, parsedValue);
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
    onHighlightChange?.(null);
    startAnim(t);
  };

  const setError = (msg) => {
    setMessage(msg);
    setMessageSeverity('error');
  };

  // ── Operations ──────────────────────────────────────────────────────────────
  const handlePush = () => {
    if (Number.isNaN(parsedValue)) return setError('Push needs a valid integer value.');
    const next = [...values, parsedValue];
    runOp(
      'push',
      next,
      `Pushed ${parsedValue}. Watch Why panel show direct address write — O(1).`,
      `${parsedValue} → top [${values.length}]`,
    );
  };

  const handlePop = () => {
    if (!values.length) return setError('Stack underflow — nothing to pop.');
    const removed = values[values.length - 1];
    const next = values.slice(0, -1);
    runOp(
      'pop',
      next,
      `Popped ${removed}. Watch Why panel show top pointer decrement — O(1).`,
      `removed ${removed}, size → ${next.length}`,
    );
  };

  const handlePeek = () => {
    if (!values.length) return setError('Stack is empty — nothing to peek.');
    runOp(
      'peek',
      values,
      `Peek → top = ${values[values.length - 1]}. Watch Why panel show direct read — O(1).`,
      `top = ${values[values.length - 1]}`,
    );
  };

  const handleIsEmpty = () => {
    runOp(
      'isEmpty',
      values,
      values.length === 0
        ? 'isEmpty → true. Watch Why panel show single comparison — O(1).'
        : `isEmpty → false. ${values.length} element(s) present. Watch Why panel.`,
      values.length === 0 ? 'true' : `false (size ${values.length})`,
      values.length === 0 ? 'warning' : 'success',
    );
  };

  const handleSearch = () => {
    if (Number.isNaN(parsedValue)) return setError('Search needs a valid integer value.');
    const fromTop = [...values].reverse().indexOf(parsedValue);
    runOp(
      'search',
      values,
      fromTop === -1
        ? `${parsedValue} not found. Watch Why panel scan each element — O(n).`
        : `Found ${parsedValue} at position ${fromTop + 1} from top. Watch Why panel scan down — O(n).`,
      fromTop === -1
        ? `${parsedValue} → not found`
        : `${parsedValue} → pos ${fromTop + 1} from top`,
      fromTop === -1 ? 'warning' : 'success',
    );
  };

  const handleClear = () => {
    const size = values.length;
    runOp(
      'clear',
      [],
      `Cleared all ${size} element(s). Watch Why panel pop each one — O(n).`,
      `removed ${size} element(s)`,
      'info',
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
    setMessage('Reset. Push, Pop, Peek, or Search — Why panel explains each step.');
    setMessageSeverity('info');
    onHighlightChange?.(null);
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
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
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
          <Tooltip title="O(1) — write to top slot">
            <Button
              size="small"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handlePush}
            >
              Push
            </Button>
          </Tooltip>
          <Tooltip title="O(1) — read and remove top">
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<RemoveRoundedIcon />}
              sx={{ textTransform: 'none' }}
              onClick={handlePop}
            >
              Pop
            </Button>
          </Tooltip>
          <Tooltip title="O(1) — read top without removing">
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
          <Tooltip title="O(n) — scan from top downward">
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
          <Tooltip title="O(n) — n individual pops">
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

        {/* Two column: stack viz + why panel */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <AnimatedStack values={displayValues} traceStep={currentStep} />
          <WhyPanel step={currentStep} values={displayValues} op={activeOp} />
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
          <StatCard label="Size" value={values.length} color="info" />
          <StatCard
            label="Top"
            value={values.length ? values[values.length - 1] : '∅'}
            color="primary"
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
          caption="Active operation highlighted. Green = O(1), yellow = O(n)."
          sx={{ mt: 0, mb: 0 }}
        />

        {/* Operation log */}
        <OperationLog entries={opLog} />

        <Typography variant="caption" color="text.secondary">
          Stack LIFO — all core ops (push, pop, peek) are O(1) because only the top is ever touched.
          Search and clear are O(n) — must visit every element. Step through Why panel to see
          exactly why.
        </Typography>
      </Stack>
    </Paper>
  );
}
