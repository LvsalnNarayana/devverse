/**
 * Shared styles for inline HTML from JSON (`<code>`, links, lists inside strings).
 * Use with `dangerouslySetInnerHTML` via RichText / HtmlContent.
 */
export const RICH_HTML_SX = {
  '& p': { my: 0.75 },
  '& p:first-of-type': { mt: 0 },
  '& p:last-of-type': { mb: 0 },
  '& ul, & ol': { pl: 2.5, my: 0.75 },
  '& li': { mb: 0.35 },
  '& code': {
    px: 0.75,
    py: 0.25,
    borderRadius: 0.75,
    fontSize: '0.85em',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    bgcolor: 'action.hover',
    wordBreak: 'break-word',
    color:"#D22B2B"
  },
  '& a': {
    color: 'primary.main',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
  '& strong': { fontWeight: 600 },
};

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function containsHtmlMarkup(value) {
  if (typeof value !== 'string') return false;
  return /<\/?[a-z][\w-]*(\s[^>]*)?\/?>/i.test(value);
}
