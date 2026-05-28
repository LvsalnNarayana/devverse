━━━ PAGE 3: redis-spring-boot ━━━
(Spring Data Redis, RedisTemplate, caching, pub/sub, streams, patterns, testing)

├── Section 1 · `spring-redis-setup` · Setup & Configuration
│ ├── `setup-intro` (typography)
│ ├── `maven-gradle-dependencies` (multiTabCodeSnippet) maven/gradle
│ ├── `lettuce-vs-jedis-table` (table)
│ ├── `redis-connection-config` (codeSnippet) java
│ ├── `connection-pool-config` (codeSnippet) java
│ └── `sentinel-cluster-config` (multiTabCodeSnippet) sentinel/cluster

├── Section 2 · `redis-template` · RedisTemplate
│ ├── `redistemplate-intro` (typography)
│ ├── `redistemplate-config` (codeSnippet) java
│ ├── `redistemplate-serializers-table` (table)
│ ├── `string-operations` (codeSnippet) java
│ ├── `hash-operations` (codeSnippet) java
│ ├── `list-operations` (codeSnippet) java
│ ├── `set-operations` (codeSnippet) java
│ ├── `sorted-set-operations` (codeSnippet) java
│ └── `key-expiry-operations` (codeSnippet) java

├── Section 3 · `spring-cache` · Spring Cache Abstraction
│ ├── `spring-cache-intro` (typography)
│ ├── `spring-cache-architecture-diagram` (diagram)
│ ├── `cache-manager-config` (codeSnippet) java
│ ├── `cacheable-annotation` (codeSnippet) java
│ ├── `cache-put-evict` (codeSnippet) java
│ ├── `cache-ttl-config` (codeSnippet) java
│ ├── `cache-annotations-table` (table)
│ └── `cache-key-generation` (codeSnippet) java

├── Section 4 · `spring-pubsub` · Pub/Sub with Spring
│ ├── `spring-pubsub-intro` (typography)
│ ├── `pubsub-architecture-diagram` (diagram)
│ ├── `message-listener-config` (codeSnippet) java
│ ├── `redis-message-publisher` (codeSnippet) java
│ ├── `message-listener-adapter` (codeSnippet) java
│ └── `pubsub-error-handling` (codeSnippet) java

├── Section 5 · `spring-streams` · Redis Streams with Spring
│ ├── `streams-intro` (typography)
│ ├── `streams-architecture-diagram` (diagram)
│ ├── `stream-producer-example` (codeSnippet) java
│ ├── `stream-consumer-example` (codeSnippet) java
│ ├── `consumer-group-config` (codeSnippet) java
│ └── `stream-error-handling` (codeSnippet) java

├── Section 6 · `spring-session` · Spring Session with Redis
│ ├── `spring-session-intro` (typography)
│ ├── `spring-session-architecture-diagram` (diagram)
│ ├── `spring-session-dependency` (codeSnippet) java
│ ├── `spring-session-config` (codeSnippet) java
│ ├── `session-serialization` (codeSnippet) java
│ └── `session-ttl-config` (codeSnippet) java

├── Section 7 · `spring-distributed-patterns` · Distributed Patterns with Spring
│ ├── `patterns-intro` (typography)
│ ├── `redisson-overview` (contentCard) tinted
│ ├── `redisson-dependency` (codeSnippet) java
│ ├── `redisson-distributed-lock` (codeSnippet) java
│ ├── `rate-limiter-implementation` (codeSnippet) java
│ ├── `bloom-filter-implementation` (codeSnippet) java
│ └── `distributed-patterns-diagram` (diagram)

├── Section 8 · `spring-serialization` · Serialization & Deserialization
│ ├── `serialization-intro` (typography)
│ ├── `json-serializer-config` (codeSnippet) java
│ ├── `custom-serializer` (codeSnippet) java
│ ├── `generic-jackson-config` (codeSnippet) java
│ ├── `serialization-comparison-table` (table)
│ └── `trusted-packages-config` (contentCard) tinted

└── Section 9 · `spring-redis-testing` · Testing
├── `testing-intro` (typography)
├── `embedded-redis-setup` (codeSnippet) java
├── `testcontainers-redis-setup` (codeSnippet) java
├── `cache-test-example` (codeSnippet) java
├── `redistemplate-test-example` (codeSnippet) java
├── `pubsub-test-example` (codeSnippet) java
└── `testing-strategies-table` (table)
