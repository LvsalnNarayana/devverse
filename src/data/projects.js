/**
 * Full-stack project catalog and helpers.
 * Detail content: public/configs/projects/*.json
 */

const internal = (id) => `/projects/${id}`;

const projectCatalog = [
  {
    id: 'google-docs-clone',
    title: 'Google Docs Clone',
    description:
      'Collaborative rich-text editor with real-time cursors, document versioning, comments, and role-based sharing.',
    category: 'Productivity',
    tags: ['React', 'WebSocket', 'CRDT', 'Collaboration', 'Full-Stack'],
    githubUrl: 'https://github.com/example/google-docs-clone',
    href: internal('google-docs-clone'),
    active: true,
    content: '/configs/projects/google-docs-clone.json',
    pageStructure: '/pageStructures/projects/GoogleDocsClone.md',
  },
  {
    id: 'google-meet-clone',
    title: 'Google Meet Clone',
    description:
      'Video meetings with WebRTC rooms, screen share, chat sidebar, and calendar-linked scheduling.',
    category: 'Communication',
    tags: ['WebRTC', 'React', 'Node.js', 'Real-Time', 'Video'],
    githubUrl: 'https://github.com/example/google-meet-clone',
    href: internal('google-meet-clone'),
    active: false,
  },
  {
    id: 'facebook-clone',
    title: 'Facebook Clone',
    description:
      'Social network with news feed, friend graph, reactions, groups, and photo albums backed by scalable APIs.',
    category: 'Social',
    tags: ['React', 'GraphQL', 'Microservices', 'Social', 'Feed'],
    githubUrl: 'https://github.com/example/facebook-clone',
    href: internal('facebook-clone'),
    active: false,
  },
  {
    id: 'google-calendar-clone',
    title: 'Google Calendar Clone',
    description:
      'Shared calendars, recurring events, timezone-aware scheduling, reminders, and invite workflows.',
    category: 'Calendar',
    tags: ['React', 'Calendar', 'Scheduling', 'iCal', 'Full-Stack'],
    githubUrl: 'https://github.com/example/google-calendar-clone',
    href: internal('google-calendar-clone'),
    active: false,
  },
];

export const projectCategories = [
  'All',
  'Productivity',
  'Communication',
  'Social',
  'Calendar',
];

export const projects = projectCatalog.filter((item) => item.active === true);

export const projectAllTags = [...new Set(projectCatalog.flatMap((item) => item.tags))].sort((a, b) =>
  a.localeCompare(b),
);

export const filterProjectsByCategory = (category) => {
  if (!category || category === 'All') return projects;
  return projects.filter((item) => item.category === category);
};

export const filterProjectsByTag = (tag) => {
  if (!tag) return projects;
  return projects.filter((item) => item.tags.includes(tag));
};

export const filterProjectsByTags = (tags) => {
  if (!tags?.length) return projects;
  return projects.filter((item) => tags.every((tag) => item.tags.includes(tag)));
};

export const searchProjects = (query) => {
  if (!query) return projects;
  const q = query.toLowerCase();
  return projects.filter(
    (item) =>
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
};

export const sortProjects = (items, sortBy = 'title') => {
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

export const getProjectCategoryStats = () =>
  projectCategories
    .filter((c) => c !== 'All')
    .map((category) => ({
      category,
      count: filterProjectsByCategory(category).length,
    }));

export const getProjectTagStats = () =>
  projectAllTags
    .map((tag) => ({ tag, count: filterProjectsByTag(tag).length }))
    .sort((a, b) => b.count - a.count);

export function getProjectById(id) {
  return projectCatalog.find((item) => item.id === id);
}
