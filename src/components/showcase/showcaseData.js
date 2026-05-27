/** Default carousel slides when a carouselPlayground block omits `slides` (see public/configs/components/showcase.json). */
export const CAROUSEL_DISPLAY_CARDS = [
  {
    title: 'Aggregation Pipeline Mastery',
    description: 'MongoDB $match, $group, $lookup, and $facet in production analytics.',
    tags: ['MongoDB', 'Case Study'],
    to: '/blogs-and-case-studies/aggregation-pipeline-mastery',
    coverColor: '#1976d2',
  },
  {
    title: 'Kafka Event Streaming',
    description: 'Producers, consumers, partitions, and delivery semantics.',
    tags: ['Kafka', 'Messaging'],
    to: '/case-studies',
    coverColor: '#ed6c02',
  },
  {
    title: 'Binary Search Patterns',
    description: 'Classic divide-and-conquer with visualization-friendly steps.',
    tags: ['DSA', 'Algorithms'],
    to: '/dsa',
    coverColor: '#2e7d32',
  },
  {
    title: 'Redis Caching Layer',
    description: 'TTL strategies, cache-aside, and invalidation patterns.',
    tags: ['Redis', 'Performance'],
    coverColor: '#d32f2f',
  },
  {
    title: 'API Gateway Routing',
    description: 'Rate limits, auth, and service discovery at the edge.',
    tags: ['Gateway', 'Microservices'],
    coverColor: '#7b1fa2',
  },
  {
    title: 'Postgres Index Tuning',
    description: 'B-tree vs GIN, explain plans, and slow-query workflows.',
    tags: ['Postgres', 'Database'],
    coverColor: '#0288d1',
  },
  {
    title: 'Docker Compose Stacks',
    description: 'Multi-service local dev with health checks and volumes.',
    tags: ['Docker', 'DevOps'],
    coverColor: '#455a64',
  },
  {
    title: 'OpenTelemetry Traces',
    description: 'Distributed tracing across microservices with exemplars.',
    tags: ['Observability', 'SRE'],
    coverColor: '#00695c',
  },
];
