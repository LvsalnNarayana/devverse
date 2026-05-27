import { useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
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
  get: {
    label: 'Get',
    value: 'O(1)',
    color: 'success',
    note: 'Direct index access — constant time',
  },
  update: {
    label: 'Update',
    value: 'O(1)',
    color: 'success',
    note: 'Direct index write — constant time',
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
    note: 'Remove from end — no shifting needed',
  },
  find: { label: 'Find', value: 'O(n)', color: 'warning', note: 'Must scan elements one by one' },
  insert: {
    label: 'Insert',
    value: 'O(n)',
    color: 'warning',
    note: 'Must shift elements after insertion point right',
  },
  delete: {
    label: 'Delete',
    value: 'O(n)',
    color: 'warning',
    note: 'Must shift elements after deletion point left',
  },
};

const ALL_OPS = [
  { id: 'get', label: 'Get', group: 'read' },
  { id: 'find', label: 'Find', group: 'read' },
  { id: 'update', label: 'Update', group: 'write' },
  { id: 'push', label: 'Push', group: 'write' },
  { id: 'pop', label: 'Pop', group: 'write' },
  { id: 'insert', label: 'Insert', group: 'write' },
  { id: 'delete', label: 'Delete', group: 'write' },
];

function ComplexityTable({ activeOp }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
      }}
    >
      {ALL_OPS.map((op, i) => {
        const cx = COMPLEXITY[op.id];
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
              sx={{ fontFamily: 'monospace', color: 'text.disabled', minWidth: 46 }}
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

export default function ArrayOperationsVisualization({ defaults = {}, onHighlightChange }) {
  const initial = useMemo(
    () =>
      Array.isArray(defaults.initialArray)
        ? defaults.initialArray
        : parseValues(defaults.arrayInput),
    [defaults.initialArray, defaults.arrayInput],
  );

  const defaultArr = initial.length ? initial : [10, 20, 30, 40];

  const [arr, setArr] = useState(defaultArr);
  const [valueInput, setValueInput] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [step, setStep] = useState({ array: defaultArr, highlightIndexes: [] });
  const [message, setMessage] = useState('Try any operation — use the value/index fields above.');
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [activeOp, setActiveOp] = useState(null);
  const [log, setLog] = useState([]);

  const parsedIndex = Number.parseInt(indexInput, 10);
  const parsedValue = Number.parseInt(valueInput, 10);

  const pushLog = (op, detail) => setLog((prev) => [{ op, detail }, ...prev].slice(0, 10));

  const applySnapshot = (nextArray, highlightIndexes, desc, highlightId, severity = 'success') => {
    setArr(nextArray);
    setStep({ array: nextArray, highlightIndexes });
    setMessage(desc);
    setMessageSeverity(severity);
    onHighlightChange?.(highlightId);
  };

  const setError = (msg) => {
    setMessage(msg);
    setMessageSeverity('error');
  };

  // ── Operations ────────────────────────────────────────────────────────────

  const handleInsert = () => {
    setActiveOp('insert');
    if (Number.isNaN(parsedIndex) || Number.isNaN(parsedValue))
      return setError('Insert needs both a valid value and index.');
    if (parsedIndex < 0 || parsedIndex > arr.length)
      return setError(`Index must be between 0 and ${arr.length}.`);
    const next = [...arr];
    next.splice(parsedIndex, 0, parsedValue);
    applySnapshot(
      next,
      [parsedIndex],
      `Inserted ${parsedValue} at [${parsedIndex}]. Elements at [${parsedIndex}..] shifted right — O(n).`,
      4,
    );
    pushLog('insert', `arr[${parsedIndex}] ← ${parsedValue}, len ${arr.length} → ${next.length}`);
  };

  const handlePush = () => {
    setActiveOp('push');
    if (Number.isNaN(parsedValue)) return setError('Push needs a valid value.');
    const next = [...arr, parsedValue];
    applySnapshot(
      next,
      [next.length - 1],
      `Pushed ${parsedValue} to end at [${next.length - 1}]. No shifting — O(1) amortized.`,
      4,
    );
    pushLog('push', `arr[${next.length - 1}] ← ${parsedValue}`);
  };

  const handlePop = () => {
    setActiveOp('pop');
    if (arr.length === 0) return setError('Array is empty — nothing to pop.');
    const removed = arr[arr.length - 1];
    const next = arr.slice(0, -1);
    applySnapshot(
      next,
      [],
      `Popped ${removed} from end [${arr.length - 1}]. No shifting — O(1) amortized.`,
      5,
    );
    pushLog('pop', `removed ${removed} from [${arr.length - 1}]`);
  };

  const handleFind = () => {
    setActiveOp('find');
    if (Number.isNaN(parsedValue)) return setError('Find needs a valid value.');
    const idx = arr.indexOf(parsedValue);
    if (idx === -1) {
      applySnapshot(
        arr,
        [],
        `${parsedValue} not found. Scanned all ${arr.length} elements — O(n).`,
        2,
        'warning',
      );
      pushLog('find', `${parsedValue} → not found`);
    } else {
      applySnapshot(
        arr,
        [idx],
        `Found ${parsedValue} at [${idx}]. Scanned ${idx + 1} element(s) — O(n).`,
        2,
      );
      pushLog('find', `${parsedValue} → [${idx}]`);
    }
  };

  const handleGet = () => {
    setActiveOp('get');
    if (Number.isNaN(parsedIndex)) return setError('Get needs a valid index.');
    if (parsedIndex < 0 || parsedIndex >= arr.length)
      return setError(`Index out of bounds. Valid range: 0–${arr.length - 1}.`);
    applySnapshot(
      arr,
      [parsedIndex],
      `arr[${parsedIndex}] = ${arr[parsedIndex]}. Direct address jump — O(1).`,
      3,
    );
    pushLog('get', `arr[${parsedIndex}] → ${arr[parsedIndex]}`);
  };

  const handleUpdate = () => {
    setActiveOp('update');
    if (Number.isNaN(parsedIndex) || Number.isNaN(parsedValue))
      return setError('Update needs both a valid value and index.');
    if (parsedIndex < 0 || parsedIndex >= arr.length)
      return setError(`Index out of bounds. Valid range: 0–${arr.length - 1}.`);
    const old = arr[parsedIndex];
    const next = [...arr];
    next[parsedIndex] = parsedValue;
    applySnapshot(
      next,
      [parsedIndex],
      `Updated arr[${parsedIndex}]: ${old} → ${parsedValue}. Direct write — O(1).`,
      3,
    );
    pushLog('update', `arr[${parsedIndex}]: ${old} → ${parsedValue}`);
  };

  const handleDelete = () => {
    setActiveOp('delete');
    if (Number.isNaN(parsedIndex)) return setError('Delete needs a valid index.');
    if (parsedIndex < 0 || parsedIndex >= arr.length)
      return setError(`Index out of bounds. Valid range: 0–${arr.length - 1}.`);
    const removed = arr[parsedIndex];
    const next = [...arr];
    next.splice(parsedIndex, 1);
    applySnapshot(
      next,
      [],
      `Deleted ${removed} at [${parsedIndex}]. Elements after shifted left — O(n).`,
      5,
    );
    pushLog('delete', `arr[${parsedIndex}]=${removed} removed, len → ${next.length}`);
  };

  const handleReset = () => {
    setActiveOp(null);
    setLog([]);
    applySnapshot(defaultArr, [], 'Array reset to initial state.', 1, 'info');
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
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
          {/* Read ops */}
          <Tooltip title="O(1) — direct index access">
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

          {/* Write ops */}
          <Tooltip title="O(1) — direct index write">
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
          <Tooltip title="O(n) — inserts and shifts right">
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
          <Tooltip title="O(n) — removes and shifts left">
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

        {/* Message */}
        <Alert severity={messageSeverity}>{message}</Alert>

        {/* Visualization */}
        <VisualizationRenderer kind="array-boxes" steps={[step]} stepIndex={0} />

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr 1fr' }, gap: 1.5 }}>
          <StatCard label="Length" value={arr.length} color="info" />
          <StatCard
            label="Last op"
            value={activeOp ? COMPLEXITY[activeOp].label : '—'}
            color="secondary"
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
          O(1) ops (Get, Update, Push, Pop) jump directly to memory. O(n) ops (Find, Insert, Delete)
          iterate or shift — cost grows with array size.
        </Typography>
      </Stack>
    </Paper>
  );
}
