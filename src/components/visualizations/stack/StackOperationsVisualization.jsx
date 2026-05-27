import { useMemo, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LayersClearRoundedIcon from '@mui/icons-material/LayersClearRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Alert, StatCard } from '../../shared';
import VisualizationRenderer from '../VisualizationRenderer';

const parseValues = (raw) =>
  String(raw ?? '')
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));

const COMPLEXITY = {
  push: {
    label: 'Push',
    value: 'O(1)',
    color: 'success',
    note: 'Adds to top — no shifting needed',
  },
  pop: { label: 'Pop', value: 'O(1)', color: 'success', note: 'Removes from top — direct access' },
  peek: { label: 'Peek', value: 'O(1)', color: 'success', note: 'Reads top without removing it' },
  isEmpty: { label: 'isEmpty', value: 'O(1)', color: 'success', note: 'Checks if size === 0' },
  search: {
    label: 'Search',
    value: 'O(n)',
    color: 'warning',
    note: 'Must scan from top to bottom',
  },
  clear: { label: 'Clear', value: 'O(n)', color: 'warning', note: 'Removes all n elements' },
};

const ALL_OPS = ['push', 'pop', 'peek', 'isEmpty', 'search', 'clear'];

function ComplexityTable({ activeOp }) {
  return (
    <Box
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}
    >
      {ALL_OPS.map((op, i) => {
        const cx = COMPLEXITY[op];
        const isActive = activeOp === op;
        return (
          <Box
            key={op}
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
              {cx.label}
              {isActive && (
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ ml: 1, color: 'text.disabled' }}
                >
                  — {cx.note}
                </Typography>
              )}
            </Typography>
            <Chip
              label={cx.value}
              size="small"
              color={isActive ? cx.color : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              sx={{ fontFamily: 'monospace', fontSize: 11, height: 20 }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

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
      <Stack sx={{ gap: 0.5, mt: 0.5, maxHeight: 110, overflowY: 'auto' }}>
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
              bgcolor: alpha(theme.palette.text.primary, 0.03),
            })}
          >
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 52 }}
            >
              {e.op}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {e.detail}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default function StackOperationsVisualization({ defaults = {}, onHighlightChange }) {
  const initial = useMemo(
    () =>
      Array.isArray(defaults.initialValues)
        ? defaults.initialValues
        : parseValues(defaults.initialInput),
    [defaults.initialValues, defaults.initialInput],
  );

  const defaultValues = initial.length ? initial : [10, 20, 30];

  const [values, setValues] = useState(defaultValues);
  const [valueInput, setValueInput] = useState('');
  const [step, setStep] = useState({
    values: defaultValues,
    orientation: 'column',
    highlightIndexes: [defaultValues.length - 1],
  });
  const [message, setMessage] = useState('Push, Pop, Peek, or Search to observe LIFO behaviour.');
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [activeOp, setActiveOp] = useState(null);
  const [log, setLog] = useState([]);

  const parsedValue = Number.parseInt(valueInput, 10);

  const pushLog = (op, detail) => setLog((prev) => [{ op, detail }, ...prev].slice(0, 10));

  const applySnapshot = (
    nextValues,
    desc,
    highlightId,
    severity = 'success',
    highlightIndexes = null,
  ) => {
    const topIndex = nextValues.length - 1;
    setValues(nextValues);
    setStep({
      values: nextValues,
      orientation: 'column',
      highlightIndexes: highlightIndexes ?? (topIndex >= 0 ? [topIndex] : []),
    });
    setMessage(desc);
    setMessageSeverity(severity);
    onHighlightChange?.(highlightId);
  };

  const setError = (msg) => {
    setMessage(msg);
    setMessageSeverity('error');
  };

  // ── Operations ────────────────────────────────────────────────────────────

  const handlePush = () => {
    setActiveOp('push');
    if (Number.isNaN(parsedValue)) return setError('Push needs a valid integer value.');
    const next = [...values, parsedValue];
    applySnapshot(next, `Pushed ${parsedValue} onto the top. New size: ${next.length}.`, 2);
    pushLog('push', `${parsedValue} → top [${next.length - 1}]`);
  };

  const handlePop = () => {
    setActiveOp('pop');
    if (!values.length) return setError('Stack underflow — nothing to pop.');
    const removed = values[values.length - 1];
    const next = values.slice(0, -1);
    applySnapshot(next, `Popped ${removed} from the top (LIFO). New size: ${next.length}.`, 4);
    pushLog('pop', `removed ${removed}, size → ${next.length}`);
  };

  const handlePeek = () => {
    setActiveOp('peek');
    if (!values.length) return setError('Stack is empty — nothing to peek.');
    applySnapshot(
      values,
      `Peek → top = ${values[values.length - 1]}. Stack unchanged.`,
      3,
      'success',
      [values.length - 1],
    );
    pushLog('peek', `top = ${values[values.length - 1]}`);
  };

  const handleIsEmpty = () => {
    setActiveOp('isEmpty');
    const empty = values.length === 0;
    applySnapshot(
      values,
      empty
        ? 'isEmpty → true. The stack has no elements.'
        : `isEmpty → false. Stack has ${values.length} element(s).`,
      null,
      empty ? 'warning' : 'success',
      [],
    );
    pushLog('isEmpty', empty ? 'true' : `false (size ${values.length})`);
  };

  const handleSearch = () => {
    setActiveOp('search');
    if (Number.isNaN(parsedValue)) return setError('Search needs a valid integer value.');
    // Stack search scans from top (end of array) downward
    const fromTop = [...values].reverse().indexOf(parsedValue);
    if (fromTop === -1) {
      applySnapshot(
        values,
        `${parsedValue} not found. Scanned all ${values.length} element(s) — O(n).`,
        null,
        'warning',
        [],
      );
      pushLog('search', `${parsedValue} → not found`);
    } else {
      const actualIndex = values.length - 1 - fromTop;
      applySnapshot(
        values,
        `Found ${parsedValue} at position ${fromTop + 1} from top (index ${actualIndex}). Scanned ${fromTop + 1} element(s).`,
        null,
        'success',
        [actualIndex],
      );
      pushLog('search', `${parsedValue} → ${fromTop + 1} from top`);
    }
  };

  const handleClear = () => {
    setActiveOp('clear');
    const size = values.length;
    applySnapshot([], `Cleared all ${size} element(s). Stack is now empty.`, 1, 'info', []);
    pushLog('clear', `removed ${size} element(s)`);
  };

  const handleReset = () => {
    setActiveOp(null);
    setLog([]);
    applySnapshot(defaultValues, 'Stack reset to initial state.', 1, 'info', [
      defaultValues.length - 1,
    ]);
  };

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
          direction="row"
          gap={1}
          flexWrap="wrap"
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
          <Tooltip title="O(1) — add value to top">
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
          <Tooltip title="O(1) — remove top value">
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

          <Tooltip title="O(1) — check if stack has no elements">
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
          <Tooltip title="O(n) — scan from top for a value">
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
          <Tooltip title="O(n) — remove all elements">
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

        {/* Visualization */}
        <VisualizationRenderer kind="stack" steps={[step]} stepIndex={0} />

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr 1fr' }, gap: 1.5 }}>
          <StatCard label="Size" value={values.length} color="info" />
          <StatCard
            label="Top"
            value={values.length ? values[values.length - 1] : '∅'}
            color="primary"
          />
          <StatCard
            label="Complexity"
            value={activeOp ? COMPLEXITY[activeOp].value : '—'}
            color={activeOp ? COMPLEXITY[activeOp].color : 'secondary'}
          />
        </Box>

        {/* Complexity table */}
        <ComplexityTable activeOp={activeOp} />

        {/* Operation log */}
        <OperationLog entries={log} />

        <Typography variant="caption" color="text.secondary">
          Stack follows LIFO — the last element pushed is always the first popped. All core ops
          (push, pop, peek) are O(1).
        </Typography>
      </Stack>
    </Paper>
  );
}
