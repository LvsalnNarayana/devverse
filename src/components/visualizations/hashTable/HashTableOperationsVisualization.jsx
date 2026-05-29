import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
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

// ─────────────────────────────────────────────────────────────────────────────
// COLLISION STRATEGIES
// ─────────────────────────────────────────────────────────────────────────────
const STRATEGIES = [
  {
    id: 'chaining',
    label: 'Separate Chaining',
    description:
      'Each bucket holds a linked list. Collisions append to the list — bucket can grow unbounded.',
  },
  {
    id: 'probing',
    label: 'Open Addressing (Linear Probing)',
    description:
      'All entries live in the array. Collisions probe forward: (hash + i) % capacity until an empty slot is found.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEXITY
// ─────────────────────────────────────────────────────────────────────────────
const COMPLEXITY = {
  insert: {
    label: 'Insert',
    value: 'O(1) avg',
    color: 'success',
    note: 'Hash key → write to bucket. O(n) worst if all keys collide',
  },
  search: {
    label: 'Search',
    value: 'O(1) avg',
    color: 'success',
    note: 'Hash key → check bucket. O(n) worst with poor hash function',
  },
  delete: {
    label: 'Delete',
    value: 'O(1) avg',
    color: 'success',
    note: 'Hash key → remove from bucket. O(n) worst case',
  },
  contains: {
    label: 'Contains Key',
    value: 'O(1) avg',
    color: 'success',
    note: 'Same as search — compute hash, check bucket for key',
  },
  resize: {
    label: 'Resize',
    value: 'O(n)',
    color: 'warning',
    note: 'Every key must be rehashed and reinserted into the new array',
  },
};

const ALL_OPS = Object.entries(COMPLEXITY).map(([id, m]) => ({ id, ...m }));

const COMPLEXITY_COLUMNS = [
  { key: 'label', label: 'Operation', width: 120 },
  { key: 'value', label: 'Time', width: 110, mono: true },
  { key: 'note', label: 'Why' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HASH FUNCTION  — simple but visual: sum of char codes % capacity
// ─────────────────────────────────────────────────────────────────────────────
function hashFn(key, capacity) {
  let h = 0;
  const s = String(key);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % capacity;
  return h;
}

function hashFormula(key, capacity) {
  const s = String(key);
  let h = 0;
  const parts = [];
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % capacity;
    parts.push(`'${s[i]}'(${s.charCodeAt(i)})`);
  }
  return `(${parts.join(' + ')}) % ${capacity} = ${h}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAINING TABLE STATE
// buckets: Array of arrays of { key, value }
// ─────────────────────────────────────────────────────────────────────────────
function initChaining(capacity) {
  return Array.from({ length: capacity }, () => []);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBING TABLE STATE
// slots: Array of { key, value, deleted } | null
// ─────────────────────────────────────────────────────────────────────────────
function initProbing(capacity) {
  return Array.from({ length: capacity }, () => null);
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDERS — CHAINING
// ─────────────────────────────────────────────────────────────────────────────
function buildChainingTrace(op, buckets, key, value) {
  const capacity = buckets.length;
  const h = hashFn(key, capacity);
  const formula = hashFormula(key, capacity);
  const steps = [];
  const bucketCopy = buckets.map((b) => [...b.map((e) => ({ ...e }))]);

  // Step 1: compute hash
  steps.push({
    buckets: bucketCopy,
    highlightBucket: null,
    highlightKey: null,
    probeSequence: [],
    phase: 'instant',
    codeSnippet: `hash("${key}") = ${formula}`,
    whyExplanation: `Hash function maps the key "${key}" to an integer in [0, ${capacity - 1}]. A good hash function distributes keys uniformly — each bucket gets ~n/${capacity} entries on average. This is why the average case is O(1).`,
    message: `Computing hash("${key}"): charCode arithmetic → bucket [${h}].`,
  });

  // Step 2: go to bucket
  steps.push({
    buckets: bucketCopy,
    highlightBucket: h,
    highlightKey: null,
    probeSequence: [h],
    phase: 'traverse',
    codeSnippet: `bucket = table[${h}]  // ${bucketCopy[h].length} item(s) already here`,
    whyExplanation: `Direct array access to bucket ${h}. O(1) — arrays support random access. If ${bucketCopy[h].length} other key(s) already map here, that is a collision — the linked list in this bucket will need to be scanned.`,
    message: `Bucket [${h}] has ${bucketCopy[h].length} existing item(s). ${bucketCopy[h].length > 0 ? 'Collision! Will append to chain.' : 'Empty — no collision.'}`,
  });

  if (op === 'insert') {
    // Scan chain for duplicate
    const chain = bucketCopy[h];
    for (let i = 0; i < chain.length; i++) {
      steps.push({
        buckets: bucketCopy,
        highlightBucket: h,
        highlightKey: chain[i].key,
        probeSequence: [h],
        phase: chain[i].key === key ? 'found' : 'traverse',
        codeSnippet:
          chain[i].key === key
            ? `chain[${i}].key === "${key}" — update value`
            : `chain[${i}].key="${chain[i].key}" ≠ "${key}"; next`,
        whyExplanation:
          chain[i].key === key
            ? `Key "${key}" already exists — update its value. No new node created.`
            : `Key mismatch — scan next node. This chain scan is why worst-case insert is O(n): if all n keys hash to the same bucket, the chain has length n.`,
        message:
          chain[i].key === key
            ? `Found key "${key}" at chain[${i}] — updating value to "${value}".`
            : `chain[${i}].key="${chain[i].key}" ≠ "${key}". Advance.`,
      });
      if (chain[i].key === key) {
        const updated = bucketCopy.map((b, bi) =>
          bi === h ? b.map((e, ei) => (ei === i ? { ...e, value } : e)) : b,
        );
        steps.push({
          buckets: updated,
          highlightBucket: h,
          highlightKey: key,
          probeSequence: [h],
          phase: 'done',
          codeSnippet: `chain[${i}].value = "${value}"  // updated`,
          whyExplanation: `Value updated in-place. O(1) write after O(chain length) scan. Average chain length = load factor = n/capacity — kept < 1 via resizing.`,
          message: `Updated "${key}" → "${value}" in bucket [${h}]. Done.`,
        });
        return { steps, finalBuckets: updated };
      }
    }
    // Append new entry
    const newBuckets = bucketCopy.map((b, bi) => (bi === h ? [...b, { key, value }] : b));
    steps.push({
      buckets: newBuckets,
      highlightBucket: h,
      highlightKey: key,
      probeSequence: [h],
      phase: 'done',
      codeSnippet: `bucket[${h}].push({ key:"${key}", value:"${value}" })`,
      whyExplanation: `Append new node to the chain. LinkedList push is O(1). Total insert cost = O(hash) + O(chain scan) + O(1) append = O(1) average when load factor ≤ threshold.`,
      message: `Inserted "${key}" → "${value}" at bucket [${h}]. Chain length now ${newBuckets[h].length}.`,
    });
    return { steps, finalBuckets: newBuckets };
  }

  if (op === 'search' || op === 'contains') {
    const chain = bucketCopy[h];
    if (chain.length === 0) {
      steps.push({
        buckets: bucketCopy,
        highlightBucket: h,
        highlightKey: null,
        probeSequence: [h],
        phase: 'done',
        codeSnippet: `bucket[${h}] is empty — key "${key}" not found`,
        whyExplanation: `Empty bucket means no key with this hash exists. O(1) — just one array access and one length check. This is the ideal case.`,
        message: `Bucket [${h}] is empty. "${key}" does not exist.`,
      });
      return { steps, finalBuckets: bucketCopy };
    }
    for (let i = 0; i < chain.length; i++) {
      const isMatch = chain[i].key === key;
      steps.push({
        buckets: bucketCopy,
        highlightBucket: h,
        highlightKey: chain[i].key,
        probeSequence: [h],
        phase: isMatch ? 'found' : 'traverse',
        codeSnippet: isMatch
          ? `chain[${i}].key === "${key}"  // FOUND — value="${chain[i].value}"`
          : `chain[${i}].key="${chain[i].key}" ≠ "${key}"; next`,
        whyExplanation: isMatch
          ? `Found "${key}" at chain position ${i} after ${i + 1} comparison(s). Average chain length = load factor. With load < 1, expected comparisons < 1 — O(1) average.`
          : `Key mismatch at chain[${i}]. Must continue scanning. Worst case: all n keys collide → chain length n → O(n) search.`,
        message: isMatch
          ? `Found "${key}" at bucket [${h}], chain[${i}]. Value = "${chain[i].value}".`
          : `chain[${i}].key="${chain[i].key}" ≠ "${key}". Checking next.`,
      });
      if (isMatch) return { steps, finalBuckets: bucketCopy };
    }
    steps.push({
      buckets: bucketCopy,
      highlightBucket: h,
      highlightKey: null,
      probeSequence: [h],
      phase: 'done',
      codeSnippet: `// chain exhausted — "${key}" not found`,
      whyExplanation: `Scanned all ${chain.length} entry(entries) in bucket [${h}] — key not present. O(chain length) = O(load factor) on average.`,
      message: `"${key}" not found in bucket [${h}] after scanning ${chain.length} entry(entries).`,
    });
    return { steps, finalBuckets: bucketCopy };
  }

  if (op === 'delete') {
    const chain = bucketCopy[h];
    for (let i = 0; i < chain.length; i++) {
      const isMatch = chain[i].key === key;
      steps.push({
        buckets: bucketCopy,
        highlightBucket: h,
        highlightKey: chain[i].key,
        probeSequence: [h],
        phase: isMatch ? 'found' : 'traverse',
        codeSnippet: isMatch
          ? `chain[${i}].key === "${key}" — splice out`
          : `chain[${i}].key="${chain[i].key}" ≠ "${key}"; next`,
        whyExplanation: isMatch
          ? `Found "${key}" at chain[${i}]. Splice it out: predecessor.next = successor. O(1) node removal after O(i) scan.`
          : `Key mismatch — advance pointer. Each hop follows a .next reference.`,
        message: isMatch
          ? `Found "${key}" at bucket [${h}], chain[${i}]. Removing.`
          : `chain[${i}] ≠ "${key}". Keep scanning.`,
      });
      if (isMatch) {
        const newBuckets = bucketCopy.map((b, bi) =>
          bi === h ? b.filter((_, ei) => ei !== i) : b,
        );
        steps.push({
          buckets: newBuckets,
          highlightBucket: h,
          highlightKey: null,
          probeSequence: [h],
          phase: 'done',
          codeSnippet: `bucket[${h}].splice(${i}, 1)  // removed`,
          whyExplanation: `"${key}" removed. Chain length reduced by 1. O(1) average deletion — the expected scan length is the load factor.`,
          message: `"${key}" deleted from bucket [${h}]. Chain length now ${newBuckets[h].length}.`,
        });
        return { steps, finalBuckets: newBuckets };
      }
    }
    steps.push({
      buckets: bucketCopy,
      highlightBucket: h,
      highlightKey: null,
      probeSequence: [h],
      phase: 'done',
      codeSnippet: `// "${key}" not found — nothing to delete`,
      whyExplanation: `Key not present. No modification. O(chain length) scan to confirm absence.`,
      message: `"${key}" not found in bucket [${h}]. Nothing deleted.`,
    });
    return { steps, finalBuckets: bucketCopy };
  }

  return { steps, finalBuckets: bucketCopy };
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACE BUILDERS — LINEAR PROBING
// ─────────────────────────────────────────────────────────────────────────────
function buildProbingTrace(op, slots, key, value) {
  const capacity = slots.length;
  const h = hashFn(key, capacity);
  const formula = hashFormula(key, capacity);
  const steps = [];
  const slotsCopy = slots.map((s) => (s ? { ...s } : null));

  steps.push({
    slots: slotsCopy,
    highlightSlot: null,
    probeSequence: [],
    phase: 'instant',
    codeSnippet: `hash("${key}") = ${formula}`,
    whyExplanation: `Hash function maps "${key}" to index ${h}. With open addressing, all entries live in the array — no separate linked lists. Load factor must stay below ~0.7 to keep probe sequences short.`,
    message: `Computing hash("${key}") → slot [${h}]. All entries in the flat array.`,
  });

  if (op === 'insert') {
    const probeSeq = [];
    for (let i = 0; i < capacity; i++) {
      const idx = (h + i) % capacity;
      probeSeq.push(idx);
      const slot = slotsCopy[idx];
      const isOccupied = slot !== null && !slot.deleted;
      const isDeleted = slot !== null && slot.deleted;
      const isMatch = isOccupied && slot.key === key;

      steps.push({
        slots: slotsCopy,
        highlightSlot: idx,
        probeSequence: [...probeSeq],
        phase: isMatch ? 'found' : isOccupied ? 'traverse' : 'done',
        codeSnippet: isMatch
          ? `slots[${idx}].key === "${key}" — update value`
          : isOccupied
            ? `slots[${idx}]="${slot.key}" occupied ≠ "${key}"; probe slot [${(h + i + 1) % capacity}]`
            : `slots[${idx}] is ${isDeleted ? 'tombstone (reuse)' : 'empty'} — insert here`,
        whyExplanation: isMatch
          ? `Key "${key}" already exists at [${idx}] — update value. ${i} probe(s) needed.`
          : isOccupied
            ? `Slot [${idx}] occupied by "${slot.key}" (collision). Linear probe: try (${h}+${i + 1})%${capacity}=${(h + i + 1) % capacity}. Clustering means nearby slots fill up — this is primary clustering.`
            : `Slot [${idx}] is ${isDeleted ? 'a tombstone — safe to reuse' : 'empty — insert here'}. ${i} probe(s) were needed. This is why worst-case is O(n) when table is nearly full.`,
        message: isMatch
          ? `Found "${key}" at [${idx}] after ${i + 1} probe(s). Updating value.`
          : isOccupied
            ? `Slot [${idx}] = "${slot.key}" (collision). Probing next: [${(h + i + 1) % capacity}].`
            : `Empty slot at [${idx}] after ${i + 1} probe(s). Inserting.`,
      });

      if (isMatch) {
        const updated = slotsCopy.map((s, si) => (si === idx ? { ...s, value } : s));
        steps.push({
          slots: updated,
          highlightSlot: idx,
          probeSequence: [...probeSeq],
          phase: 'done',
          codeSnippet: `slots[${idx}].value = "${value}"  // updated`,
          whyExplanation: `Value updated in-place. O(1) write. Total cost = O(probe length). With load factor < 0.7, expected probes ≈ 1/(1-α) — O(1) average.`,
          message: `Updated "${key}" → "${value}" at slot [${idx}]. Done.`,
        });
        return { steps, finalSlots: updated };
      }
      if (!isOccupied) {
        const updated = slotsCopy.map((s, si) => (si === idx ? { key, value, deleted: false } : s));
        steps.push({
          slots: updated,
          highlightSlot: idx,
          probeSequence: [...probeSeq],
          phase: 'done',
          codeSnippet: `slots[${idx}] = { key:"${key}", value:"${value}" }`,
          whyExplanation: `Inserted at slot [${idx}] after ${i + 1} probe(s). Load factor increases — when it exceeds threshold (~0.7), the table must be resized and all keys rehashed (O(n) operation).`,
          message: `Inserted "${key}" → "${value}" at slot [${idx}] after ${i + 1} probe(s).`,
        });
        return { steps, finalSlots: updated };
      }
    }
    steps.push({
      slots: slotsCopy,
      highlightSlot: null,
      probeSequence: probeSeq,
      phase: 'done',
      codeSnippet: `// table full — insert failed`,
      whyExplanation: `All slots occupied. Table must be resized. This is why open addressing requires load factor < 1 — the probe sequence must always find an empty slot.`,
      message: `Table full! Cannot insert "${key}". Resize required.`,
    });
    return { steps, finalSlots: slotsCopy };
  }

  if (op === 'search' || op === 'contains') {
    const probeSeq = [];
    for (let i = 0; i < capacity; i++) {
      const idx = (h + i) % capacity;
      probeSeq.push(idx);
      const slot = slotsCopy[idx];
      const isEmpty = slot === null;
      const isDeleted = slot?.deleted;
      const isMatch = slot && !slot.deleted && slot.key === key;

      steps.push({
        slots: slotsCopy,
        highlightSlot: idx,
        probeSequence: [...probeSeq],
        phase: isMatch ? 'found' : 'traverse',
        codeSnippet: isEmpty
          ? `slots[${idx}] is null — key "${key}" not in table`
          : isDeleted
            ? `slots[${idx}] is tombstone — skip and continue probing`
            : isMatch
              ? `slots[${idx}].key === "${key}" — FOUND`
              : `slots[${idx}].key="${slot.key}" ≠ "${key}"; probe next`,
        whyExplanation: isEmpty
          ? `Empty slot (not tombstone) means the probe sequence ended — key "${key}" was never inserted here. We can stop. If this were a tombstone we'd need to continue.`
          : isDeleted
            ? `Tombstone: this slot previously held a key that was deleted. We must keep probing — the key "${key}" might be further along the probe sequence. This is the cost of lazy deletion in open addressing.`
            : isMatch
              ? `Found "${key}" at [${idx}] after ${i + 1} probe(s). O(1) average when load factor is low.`
              : `"${slot.key}" ≠ "${key}". Continue probing. Primary clustering: keys that collide form runs that grow linearly — degrades to O(n) when load is high.`,
        message: isEmpty
          ? `Slot [${idx}] is empty — "${key}" not found. Probe sequence terminated.`
          : isDeleted
            ? `Slot [${idx}] is a tombstone. Must keep probing.`
            : isMatch
              ? `Found "${key}" at slot [${idx}] after ${i + 1} probe(s)!`
              : `Slot [${idx}] = "${slot.key}" ≠ "${key}". Probing [${(h + i + 1) % capacity}].`,
      });

      if (isMatch || isEmpty) return { steps, finalSlots: slotsCopy };
    }
    return { steps, finalSlots: slotsCopy };
  }

  if (op === 'delete') {
    const probeSeq = [];
    for (let i = 0; i < capacity; i++) {
      const idx = (h + i) % capacity;
      probeSeq.push(idx);
      const slot = slotsCopy[idx];
      const isEmpty = slot === null;
      const isDeleted = slot?.deleted;
      const isMatch = slot && !slot.deleted && slot.key === key;

      steps.push({
        slots: slotsCopy,
        highlightSlot: idx,
        probeSequence: [...probeSeq],
        phase: isMatch ? 'found' : 'traverse',
        codeSnippet: isEmpty
          ? `slots[${idx}] is null — key "${key}" not in table`
          : isDeleted
            ? `slots[${idx}] is tombstone — skip`
            : isMatch
              ? `slots[${idx}].key === "${key}" — mark as tombstone`
              : `slots[${idx}].key="${slot.key}" ≠ "${key}"; probe next`,
        whyExplanation: isMatch
          ? `Found "${key}" at [${idx}]. Mark as tombstone (deleted=true) instead of null. Why tombstone? Setting to null would break probe sequences for other keys that probed through this slot.`
          : isEmpty
            ? `Empty slot — key "${key}" was never inserted. Probe terminates.`
            : isDeleted
              ? `Tombstone — continue probing. The target key might be beyond this deleted slot.`
              : `Key mismatch. Continue probing the cluster.`,
        message: isMatch
          ? `Found "${key}" at [${idx}]. Setting tombstone (lazy deletion) — preserves probe sequences.`
          : isEmpty
            ? `Slot [${idx}] empty. "${key}" not found.`
            : `Slot [${idx}] = "${slot?.key}". Probing next.`,
      });

      if (isMatch) {
        const updated = slotsCopy.map((s, si) =>
          si === idx ? { key, value: s.value, deleted: true } : s,
        );
        steps.push({
          slots: updated,
          highlightSlot: idx,
          probeSequence: [...probeSeq],
          phase: 'done',
          codeSnippet: `slots[${idx}].deleted = true  // tombstone`,
          whyExplanation: `Tombstone marks the slot as "was occupied" so probe sequences through it remain valid. Cost: accumulated tombstones hurt search performance. Periodic rehashing clears them — O(n).`,
          message: `"${key}" deleted (tombstone) at [${idx}]. Probe sequences through [${idx}] still work correctly.`,
        });
        return { steps, finalSlots: updated };
      }
      if (isEmpty) return { steps, finalSlots: slotsCopy };
    }
    return { steps, finalSlots: slotsCopy };
  }

  return { steps, finalSlots: slotsCopy };
}

// Build resize trace for chaining
function buildResizeTrace(buckets, newCapacity) {
  const steps = [];
  const oldCapacity = buckets.length;
  const allEntries = buckets.flatMap((b) => b);
  const newBuckets = Array.from({ length: newCapacity }, () => []);

  steps.push({
    buckets,
    highlightBucket: null,
    highlightKey: null,
    probeSequence: [],
    phase: 'traverse',
    codeSnippet: `// resize ${oldCapacity} → ${newCapacity}. Rehashing ${allEntries.length} entries`,
    whyExplanation: `Resize is triggered when load factor = entries/capacity exceeds threshold (typically 0.75). A new array of size ${newCapacity} is allocated. Every existing entry must be rehashed — hash(key) % newCapacity produces new bucket indices. This is why resize is O(n).`,
    message: `Resizing from ${oldCapacity} to ${newCapacity} buckets. Rehashing ${allEntries.length} entries.`,
  });

  for (const entry of allEntries) {
    const newH = hashFn(entry.key, newCapacity);
    newBuckets[newH] = [...newBuckets[newH], entry];
    steps.push({
      buckets: newBuckets.map((b) => [...b]),
      highlightBucket: newH,
      highlightKey: entry.key,
      probeSequence: [newH],
      phase: 'traverse',
      codeSnippet: `hash("${entry.key}") % ${newCapacity} = ${newH}  // rehash`,
      whyExplanation: `"${entry.key}" hashes to bucket ${newH} in the new table. Every key gets a new bucket assignment — the old distribution is thrown away. This mandatory full-scan is why resize costs O(n).`,
      message: `Rehashing "${entry.key}" → bucket [${newH}] in new table.`,
    });
  }

  steps.push({
    buckets: newBuckets.map((b) => [...b]),
    highlightBucket: null,
    highlightKey: null,
    probeSequence: [],
    phase: 'done',
    codeSnippet: `// resize complete. new capacity = ${newCapacity}`,
    whyExplanation: `Resize complete. All ${allEntries.length} entries rehashed. New load factor = ${allEntries.length}/${newCapacity} = ${(allEntries.length / newCapacity).toFixed(2)}. Although O(n) per resize, amortized cost per insert stays O(1) because capacity doubles — so between resizes, O(n) inserts occur.`,
    message: `Resize done. ${allEntries.length} entries in ${newCapacity} buckets. Load factor: ${(allEntries.length / newCapacity).toFixed(2)}.`,
  });

  return { steps, finalBuckets: newBuckets };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAINING VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function ChainingViz({ buckets, highlightBucket, highlightKey }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        Separate Chaining — Live State
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {buckets.map((chain, idx) => {
          const isActiveBucket = idx === highlightBucket;
          const hasCollision = chain.length > 1;
          return (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {/* Bucket index box */}
              <Box
                sx={{
                  minWidth: 34,
                  height: 34,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 1,
                  border: '1.5px solid',
                  borderColor: isActiveBucket ? primary : 'divider',
                  bgcolor: isActiveBucket
                    ? alpha(primary, isDark ? 0.2 : 0.1)
                    : alpha(theme.palette.text.primary, 0.03),
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: isActiveBucket ? primary : 'text.secondary',
                  flexShrink: 0,
                  transition: 'all 220ms ease',
                }}
              >
                {idx}
              </Box>
              {/* Arrow */}
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ fontFamily: 'monospace', flexShrink: 0 }}
              >
                →
              </Typography>
              {/* Chain entries */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexWrap: 'wrap', flex: 1 }}
              >
                {chain.length === 0 ? (
                  <Box
                    sx={{
                      height: 34,
                      px: 1.25,
                      display: 'grid',
                      placeItems: 'center',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontFamily: 'monospace' }}
                    >
                      null
                    </Typography>
                  </Box>
                ) : (
                  chain.map((entry, ei) => {
                    const isHighlightEntry = isActiveBucket && entry.key === highlightKey;
                    const isCollisionEntry = ei > 0;
                    return (
                      <Box
                        key={ei}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexShrink: 0 }}
                      >
                        {ei > 0 && (
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                          >
                            →
                          </Typography>
                        )}
                        <Box
                          sx={{
                            height: 34,
                            px: 1.25,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            border: '1.5px solid',
                            borderColor: isHighlightEntry
                              ? success
                              : isCollisionEntry && isActiveBucket
                                ? warning
                                : isActiveBucket
                                  ? alpha(primary, 0.5)
                                  : 'divider',
                            borderRadius: 1,
                            bgcolor: isHighlightEntry
                              ? alpha(success, isDark ? 0.2 : 0.1)
                              : isCollisionEntry && isActiveBucket
                                ? alpha(warning, isDark ? 0.12 : 0.07)
                                : isActiveBucket
                                  ? alpha(primary, isDark ? 0.1 : 0.05)
                                  : alpha(theme.palette.text.primary, 0.03),
                            transition: 'all 220ms ease',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: isHighlightEntry
                                ? success
                                : isCollisionEntry && isActiveBucket
                                  ? warning
                                  : 'text.primary',
                              fontSize: '0.75rem',
                            }}
                          >
                            {entry.key}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
                          >
                            :
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'monospace',
                              color: 'text.secondary',
                              fontSize: '0.7rem',
                            }}
                          >
                            {entry.value}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
              {/* Collision badge */}
              {hasCollision && (
                <Chip
                  label={`${chain.length} items`}
                  size="small"
                  sx={{
                    fontSize: 9,
                    height: 18,
                    bgcolor: alpha(warning, 0.15),
                    color: warning,
                    fontFamily: 'monospace',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1.5 }}>
        {[
          { color: primary, label: 'Active bucket' },
          { color: success, label: 'Found / inserted' },
          { color: warning, label: 'Collision' },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: color }} />
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBING VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────
function ProbingViz({ slots, highlightSlot, probeSequence }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        Open Addressing (Linear Probing) — Live State
      </Typography>
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
          {slots.map((slot, idx) => {
            const isHighlight = idx === highlightSlot;
            const isProbed = probeSequence.includes(idx);
            const isEmpty = slot === null;
            const isDeleted = slot?.deleted;
            const isOccupied = slot && !slot.deleted;
            const probeOrder = probeSequence.indexOf(idx);

            const borderColor = isHighlight
              ? isEmpty
                ? primary
                : isDeleted
                  ? error
                  : success
              : isProbed
                ? alpha(primary, 0.4)
                : 'divider';
            const bgColor = isHighlight
              ? alpha(isEmpty ? primary : isDeleted ? error : success, isDark ? 0.2 : 0.1)
              : isProbed
                ? alpha(primary, isDark ? 0.08 : 0.04)
                : alpha(theme.palette.text.primary, 0.03);

            return (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {/* Probe order badge above */}
                <Box sx={{ height: 18, display: 'flex', alignItems: 'center' }}>
                  {probeOrder >= 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        color: isHighlight
                          ? isEmpty
                            ? primary
                            : isDeleted
                              ? error
                              : success
                          : alpha(primary, 0.7),
                      }}
                    >
                      {probeOrder + 1}
                    </Typography>
                  )}
                </Box>
                {/* Slot cell */}
                <Box
                  sx={{
                    width: 56,
                    height: 52,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.25,
                    border: '1.5px solid',
                    borderColor,
                    borderRight: idx < slots.length - 1 ? '1px solid' : '1.5px solid',
                    borderRightColor: idx < slots.length - 1 ? 'divider' : borderColor,
                    bgcolor: bgColor,
                    transition: 'all 220ms ease',
                    boxShadow: isHighlight
                      ? `0 0 0 3px ${alpha(borderColor === 'divider' ? primary : borderColor, 0.2)}`
                      : 'none',
                  }}
                >
                  {isEmpty ? (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                    >
                      ∅
                    </Typography>
                  ) : isDeleted ? (
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.6rem',
                        color: error,
                        textDecoration: 'line-through',
                      }}
                    >
                      {slot.key}
                    </Typography>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: isHighlight ? success : 'text.primary',
                          transition: 'color 220ms',
                        }}
                      >
                        {slot.key}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                      >
                        {slot.value}
                      </Typography>
                    </>
                  )}
                </Box>
                {/* Index */}
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: 'monospace', fontSize: '0.6rem', mt: 0.25 }}
                >
                  [{idx}]
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
      {/* Probe sequence indicator */}
      {probeSequence.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
            Probe sequence:
          </Typography>
          {probeSequence.map((s, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              {i > 0 && (
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
                >
                  →
                </Typography>
              )}
              <Chip
                label={`[${s}]`}
                size="small"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  height: 18,
                  bgcolor: i === probeSequence.length - 1 ? alpha(primary, 0.15) : 'transparent',
                  color: i === probeSequence.length - 1 ? primary : 'text.secondary',
                  border: '1px solid',
                  borderColor: i === probeSequence.length - 1 ? alpha(primary, 0.4) : 'divider',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
        {[
          { color: success, label: 'Found / inserted' },
          { color: primary, label: 'Probing' },
          { color: error, label: 'Tombstone (deleted)' },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: color }} />
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
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
          alignSelf: 'flex-start',
        }}
      />

      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 1,
          bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.04),
          border: '1px solid',
          borderColor: alpha(phaseColor, 0.3),
          fontFamily: 'monospace',
          fontSize: '0.78rem',
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
// HASH TABLE PANEL (per tab)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CAPACITY = 8;
const DEFAULT_CHAINING_ENTRIES = [
  { key: 'name', value: 'Alice' },
  { key: 'age', value: '30' },
  { key: 'city', value: 'NYC' },
];
const DEFAULT_PROBING_ENTRIES = [
  { key: 'A', value: '1' },
  { key: 'B', value: '2' },
  { key: 'C', value: '3' },
];

function HashTablePanel({ strategy }) {
  const isChaining = strategy.id === 'chaining';

  const makeDefaultState = () => {
    if (isChaining) {
      const buckets = initChaining(DEFAULT_CAPACITY);
      for (const { key, value } of DEFAULT_CHAINING_ENTRIES) {
        const h = hashFn(key, DEFAULT_CAPACITY);
        buckets[h] = [...buckets[h], { key, value }];
      }
      return { buckets, capacity: DEFAULT_CAPACITY };
    } else {
      const slots = initProbing(DEFAULT_CAPACITY);
      for (const { key, value } of DEFAULT_PROBING_ENTRIES) {
        let h = hashFn(key, DEFAULT_CAPACITY);
        for (let i = 0; i < DEFAULT_CAPACITY; i++) {
          const idx = (h + i) % DEFAULT_CAPACITY;
          if (!slots[idx] || slots[idx].deleted) {
            slots[idx] = { key, value, deleted: false };
            break;
          }
        }
      }
      return { slots, capacity: DEFAULT_CAPACITY };
    }
  };

  const defaultState = useMemo(makeDefaultState, [isChaining]);

  const [buckets, setBuckets] = useState(defaultState.buckets ?? null);
  const [slots, setSlots] = useState(defaultState.slots ?? null);
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [message, setMessage] = useState(
    'Insert, search, or delete key-value pairs — Why panel explains each hash step.',
  );
  const [messageSeverity, setMessageSeverity] = useState('info');
  const [activeOp, setActiveOp] = useState(null);
  const [opLog, setOpLog] = useState([]);

  // Trace
  const [trace, setTrace] = useState([]);
  const [traceIdx, setTraceIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const currentStep = trace[traceIdx] ?? null;
  const isLastStep = traceIdx === trace.length - 1;
  const onDoneStep = currentStep?.phase === 'done';

  // Display state from trace or current
  const displayBuckets = isChaining
    ? isPlaying || traceIdx < 0 || isLastStep || onDoneStep
      ? buckets
      : (currentStep?.buckets ?? buckets)
    : null;

  const displaySlots = !isChaining
    ? isPlaying || traceIdx < 0 || isLastStep || onDoneStep
      ? slots
      : (currentStep?.slots ?? slots)
    : null;

  const highlightBucket = isChaining ? (currentStep?.highlightBucket ?? null) : null;
  const highlightKey = isChaining ? (currentStep?.highlightKey ?? null) : null;
  const highlightSlot = !isChaining ? (currentStep?.highlightSlot ?? null) : null;
  const probeSequence = !isChaining ? (currentStep?.probeSequence ?? []) : [];

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

  const runOp = (op, t, applyFn, desc, logDetail, severity = 'success') => {
    stopAnim();
    setActiveOp(op);
    setTrace(t);
    setTraceIdx(-1);
    applyFn();
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

  const entryCount = isChaining
    ? (buckets ?? []).reduce((s, b) => s + b.length, 0)
    : (slots ?? []).filter((s) => s && !s.deleted).length;

  const loadFactor = (entryCount / capacity).toFixed(2);

  // ── Operations ─────────────────────────────────────────────────────────────
  const handleInsert = () => {
    const k = keyInput.trim();
    const v = valueInput.trim();
    if (!k) return setError('Enter a key.');
    if (!v) return setError('Enter a value.');
    if (isChaining) {
      const { steps, finalBuckets } = buildChainingTrace('insert', buckets, k, v);
      runOp(
        'insert',
        steps,
        () => setBuckets(finalBuckets),
        `Inserted "${k}" → "${v}". Watch Why panel show hash + chain — O(1) avg.`,
        `insert("${k}", "${v}")`,
        'success',
      );
    } else {
      const { steps, finalSlots } = buildProbingTrace('insert', slots, k, v);
      runOp(
        'insert',
        steps,
        () => setSlots(finalSlots),
        `Inserted "${k}" → "${v}". Watch Why panel show probe sequence — O(1) avg.`,
        `insert("${k}", "${v}")`,
        'success',
      );
    }
    setKeyInput('');
    setValueInput('');
  };

  const handleSearch = () => {
    const k = keyInput.trim();
    if (!k) return setError('Enter a key to search.');
    if (isChaining) {
      const { steps } = buildChainingTrace('search', buckets, k, '');
      runOp(
        'search',
        steps,
        () => {},
        `Searching "${k}". Watch Why panel show hash + chain scan — O(1) avg.`,
        `search("${k}")`,
        'info',
      );
    } else {
      const { steps } = buildProbingTrace('search', slots, k, '');
      runOp(
        'search',
        steps,
        () => {},
        `Searching "${k}". Watch Why panel show probe sequence — O(1) avg.`,
        `search("${k}")`,
        'info',
      );
    }
  };

  const handleDelete = () => {
    const k = keyInput.trim();
    if (!k) return setError('Enter a key to delete.');
    if (isChaining) {
      const { steps, finalBuckets } = buildChainingTrace('delete', buckets, k, '');
      runOp(
        'delete',
        steps,
        () => setBuckets(finalBuckets),
        `Deleting "${k}". Watch Why panel show hash + chain splice — O(1) avg.`,
        `delete("${k}")`,
        'success',
      );
    } else {
      const { steps, finalSlots } = buildProbingTrace('delete', slots, k, '');
      runOp(
        'delete',
        steps,
        () => setSlots(finalSlots),
        `Deleting "${k}". Watch Why panel explain tombstone vs null — O(1) avg.`,
        `delete("${k}")`,
        'success',
      );
    }
    setKeyInput('');
  };

  const handleContains = () => {
    const k = keyInput.trim();
    if (!k) return setError('Enter a key to check.');
    if (isChaining) {
      const { steps } = buildChainingTrace('contains', buckets, k, '');
      runOp(
        'contains',
        steps,
        () => {},
        `Checking if "${k}" exists. Same as search — O(1) avg.`,
        `contains("${k}")`,
        'info',
      );
    } else {
      const { steps } = buildProbingTrace('contains', slots, k, '');
      runOp(
        'contains',
        steps,
        () => {},
        `Checking if "${k}" exists. Probe sequence — O(1) avg.`,
        `contains("${k}")`,
        'info',
      );
    }
  };

  const handleResize = () => {
    if (!isChaining) {
      setError('Resize demo is shown on the Chaining tab. Open addressing resizes similarly.');
      return;
    }
    const newCap = capacity * 2;
    const { steps, finalBuckets } = buildResizeTrace(buckets, newCap);
    runOp(
      'resize',
      steps,
      () => {
        setBuckets(finalBuckets);
        setCapacity(newCap);
      },
      `Resizing ${capacity} → ${newCap} buckets. Watch Why panel — O(n) rehash.`,
      `resize ${capacity} → ${newCap}`,
      'info',
    );
  };

  const handleReset = () => {
    stopAnim();
    setActiveOp(null);
    setOpLog([]);
    const s = makeDefaultState();
    setBuckets(s.buckets ?? null);
    setSlots(s.slots ?? null);
    setCapacity(DEFAULT_CAPACITY);
    setTrace([]);
    setTraceIdx(-1);
    setKeyInput('');
    setValueInput('');
    setMessage(
      'Reset. Insert, search, or delete key-value pairs — Why panel explains each hash step.',
    );
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
          label="Key"
          size="small"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder='e.g. "name"'
          sx={{ maxWidth: 180 }}
        />
        <TextField
          label="Value"
          size="small"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder='e.g. "Alice"'
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
        <Tooltip title="O(1) avg — hash key, write to bucket/slot">
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
        <Tooltip title="O(1) avg — hash key, scan bucket/probe sequence">
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
        <Tooltip title="O(1) avg — hash key, remove from bucket or mark tombstone">
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<RemoveRoundedIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Tooltip>
        <Tooltip title="O(1) avg — same as search, returns boolean">
          <Button
            size="small"
            variant="outlined"
            color="info"
            sx={{ textTransform: 'none' }}
            onClick={handleContains}
          >
            Contains
          </Button>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip
          title={
            isChaining ? 'O(n) — double capacity, rehash all keys' : 'Resize shown on Chaining tab'
          }
        >
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            sx={{ textTransform: 'none' }}
            onClick={handleResize}
            disabled={!isChaining}
          >
            Resize ×2
          </Button>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Reset to default state">
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

      {/* Viz + Why panel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        {isChaining ? (
          <ChainingViz
            buckets={displayBuckets ?? []}
            highlightBucket={highlightBucket}
            highlightKey={highlightKey}
          />
        ) : (
          <ProbingViz
            slots={displaySlots ?? []}
            highlightSlot={highlightSlot}
            probeSequence={probeSequence}
          />
        )}
        <WhyPanel traceStep={currentStep} />
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1.5 }}>
        <StatCard label="Entries" value={entryCount} color="info" />
        <StatCard label="Capacity" value={capacity} color="primary" />
        <StatCard
          label="Load Factor"
          value={loadFactor}
          color={parseFloat(loadFactor) > 0.7 ? 'error' : 'success'}
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
        caption="Active operation highlighted. Green = O(1) avg, yellow = O(n)."
        sx={{ mt: 0, mb: 0 }}
      />

      {/* Op log */}
      <OperationLog entries={opLog} />

      <Typography variant="caption" color="text.secondary">
        {isChaining
          ? 'Separate chaining: each bucket holds a linked list. O(1) avg when load factor ≤ 0.75. Worst case O(n) if all keys collide.'
          : 'Linear probing: all entries in the flat array. Probe forward on collision. Tombstones preserve deleted slots. Keep load < 0.7 to avoid clustering.'}
      </Typography>
    </Stack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function HashTableOperationsVisualization({ defaults = {} }) {
  const [activeTab, setActiveTab] = useState(0);
  const strategy = STRATEGIES[activeTab];

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
            {STRATEGIES.map((s) => (
              <Tab
                key={s.id}
                label={s.label}
                sx={{ textTransform: 'none', minHeight: 40, py: 0.5 }}
              />
            ))}
          </Tabs>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
            {strategy.description}
          </Typography>
        </Box>
        <HashTablePanel key={strategy.id} strategy={strategy} />
      </Stack>
    </Paper>
  );
}
