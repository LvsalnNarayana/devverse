/** @param {import('@mui/material').Theme} theme */
export function getCodeSnippetSurfaceSx(theme, { maxHeight, embedded = false } = {}) {
  const isDark = theme.palette.mode === 'dark';
  const surface = isDark ? '#1e293b' : '#f1f5f9';

  return {
    borderRadius: embedded ? 0 : 2,
    overflow: 'hidden',
    border: embedded ? 'none' : '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: surface,
    '& pre[class*="language-"], & code[class*="language-"]': {
      background: 'transparent',
      backgroundColor: 'transparent',
      textShadow: 'none',
      boxShadow: 'none',
      border: 'none',
      margin: 0,
      color: isDark ? '#e2e8f0' : '#0f172a',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '0.8125rem',
      lineHeight: 1.65,
    },
    '& pre[class*="language-"]': {
      padding: theme.spacing(1.5, 2),
      overflow: 'auto',
      maxHeight: maxHeight || 'none',
    },
    '& code[class*="language-"]': {
      display: 'block',
      whiteSpace: 'pre',
    },
    '& .token': { background: 'transparent', textShadow: 'none' },
    '& .token.comment, & .token.prolog, & .token.doctype, & .token.cdata': {
      color: isDark ? '#94a3b8' : '#64748b',
      fontStyle: 'italic',
    },
    '& .token.punctuation': { color: isDark ? '#cbd5e1' : '#475569' },
    '& .token.property, & .token.tag, & .token.boolean, & .token.number, & .token.constant, & .token.symbol':
      { color: isDark ? '#f472b6' : '#be185d' },
    '& .token.selector, & .token.attr-name, & .token.string, & .token.char, & .token.inserted':
      { color: isDark ? '#86efac' : '#15803d' },
    '& .token.operator, & .token.entity, & .token.url': {
      color: isDark ? '#fcd34d' : '#b45309',
    },
    '& .token.atrule, & .token.attr-value, & .token.keyword': {
      color: isDark ? '#93c5fd' : '#1d4ed8',
    },
    '& .token.function, & .token.class-name': {
      color: isDark ? '#c4b5fd' : '#6d28d9',
    },
    '& .token.regex, & .token.important, & .token.variable': {
      color: isDark ? '#fca5a5' : '#b91c1c',
    },
  };
}
