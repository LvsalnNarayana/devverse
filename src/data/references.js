/**
 * Reference catalog — cards on /references and routes under /references/:id.
 * Only active references are shown in listing; details can resolve by id.
 */

const internal = (id) => `/references/${id}`;

/** Full catalog before active filtering. */
const referenceCatalog = [
  {
    id: 'redis-fundamentals',
    title: 'Redis Fundamentals',
    description:
      'Core concepts, data structures, commands, persistence, pub/sub, transactions, Lua scripting, and commands cheat sheet.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Redis', 'Caching', 'Database', 'Backend'],
    href: internal('redis-fundamentals'),
    active: true,
    pageStructure: '/pageStructures/references/redis/RedisFundamentals.md',
    content: '',
  },
  {
    id: 'redis-architecture',
    title: 'Redis Architecture & Patterns',
    description:
      'Configuration, replication, Sentinel, Cluster, caching patterns, distributed patterns, performance optimization, and best practices.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Redis', 'Distributed Systems', 'Caching', 'Backend'],
    href: internal('redis-architecture'),
    active: true,
    pageStructure: '/pageStructures/references/redis/RedisArchitecture.md',
    content: '',
  },
  {
    id: 'redis-spring-boot',
    title: 'Redis with Spring Boot',
    description:
      'RedisTemplate, Spring Cache, pub/sub, Redis Streams, Spring Session, Redisson distributed patterns, serialization, and testing.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Redis', 'Spring Boot', 'Java', 'Backend'],
    href: internal('redis-spring-boot'),
    active: true,
    pageStructure: '/pageStructures/references/redis/RedisSpringBoot.md',
    content: '',
  },
  {
    id: 'redis-deployment-monitoring',
    title: 'Redis Deployment & Monitoring',
    description:
      'Security, monitoring, Prometheus and Grafana setup, deployment strategies, Docker, Kubernetes, backup, recovery, and troubleshooting.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Redis', 'DevOps', 'Monitoring', 'Backend'],
    href: internal('redis-deployment-monitoring'),
    active: true,
    pageStructure: '/pageStructures/references/redis/RedisDeploymentMonitoring.md',
    content: '',
  },
  {
    id: 'postgresql-basics',
    title: 'PostgreSQL Basics',
    description:
      'Architecture, MVCC, WAL, indexing, EXPLAIN, VACUUM, partitioning, replication, backup/PITR, extensions, security, and tuning.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['PostgreSQL', 'SQL', 'Databases', 'Backend'],
    href: internal('postgresql-basics'),
    active: false,
  },
  {
    id: 'postgresql-case-study',
    title: 'PostgreSQL E-Commerce Case Study',
    description:
      'Full SQL case study: schema, JOINs, subqueries, CTEs, window functions, set operations, and business analytics with expected outputs.',
    type: 'Case Study',
    level: 'Intermediate',
    tags: ['PostgreSQL', 'SQL', 'Case Study', 'E-Commerce'],
    href: internal('postgresql-case-study'),
    active: false,
  },
  {
    id: 'mongodb-basics',
    title: 'MongoDB Basics',
    description:
      'Documents, schema design, embedding vs referencing, aggregation pipeline, indexing, replication, sharding, and transactions.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['MongoDB', 'NoSQL', 'Databases', 'Backend'],
    href: internal('mongodb-basics'),
    active: false,
  },
  {
    id: 'mongodb-case-study',
    title: 'MongoDB Case Study',
    description:
      'Hands-on MongoDB case study with schema patterns, queries, aggregation, and application-ready examples.',
    type: 'Case Study',
    level: 'Intermediate',
    tags: ['MongoDB', 'NoSQL', 'Case Study'],
    href: internal('mongodb-case-study'),
    active: false,
  },
  {
    id: 'influxdb-basics',
    title: 'InfluxDB Basics',
    description:
      'Time-series data model, buckets, retention, Flux/InfluxQL basics, writes, queries, and operational concepts.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['InfluxDB', 'Time Series', 'Databases', 'Observability'],
    href: internal('influxdb-basics'),
    active: false,
  },
  {
    id: 'influxdb-spring-boot',
    title: 'InfluxDB with Spring Boot',
    description:
      'Integrating InfluxDB from Spring Boot: clients, batch writes, metrics export, and dashboard-friendly patterns.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'InfluxDB', 'Metrics', 'Java'],
    href: internal('influxdb-spring-boot'),
    active: false,
  },
  {
    id: 'caching-strategies',
    title: 'Caching Strategies',
    description:
      'Cache-aside, read-through, write-through, invalidation, stampede protection, TTL design, and Redis-backed patterns.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Caching', 'Redis', 'Architecture', 'Performance'],
    href: internal('caching-strategies'),
    active: false,
  },
  {
    id: 'rabbitmq-fundamentals',
    title: 'RabbitMQ Fundamentals',
    description:
      'Core concepts, AMQP protocol, exchanges, queues, bindings, message lifecycle, dead letter exchanges, and CLI reference.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['RabbitMQ', 'Messaging', 'Event Driven', 'Backend'],
    href: internal('rabbitmq-fundamentals'),
    active: true,
    pageStructure: '/pageStructures/references/RabbitmqFundamentals.md',
    content: '',
  },
  {
    id: 'rabbitmq-architecture',
    title: 'RabbitMQ Architecture & Patterns',
    description:
      'Clustering, high availability, quorum queues, federation, messaging patterns, reliability guarantees, and performance optimization.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['RabbitMQ', 'Messaging', 'Distributed Systems', 'Backend'],
    href: internal('rabbitmq-architecture'),
    active: true,
    pageStructure: '/pageStructures/references/RabbitmqArchitecture.md',
    content: '',
  },
  {
    id: 'rabbitmq-spring-boot',
    title: 'RabbitMQ with Spring Boot',
    description:
      'Spring AMQP, RabbitTemplate, message listeners, serialization, error handling, publisher confirms, architecture patterns, and testing.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['RabbitMQ', 'Spring Boot', 'Java', 'Backend'],
    href: internal('rabbitmq-spring-boot'),
    active: true,
    pageStructure: '/pageStructures/references/RabbitmqSpringBoot.md',
    content: '',
  },
  {
    id: 'rabbitmq-deployment-monitoring',
    title: 'RabbitMQ Deployment & Monitoring',
    description:
      'Security, monitoring, Prometheus and Grafana setup, deployment strategies, Docker, Kubernetes, backup, recovery, and troubleshooting.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['RabbitMQ', 'DevOps', 'Monitoring', 'Backend'],
    href: internal('rabbitmq-deployment-monitoring'),
    active: true,
    pageStructure: '/pageStructures/references/RabbitmqDeploymentMonitoring.md',
    content: '',
  },
  {
    id: 'kafka-fundamentals',
    title: 'Apache Kafka Fundamentals',
    description:
      'Core concepts, architecture, topics, partitions, replication, log storage, and KRaft mode explained in depth.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Kafka', 'Messaging', 'Event Streaming', 'Backend'],
    href: internal('kafka-fundamentals'),
    active: true,
    pageStructure: '/pageStructures/references/KafkaFundamentals.md',
    content: '/configs/references/kafka-fundamentals.json',
  },
  {
    id: 'kafka-development',
    title: 'Apache Kafka Development',
    description:
      'Producers, consumers, serialization, transactions, Kafka Streams, Kafka Connect, and ksqlDB with code examples.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Kafka', 'Messaging', 'Event Streaming', 'Backend'],
    href: internal('kafka-development'),
    active: true,
    pageStructure: '/pageStructures/references/KafkaDevelopment.md',
    content: '',
  },
  {
    id: 'kafka-operations',
    title: 'Apache Kafka Operations',
    description:
      'Security, monitoring, performance tuning, cluster management, CLI reference, and troubleshooting for production Kafka.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Kafka', 'DevOps', 'Backend', 'Performance'],
    href: internal('kafka-operations'),
    active: true,
    pageStructure: '/pageStructures/references/KafkaOperations.md',
    content: '',
  },
  {
    id: 'kafka-spring-boot',
    title: 'Kafka with Spring Boot',
    description:
      'Spring Kafka and Spring Cloud Stream integration — producers, consumers, error handling, transactions, architecture patterns, and testing.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Kafka', 'Spring Boot', 'Java', 'Backend'],
    href: internal('kafka-spring-boot'),
    active: true,
    pageStructure: '/pageStructures/references/KafkaSpringBoot.md',
    content: '',
  },
  {
    id: 'kafka-spring-boot',
    title: 'Kafka with Spring Boot',
    description:
      'Spring Kafka templates, listeners, error handlers, transactions, Schema Registry, and exactly-once considerations.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'Kafka', 'Messaging', 'Java'],
    href: internal('kafka-spring-boot'),
    active: false,
  },
  {
    id: 'rabbitmq-vs-kafka',
    title: 'RabbitMQ vs Kafka',
    description:
      'When to use queues vs logs, delivery semantics, ordering, scaling, and hybrid event-driven designs.',
    type: 'Comparison',
    level: 'Intermediate',
    tags: ['RabbitMQ', 'Kafka', 'Messaging', 'Architecture'],
    href: internal('rabbitmq-vs-kafka'),
    active: false,
  },
  {
    id: 'spring-boot-fundamentals',
    title: 'Spring Boot Fundamentals',
    description:
      'What is Spring Boot, history, auto-configuration internals, starters, SpringApplication class, lifecycle, embedded server, profiles, and configuration properties.',
    type: 'Docs',
    level: 'Beginner',
    tags: ['Spring Boot', 'Java', 'Backend', 'Framework'],
    href: internal('spring-boot-fundamentals'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootFundamentals.md',
    content: '/configs/references/spring-boot-fundamentals.json',
  },
  {
    id: 'spring-boot-core',
    title: 'Spring Boot Core',
    description:
      'Dependency injection, all bean annotations, bean lifecycle, scopes, component scanning, conditional annotations, AOP, events, and ApplicationContext.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'Java', 'Backend', 'Framework'],
    href: internal('spring-boot-core'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootCore.md',
    content: '',
  },
  {
    id: 'spring-boot-web',
    title: 'Spring Boot Web',
    description:
      'REST controllers, all input and return formats, validation, exception handling, filters, interceptors, CORS, file upload and download, content negotiation.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'Java', 'REST', 'Backend'],
    href: internal('spring-boot-web'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootWeb.md',
    content: '',
  },
  {
    id: 'spring-boot-data',
    title: 'Spring Boot Data & JPA',
    description:
      'JPA deep dive, all entity and relationship annotations, repository methods, JPQL, transactions, Hibernate internals, pagination, auditing, and database migrations.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'JPA', 'Hibernate', 'Database', 'Backend'],
    href: internal('spring-boot-data'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootData.md',
    content: '',
  },
  {
    id: 'spring-boot-security',
    title: 'Spring Boot Security',
    description:
      'Security filter chain, all security annotations, authentication, JWT, OAuth2, authorization, CSRF, CORS, session management, and custom filters.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Spring Boot', 'Security', 'JWT', 'OAuth2', 'Backend'],
    href: internal('spring-boot-security'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootSecurity.md',
    content: '',
  },
  {
    id: 'spring-boot-advanced',
    title: 'Spring Boot Advanced',
    description:
      'JMS, file handling, async processing, scheduling, caching, virtual threads, WebFlux reactive programming, WebSocket, SSE, REST clients, i18n, events, and advanced configuration patterns.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Spring Boot', 'Java', 'Reactive', 'WebFlux', 'Backend'],
    href: internal('spring-boot-advanced'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootAdvanced.md',
    content: '',
  },
  {
    id: 'spring-boot-testing',
    title: 'Spring Boot Testing',
    description:
      'Unit testing, JUnit 5, Mockito, all test annotations, test slices, MockMvc, TestRestTemplate, WebTestClient, Testcontainers, and integration testing patterns.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'Testing', 'JUnit', 'Mockito', 'Backend'],
    href: internal('spring-boot-testing'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootTesting.md',
    content: '',
  },
  {
    id: 'spring-boot-deployment',
    title: 'Spring Boot Deployment & Monitoring',
    description:
      'Actuator, Micrometer metrics, logging, Docker, Kubernetes, GraalVM native image, Prometheus, Grafana, performance tuning, and troubleshooting.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Spring Boot', 'DevOps', 'Docker', 'Kubernetes', 'Monitoring'],
    href: internal('spring-boot-deployment'),
    active: true,
    pageStructure: '/pageStructures/references/springBoot/springBootDeployment.md',
    content: '',
  },
  {
    id: 'keycloak',
    title: 'Keycloak',
    description:
      'Realms, clients, OIDC/OAuth2 flows, user federation, roles, token configuration, and Spring Boot integration.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Keycloak', 'OAuth2', 'OIDC', 'Security'],
    href: internal('keycloak'),
    active: false,
  },
  {
    id: 'spring-jpa',
    title: 'Spring Data JPA (PostgreSQL & MongoDB)',
    description:
      'Entities, repositories, transactions, fetch strategies, N+1, auditing, Flyway, and Spring Data MongoDB patterns.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'JPA', 'PostgreSQL', 'MongoDB', 'Java'],
    href: internal('spring-jpa'),
    active: false,
  },
  {
    id: 'spring-boot-tuning',
    title: 'Spring Boot Performance Tuning',
    description:
      'JVM flags, connection pools, lazy loading, batching, caching, Actuator metrics, and production profiling.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Spring Boot', 'Performance', 'JVM', 'Java'],
    href: internal('spring-boot-tuning'),
    active: false,
  },
  {
    id: 'spring-boot-unit-testing',
    title: 'Spring Boot Unit & Integration Testing',
    description:
      'JUnit 5, Mockito, @WebMvcTest, MockMvc, Testcontainers, slice tests, and messaging/DB test doubles.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Spring Boot', 'Testing', 'JUnit', 'Java'],
    href: internal('spring-boot-unit-testing'),
    active: false,
  },
  {
    id: 'architecture-patterns',
    title: 'Architecture Patterns',
    description:
      'Layered, hexagonal, clean architecture, DDD, event-driven, modular monolith, and BFF patterns.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Architecture', 'DDD', 'Backend'],
    href: internal('architecture-patterns'),
    active: false,
  },
  {
    id: 'distributed-systems-patterns',
    title: 'Distributed Systems Patterns',
    description:
      'Saga, CQRS, event sourcing, circuit breakers, bulkheads, retries, idempotency, and consensus overview.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Distributed Systems', 'Architecture', 'Microservices'],
    href: internal('distributed-systems-patterns'),
    active: false,
  },
  {
    id: 'system-design',
    title: 'System Design',
    description:
      'Scalability, CAP, load balancing, API gateways, HLD case studies, and backend interview-style designs.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['System Design', 'Architecture', 'Backend'],
    href: internal('system-design'),
    active: false,
  },
  {
    id: 'microservices',
    title: 'Microservices',
    description:
      'Service boundaries, REST/gRPC, discovery, config, resilience (Resilience4j), tracing, and Spring Cloud overview.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Microservices', 'Spring Cloud', 'Architecture'],
    href: internal('microservices'),
    active: false,
  },
  {
    id: 'api-design',
    title: 'API Design',
    description:
      'REST conventions, OpenAPI, versioning, pagination, idempotency, rate limiting, GraphQL, and gRPC trade-offs.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['API', 'REST', 'OpenAPI', 'Backend'],
    href: internal('api-design'),
    active: false,
  },
  {
    id: 'performance-engineering-backend',
    title: 'Performance Engineering (Backend)',
    description:
      'JVM/GC tuning, profiling, query optimization, pooling, caching, horizontal scaling, and load testing.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Performance', 'JVM', 'Backend'],
    href: internal('performance-engineering-backend'),
    active: false,
  },
  {
    id: 'observability',
    title: 'Observability',
    description:
      'Structured logging, Micrometer, Prometheus, Grafana, OpenTelemetry, tracing, and SLO-oriented monitoring.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['Observability', 'Metrics', 'Tracing', 'Backend'],
    href: internal('observability'),
    active: false,
  },
  {
    id: 'docker',
    title: 'Docker',
    description:
      'Images, Dockerfile best practices, multi-stage builds, networking, volumes, Compose, and container security basics.',
    type: 'Docs',
    level: 'Beginner',
    tags: ['Docker', 'DevOps', 'Containers'],
    href: internal('docker'),
    active: false,
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes for Backend Engineers',
    description:
      'Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, HPA, and running Spring Boot on K8s.',
    type: 'Docs',
    level: 'Advanced',
    tags: ['Kubernetes', 'DevOps', 'Cloud'],
    href: internal('kubernetes'),
    active: false,
  },
  {
    id: 'git',
    title: 'Git',
    description:
      'Branching workflows, rebasing, cherry-pick, hooks, monorepo tips, and collaboration patterns for backend teams.',
    type: 'Docs',
    level: 'Beginner',
    tags: ['Git', 'DevOps', 'Workflow'],
    href: internal('git'),
    active: false,
  },
  {
    id: 'git-case-study',
    title: 'Git Case Study',
    description:
      'Team release workflow: feature branches, pull requests, releases, hotfixes, and safe history on shared repositories.',
    type: 'Case Study',
    level: 'Intermediate',
    tags: ['Git', 'GitHub', 'Case Study', 'Workflow', 'DevOps'],
    href: internal('git-case-study'),
    active: false,
  },
  {
    id: 'react',
    title: 'React',
    description:
      'Components, hooks, state, routing, data fetching, forms, performance, and integrating with Spring Boot APIs.',
    type: 'Docs',
    level: 'Intermediate',
    tags: ['React', 'Frontend', 'JavaScript'],
    href: internal('react'),
    active: false,
  },
  {
    id: 'cheat-sheets',
    title: 'Cheat Sheets',
    description:
      'Quick-reference commands and snippets: Redis, SQL, Docker, Kubernetes, Linux, and Spring Boot essentials.',
    type: 'Cheat Sheet',
    level: 'Beginner',
    tags: ['Cheat Sheet', 'Reference', 'Backend'],
    href: internal('cheat-sheets'),
    active: false,
  },
];

export const referenceTypes = [
  'All',
  'Docs',
  'Case Study',
  'Cheat Sheet',
  'Comparison',
  'Book',
  'Blog',
  'Repo',
];

export const referenceLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

/** Active references shown on the listing page. */
export const references = referenceCatalog.filter((ref) => ref.active === true);

export const referenceAllTags = [...new Set(references.flatMap((r) => r.tags))].sort((a, b) =>
  a.localeCompare(b),
);

/**
 * Page integration note:
 * - `src/pages/References.jsx` passes `references`, `referenceAllTags`, and filter option arrays
 *   into `ModuleListingLayout`.
 * - `public/configs/modulePageLayouts.json` uses `optionsSource: "referenceTypes"` and
 *   `"referenceLevels"`, mapped in the page wrapper.
 */

// Filter by type
export const filterByType = (type) => {
  if (!type || type === 'All') return references;
  return references.filter((ref) => ref.type === type);
};

// Filter by level
export const filterByLevel = (level) => {
  if (!level || level === 'All') return references;
  return references.filter((ref) => ref.level === level);
};

// Filter by tag
export const filterByTag = (tag) => {
  if (!tag) return references;
  return references.filter((ref) => ref.tags.includes(tag));
};

// Filter by multiple tags (AND logic)
export const filterByTags = (tags) => {
  if (!tags || tags.length === 0) return references;
  return references.filter((ref) => tags.every((tag) => ref.tags.includes(tag)));
};

// Search references
export const searchReferences = (query) => {
  if (!query) return references;
  const lowercaseQuery = query.toLowerCase();
  return references.filter(
    (ref) =>
      ref.id.toLowerCase().includes(lowercaseQuery) ||
      ref.title.toLowerCase().includes(lowercaseQuery) ||
      ref.description.toLowerCase().includes(lowercaseQuery) ||
      ref.type.toLowerCase().includes(lowercaseQuery) ||
      ref.level.toLowerCase().includes(lowercaseQuery) ||
      ref.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  );
};

// Sort references
export const sortReferences = (items, sortBy = 'title') => {
  const sorted = [...items];
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

// Get references by type with count
export const getTypeStats = () => {
  return referenceTypes
    .filter((type) => type !== 'All')
    .map((type) => ({
      type,
      count: filterByType(type).length,
    }));
};

// Get references by level with count
export const getLevelStats = () => {
  return referenceLevels
    .filter((level) => level !== 'All')
    .map((level) => ({
      level,
      count: filterByLevel(level).length,
    }));
};

// Get tag usage statistics
export const getTagStats = () => {
  return referenceAllTags
    .map((tag) => ({
      tag,
      count: filterByTag(tag).length,
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * @param {string} id
 * @returns {typeof referenceCatalog[number] | undefined}
 */
export function getReferenceById(id) {
  return referenceCatalog.find((ref) => ref.id === id);
}
