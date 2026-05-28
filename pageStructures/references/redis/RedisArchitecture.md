━━━ PAGE 2: redis-architecture ━━━
(Replication, Sentinel, Cluster, caching patterns, distributed patterns, config, best practices)

├── Section 1 · `redis-conf` · redis.conf Configuration
│ ├── `config-intro` (typography)
│ ├── `subsection: network-settings`
│ │ └── `network-table` (table)
│ ├── `subsection: memory-settings`
│ │ └── `memory-table` (table)
│ ├── `subsection: persistence-settings`
│ │ └── `persistence-table` (table)
│ ├── `subsection: security-settings`
│ │ ├── `security-table` (table)
│ │ └── `security-best-practices` (alert) warning
│ ├── `subsection: replication-settings`
│ │ └── `replication-table` (table)
│ ├── `subsection: performance-tuning`
│ │ └── `performance-table` (table)
│ └── `configuration-example` (codeSnippet) conf

├── Section 2 · `scalability-clustering` · Replication & High Availability
│ ├── `scalability-intro` (typography)
│ ├── `scaling-strategies-diagram` (diagram)
│ ├── `subsection: replication-section`
│ │ ├── `replication-intro` (typography)
│ │ ├── `replication-diagram` (diagram)
│ │ ├── `replication-process` (contentCard) tinted
│ │ ├── `replication-types` (table)
│ │ ├── `replication-configuration` (codeSnippet) conf
│ │ └── `replication-monitoring` (contentCard) outlined
│ ├── `subsection: sentinel-section`
│ │ ├── `sentinel-intro` (typography)
│ │ ├── `sentinel-diagram` (diagram)
│ │ ├── `sentinel-features` (contentCard) tinted
│ │ ├── `sentinel-failover` (contentCard) outlined
│ │ ├── `sentinel-configuration` (codeSnippet) conf
│ │ ├── `sentinel-quorum` (table)
│ │ └── `sentinel-commands` (table)
│ ├── `subsection: cluster-section`
│ │ ├── `cluster-intro` (typography)
│ │ ├── `cluster-diagram` (diagram)
│ │ ├── `cluster-features` (contentCard) tinted
│ │ ├── `hash-slots` (contentCard) outlined
│ │ ├── `hash-slot-diagram` (diagram)
│ │ ├── `cluster-setup` (codeSnippet) bash
│ │ ├── `cluster-resharding` (contentCard) tinted
│ │ ├── `cluster-limitations` (alert) warning
│ │ ├── `cluster-commands` (table)
│ │ └── `cluster-vs-sentinel` (table)
│ └── `scaling-recommendations` (contentCard) outlined

├── Section 3 · `caching-patterns` · Caching Patterns
│ ├── `caching-patterns-intro` (typography)
│ ├── `subsection: cache-aside`
│ │ ├── `cache-aside-description` (typography)
│ │ ├── `cache-aside-diagram` (diagram)
│ │ ├── `cache-aside-pros-cons` (table)
│ │ └── `cache-aside-example` (codeSnippet) java
│ ├── `subsection: write-through`
│ │ ├── `write-through-description` (typography)
│ │ ├── `write-through-diagram` (diagram)
│ │ ├── `write-through-pros-cons` (table)
│ │ └── `write-through-example` (codeSnippet) java
│ ├── `subsection: write-behind`
│ │ ├── `write-behind-description` (typography)
│ │ ├── `write-behind-diagram` (diagram)
│ │ ├── `write-behind-pros-cons` (table)
│ │ └── `write-behind-example` (codeSnippet) java
│ ├── `subsection: read-through`
│ │ ├── `read-through-description` (typography)
│ │ ├── `read-through-diagram` (diagram)
│ │ ├── `read-through-pros-cons` (table)
│ │ └── `read-through-example` (codeSnippet) java
│ └── `caching-patterns-comparison-table` (table)

├── Section 4 · `distributed-patterns` · Distributed Patterns
│ ├── `distributed-patterns-intro` (typography)
│ ├── `subsection: distributed-locking`
│ │ ├── `distributed-lock-description` (typography)
│ │ ├── `distributed-lock-diagram` (diagram)
│ │ ├── `redlock-algorithm` (contentCard) tinted
│ │ ├── `redlock-implementation` (codeSnippet) java
│ │ └── `lock-pitfalls` (alert) warning
│ ├── `subsection: rate-limiting-pattern`
│ │ ├── `rate-limiter-description` (typography)
│ │ ├── `rate-limiter-diagram` (diagram)
│ │ ├── `token-bucket-implementation` (codeSnippet) java
│ │ └── `sliding-window-implementation` (codeSnippet) java
│ ├── `subsection: leaderboard-pattern`
│ │ ├── `leaderboard-description` (typography)
│ │ ├── `leaderboard-implementation` (codeSnippet) java
│ │ └── `leaderboard-pagination` (codeSnippet) java
│ ├── `subsection: session-store-pattern`
│ │ ├── `session-store-description` (typography)
│ │ ├── `session-store-diagram` (diagram)
│ │ └── `session-store-implementation` (codeSnippet) java
│ ├── `subsection: job-queue-pattern`
│ │ ├── `job-queue-description` (typography)
│ │ ├── `job-queue-diagram` (diagram)
│ │ └── `job-queue-implementation` (codeSnippet) java
│ └── `distributed-patterns-comparison` (table)

├── Section 5 · `performance-optimization` · Performance Optimization
│ ├── `performance-intro` (typography)
│ ├── `optimization-areas` (contentCard) tinted
│ ├── `subsection: key-design`
│ │ ├── `key-naming` (contentCard) outlined
│ │ └── `key-examples` (table)
│ ├── `subsection: pipeline-section`
│ │ ├── `pipeline-intro` (typography)
│ │ ├── `pipeline-benefits` (contentCard) tinted
│ │ ├── `pipeline-example` (codeSnippet) java
│ │ └── `pipeline-vs-transaction` (table)
│ ├── `connection-pooling` (contentCard) outlined
│ ├── `subsection: memory-optimization`
│ │ ├── `memory-tips` (contentCard) tinted
│ │ └── `memory-analysis` (codeSnippet) bash
│ └── `command-optimization` (table)

├── Section 6 · `migration-strategies` · Migration Strategies
│ ├── `migration-intro` (typography)
│ ├── `migration-approaches` (contentCard) tinted
│ ├── `dual-write-pattern` (contentCard) outlined
│ ├── `migration-steps` (list) ordered
│ ├── `version-upgrade` (contentCard) tinted
│ └── `rollback-strategy` (alert) warning

└── Section 7 · `best-practices-pitfalls` · Best Practices & Pitfalls
├── `best-practices-intro` (typography)
├── `best-practices-card` (contentCard) tinted
├── `design-patterns` (contentCard) outlined
├── `pitfalls-card` (contentCard) tinted
├── `antipatterns-table` (table)
└── `production-readiness` (contentCard) outlined
