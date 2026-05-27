/** @param {string} [lang] */
export function normalizeCodeLang(lang) {
  if (!lang) return 'plaintext';
  return String(lang).toLowerCase().trim();
}

const LANG_LABEL = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  py: 'Python',
  python: 'Python',
  java: 'Java',
  go: 'Go',
  rs: 'Rust',
  rust: 'Rust',
  rb: 'Ruby',
  ruby: 'Ruby',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  css: 'CSS',
  html: 'HTML',
  xml: 'XML',
  md: 'Markdown',
  markdown: 'Markdown',
  lua: 'Lua',
  plaintext: 'Plain text',
};

/** @param {string} lang */
export function getCodeLangLabel(lang) {
  const key = normalizeCodeLang(lang);
  return LANG_LABEL[key] ?? key.toUpperCase();
}
