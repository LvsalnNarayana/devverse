/**
 * Prebuilt microservice modules — listing catalog and helpers.
 * Detail content: public/configs/prebuiltModules/*.json
 */

const internal = (id) => `/modules/${id}`;

const prebuiltModuleCatalog = [
  {
    id: 'ecommerce-microservices',
    title: 'E-Commerce Microservices Suite',
    description:
      'Drop-in Spring Boot services for catalog, cart, orders, payments, inventory, and notifications — wired for event-driven commerce flows.',
    category: 'E-Commerce',
    tags: ['Microservices', 'Spring Boot', 'Kafka', 'PostgreSQL', 'E-Commerce'],
    githubUrl: 'https://github.com/example/ecommerce-microservices',
    href: internal('ecommerce-microservices'),
    active: true,
    content: '/configs/prebuiltModules/ecommerce-microservices.json',
    pageStructure: '/pageStructures/prebuiltModules/EcommerceMicroservices.md',
  },
  {
    id: 'uber-clone-microservices',
    title: 'Uber Clone Microservices',
    description:
      'Ride-matching platform building blocks: trip lifecycle, driver location, pricing, payments, and real-time dispatch.',
    category: 'Ride Sharing',
    tags: ['Microservices', 'Geolocation', 'Real-Time', 'Payments', 'Ride Sharing'],
    githubUrl: 'https://github.com/example/uber-clone-microservices',
    href: internal('uber-clone-microservices'),
    active: false,
  },
  {
    id: 'facebook-clone-microservices',
    title: 'Facebook Clone Microservices',
    description:
      'Social graph primitives: profiles, posts, feeds, friends, messaging hooks, and media upload pipelines.',
    category: 'Social Network',
    tags: ['Microservices', 'Social', 'Feed', 'Graph', 'Messaging'],
    githubUrl: 'https://github.com/example/facebook-clone-microservices',
    href: internal('facebook-clone-microservices'),
    active: false,
  },
];

export const prebuiltModuleCategories = [
  'All',
  'E-Commerce',
  'Ride Sharing',
  'Social Network',
];

export const prebuiltModules = prebuiltModuleCatalog.filter((item) => item.active === true);

export const prebuiltModuleAllTags = [
  ...new Set(prebuiltModuleCatalog.flatMap((item) => item.tags)),
].sort((a, b) => a.localeCompare(b));

export const filterPrebuiltModulesByCategory = (category) => {
  if (!category || category === 'All') return prebuiltModules;
  return prebuiltModules.filter((item) => item.category === category);
};

export const filterPrebuiltModulesByTag = (tag) => {
  if (!tag) return prebuiltModules;
  return prebuiltModules.filter((item) => item.tags.includes(tag));
};

export const filterPrebuiltModulesByTags = (tags) => {
  if (!tags?.length) return prebuiltModules;
  return prebuiltModules.filter((item) => tags.every((tag) => item.tags.includes(tag)));
};

export const searchPrebuiltModules = (query) => {
  if (!query) return prebuiltModules;
  const q = query.toLowerCase();
  return prebuiltModules.filter(
    (item) =>
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
};

export const sortPrebuiltModules = (items, sortBy = 'title') => {
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

export const getPrebuiltModuleCategoryStats = () =>
  prebuiltModuleCategories
    .filter((c) => c !== 'All')
    .map((category) => ({
      category,
      count: filterPrebuiltModulesByCategory(category).length,
    }));

export const getPrebuiltModuleTagStats = () =>
  prebuiltModuleAllTags
    .map((tag) => ({ tag, count: filterPrebuiltModulesByTag(tag).length }))
    .sort((a, b) => b.count - a.count);

export function getPrebuiltModuleById(id) {
  return prebuiltModuleCatalog.find((item) => item.id === id);
}
