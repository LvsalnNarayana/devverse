import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import AlgorithmStepsPanel from '../components/dsa/AlgorithmStepsPanel';
import { Alert, HowItWorksAlert, KeyValueList, MultiTabCodeSnippet } from '../components/shared';

/**
 * DSATopicLayout — unified shell that auto-adapts to three page kinds:
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  KIND: 'data-structure'  (default when no kind specified)           │
 * │  Fields used:                                                       │
 * │    header, howItWorks, visualization, variants, code,               │
 * │    footerAlerts, hints                                              │
 * │  Layout: full-width viz (no sidebar), variants cards below code     │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  KIND: 'algorithm'                                                  │
 * │  Fields used:                                                       │
 * │    header, howItWorks, visualization, algorithmSteps, complexity,   │
 * │    code, footerAlerts, hints, shortcuts                             │
 * │  Layout: viz + sticky sidebar (steps + complexity), then code       │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  KIND: 'problem'                                                    │
 * │  Fields used:                                                       │
 * │    header, problem { statement, examples, constraints },            │
 * │    visualization, hints, footerAlerts, code                        │
 * │  Layout: problem statement, then viz, then solution code            │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ── Full content schema (all fields optional except header) ──────────────
 *
 * header           { backTo, overline, title, description }
 * kind             'data-structure' | 'algorithm' | 'problem'  (default: 'data-structure')
 *
 * // Shared
 * howItWorks       { title, items: string[] }
 * visualization    { id, kind, defaults }
 * code             { title, files: { filename, language, code }[] }
 * footerAlerts     { severity, title, items: string[] }[]
 * hints            string[]
 * shortcuts        string   — keyboard shortcut legend (algorithm only)
 *
 * // Algorithm-only
 * algorithmSteps   { id, title, text }[]
 * complexity       { label, value }[]
 *
 * // Data-structure-only
 * variants         { id, label, description, characteristics: string[], useCases: string[] }[]
 *   — generic name for any per-type breakdown (linked list types, tree types, etc.)
 *   — content files may also export topic-specific keys (linkedListTypes, treeTypes, etc.)
 *     which the layout normalises into `variants` automatically.
 *
 * // Problem-only
 * problem          {
 *                    statement: string,
 *                    examples: { input, output, explanation? }[],
 *                    constraints: string[],
 *                    difficulty: 'Easy'|'Medium'|'Hard',
 *                    tags: string[],
 *                  }
 */

// ── Variant cards (data-structure pages) ─────────────────────────────────────
function VariantCards({ variants }) {
  if (!variants?.length) return null;
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Types
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {variants.map((v) => (
          <Paper
            key={v.id}
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
          >
            {/* Label */}
            <Typography variant="subtitle1" fontWeight={700}>
              {v.label}
            </Typography>

            {/* Description */}
            <Typography variant="body2" color="text.secondary">
              {v.description}
            </Typography>

            {/* Structure diagram if present */}
            {v.structure && (
              <Box
                sx={(theme) => ({
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  bgcolor: theme.palette.action.hover,
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  color: 'text.secondary',
                  whiteSpace: 'pre',
                  overflowX: 'auto',
                })}
              >
                {v.structure}
              </Box>
            )}

            {/* Characteristics */}
            {v.characteristics?.length > 0 && (
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {v.characteristics.map((c, i) => (
                  <Typography key={i} component="li" variant="caption" color="text.secondary">
                    {c}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Use cases */}
            {v.useCases?.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {v.useCases.map((u, i) => (
                  <Chip key={i} label={u} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                ))}
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Stack>
  );
}

// ── Problem statement section (problem pages) ─────────────────────────────────
function ProblemStatement({ problem }) {
  if (!problem) return null;
  const { statement, examples, constraints, difficulty, tags } = problem;

  const difficultyColor =
    difficulty === 'Easy' ? 'success' : difficulty === 'Hard' ? 'error' : 'warning';

  return (
    <Stack sx={{ gap: 2 }}>
      {/* Difficulty + tags */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        {difficulty && (
          <Chip label={difficulty} size="small" color={difficultyColor} variant="filled" />
        )}
        {tags?.map((tag) => (
          <Chip key={tag} label={tag} size="small" variant="outlined" />
        ))}
      </Box>

      {/* Statement */}
      {statement && (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem' }}
          >
            Problem
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.75 }}>
            {statement}
          </Typography>
        </Paper>
      )}

      {/* Examples */}
      {examples?.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          {examples.map((ex, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
              >
                Example {i + 1}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  <Typography component="span" variant="caption" color="text.disabled">
                    Input:{' '}
                  </Typography>
                  <Typography component="span" variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {ex.input}
                  </Typography>
                </Box>
                <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  <Typography component="span" variant="caption" color="text.disabled">
                    Output:{' '}
                  </Typography>
                  <Typography component="span" variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {ex.output}
                  </Typography>
                </Box>
                {ex.explanation && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {ex.explanation}
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Constraints */}
      {constraints?.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            Constraints
          </Typography>
          <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5 }}>
            {constraints.map((c, i) => (
              <Typography key={i} component="li" variant="caption" sx={{ fontFamily: 'monospace' }}>
                {c}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
    </Stack>
  );
}

// ── Algorithm sidebar ─────────────────────────────────────────────────────────
function AlgorithmSidebar({ algorithmSteps, complexity, activeStepId }) {
  const hasSidebar = algorithmSteps?.length > 0 || complexity?.length > 0;
  if (!hasSidebar) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 2,
        position: { lg: 'sticky' },
        top: { lg: 96 },
      }}
    >
      {algorithmSteps?.length > 0 && (
        <>
          <Typography variant="overline" color="text.secondary">
            Algorithm steps
          </Typography>
          <Box sx={{ mt: 1 }}>
            <AlgorithmStepsPanel steps={algorithmSteps} activeStepId={activeStepId} />
          </Box>
          {complexity?.length > 0 && <Divider sx={{ my: 2 }} />}
        </>
      )}

      {complexity?.length > 0 && (
        <>
          <Typography variant="overline" color="text.secondary">
            Complexity
          </Typography>
          <Box sx={{ mt: 1 }}>
            <KeyValueList items={complexity} />
          </Box>
        </>
      )}
    </Paper>
  );
}

// ── Main layout ───────────────────────────────────────────────────────────────
export default function DSATopicLayout({ content, Visualization }) {
  const [activeAlgorithmStepId, setActiveAlgorithmStepId] = useState(undefined);

  if (!content) return null;

  const {
    header,
    kind = 'data-structure',
    howItWorks,
    algorithmSteps,
    complexity,
    code,
    footerAlerts,
    hints,
    shortcuts,
    problem,
  } = content;

  // ── Normalise variant keys ────────────────────────────────────────────────
  // Content files may export topic-specific keys like `linkedListTypes`,
  // `treeTypes`, `graphTypes` etc. We collapse all of them into `variants`
  // so the layout only needs to handle one key.
  const VARIANT_KEYS = [
    'variants',
    'linkedListTypes',
    'treeTypes',
    'graphTypes',
    'sortTypes',
    'heapTypes',
  ];
  const variants =
    content.variants ??
    VARIANT_KEYS.map((k) => content[k]).find((v) => Array.isArray(v) && v.length > 0) ??
    [];

  const vizDefaults = content.visualization?.defaults ?? {};
  const visualizationKind = content.visualization?.kind ?? 'array-bars';

  // Algorithm pages get a sidebar; DS and Problem pages are full-width
  const isAlgorithm = kind === 'algorithm';
  const isProblem = kind === 'problem';
  const isDataStructure = !isAlgorithm && !isProblem;

  return (
    <Stack sx={{ gap: 3 }}>
      {/* ── Back navigation ─────────────────────────────────────────── */}
      <Button
        component={RouterLink}
        to={header?.backTo ?? '/dsa'}
        startIcon={<ArrowBackIcon />}
        variant="text"
        size="small"
        sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
      >
        Back to topics
      </Button>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <Stack sx={{ gap: 1.5 }}>
        {header?.overline && (
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
            {header.overline}
          </Typography>
        )}
        <Typography
          variant="h3"
          component="h1"
          sx={(theme) => ({
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          })}
        >
          {header?.title}
        </Typography>
        {header?.description && (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            {header.description}
          </Typography>
        )}
      </Stack>

      {/* ── PROBLEM: statement + examples + constraints ──────────────── */}
      {isProblem && <ProblemStatement problem={problem} />}

      {/* ── How it works (DS + Algorithm pages) ─────────────────────── */}
      {!isProblem && howItWorks?.items?.length > 0 && (
        <HowItWorksAlert title={howItWorks.title} items={howItWorks.items} />
      )}

      {/* ── Visualization ───────────────────────────────────────────── */}
      {/* Algorithm: viz + sticky sidebar grid                          */}
      {/* DS + Problem: full-width viz, no sidebar                      */}
      {isAlgorithm ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <Box>
            {Visualization ? (
              <Visualization
                defaults={vizDefaults}
                visualizationKind={visualizationKind}
                onHighlightChange={setActiveAlgorithmStepId}
              />
            ) : (
              <Alert severity="info">Visualization coming soon for this topic.</Alert>
            )}
          </Box>
          <AlgorithmSidebar
            algorithmSteps={algorithmSteps}
            complexity={complexity}
            activeStepId={activeAlgorithmStepId}
          />
        </Box>
      ) : (
        <Box>
          {Visualization ? (
            <Visualization
              defaults={vizDefaults}
              visualizationKind={visualizationKind}
              onHighlightChange={setActiveAlgorithmStepId}
            />
          ) : (
            <Alert severity="info">Visualization coming soon for this topic.</Alert>
          )}
        </Box>
      )}

      {/* ── Variant cards (data-structure pages only) ───────────────── */}
      {isDataStructure && variants.length > 0 && <VariantCards variants={variants} />}

      {/* ── Code snippets ───────────────────────────────────────────── */}
      {code?.files?.length > 0 && (
        <Stack sx={{ gap: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>
            {code.title ?? 'Code'}
          </Typography>
          <MultiTabCodeSnippet files={code.files} />
        </Stack>
      )}

      {/* ── Footer alerts ────────────────────────────────────────────── */}
      {footerAlerts?.map((block, index) => (
        <Alert key={index} severity={block.severity} title={block.title}>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {block.items?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </Box>
        </Alert>
      ))}

      {/* ── Hints ────────────────────────────────────────────────────── */}
      {hints?.length > 0 && (
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {hints.map((hint, i) => (
            <Typography key={i} component="li" variant="caption" color="text.secondary">
              {hint}
            </Typography>
          ))}
        </Box>
      )}

      {/* ── Keyboard shortcuts (algorithm pages) ─────────────────────── */}
      {shortcuts && <Alert severity="info">{shortcuts}</Alert>}
    </Stack>
  );
}
