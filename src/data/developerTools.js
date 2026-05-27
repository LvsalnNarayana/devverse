/**
 * Developer tools catalog — external links only (no detail pages).
 */

export const developerToolCategories = [
  'All',
  'Formatters',
  'Converters',
  'Testers',
  'Generators',
];

const developerToolCatalog = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Paste JSON, format, minify, and validate syntax with clear error messages.',
    category: 'Formatters',
    tags: ['JSON', 'Formatter', 'Validator'],
    href: 'https://jsonformatter.org/',
    active: true,
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Live regular expression testing with match highlighting and capture groups.',
    category: 'Testers',
    tags: ['Regex', 'Testing', 'JavaScript'],
    href: 'https://regex101.com/',
    active: true,
  },
  {
    id: 'base64-encoder',
    title: 'Base64 Encode / Decode',
    description: 'Convert text and files to Base64 and back for quick API debugging.',
    category: 'Converters',
    tags: ['Base64', 'Encoding', 'Converter'],
    href: 'https://www.base64encode.org/',
    active: true,
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Inspect JWT header and payload claims without sending tokens to a server.',
    category: 'Testers',
    tags: ['JWT', 'Auth', 'Security'],
    href: 'https://jwt.io/',
    active: true,
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate v1 and v4 UUIDs for database keys and distributed IDs.',
    category: 'Generators',
    tags: ['UUID', 'Generator', 'IDs'],
    href: 'https://www.uuidgenerator.net/',
    active: true,
  },
  {
    id: 'cron-expression',
    title: 'Cron Expression Generator',
    description: 'Build and explain cron schedules for batch jobs and Kubernetes CronJobs.',
    category: 'Generators',
    tags: ['Cron', 'Scheduler', 'DevOps'],
    href: 'https://crontab.guru/',
    active: true,
  },
];

export const developerTools = developerToolCatalog.filter((item) => item.active === true);

export const developerToolAllTags = [
  ...new Set(developerToolCatalog.flatMap((item) => item.tags)),
].sort((a, b) => a.localeCompare(b));

export const filterDeveloperToolsByCategory = (category) => {
  if (!category || category === 'All') return developerTools;
  return developerTools.filter((item) => item.category === category);
};

export const filterDeveloperToolsByTag = (tag) => {
  if (!tag) return developerTools;
  return developerTools.filter((item) => item.tags.includes(tag));
};

export const filterDeveloperToolsByTags = (tags) => {
  if (!tags?.length) return developerTools;
  return developerTools.filter((item) => tags.every((tag) => item.tags.includes(tag)));
};

export const searchDeveloperTools = (query) => {
  if (!query) return developerTools;
  const q = query.toLowerCase();
  return developerTools.filter(
    (item) =>
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
};

export const sortDeveloperTools = (items, sortBy = 'title') => {
  const sorted = [...items];
  switch (sortBy) {
    case 'category':
      return sorted.sort(
        (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
      );
    case 'title':
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
};

export const getDeveloperToolCategoryStats = () =>
  developerToolCategories
    .filter((c) => c !== 'All')
    .map((category) => ({
      category,
      count: filterDeveloperToolsByCategory(category).length,
    }));

export const getDeveloperToolTagStats = () =>
  developerToolAllTags
    .map((tag) => ({ tag, count: filterDeveloperToolsByTag(tag).length }))
    .sort((a, b) => b.count - a.count);

export function getDeveloperToolById(id) {
  return developerToolCatalog.find((item) => item.id === id);
}
