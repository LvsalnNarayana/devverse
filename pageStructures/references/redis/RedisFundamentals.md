━━━ PAGE 1: redis-fundamentals ━━━
(What it is, why, internals, data structures, commands, persistence, pub/sub, transactions)

├── Section 1 · `what-is-redis` · What is Redis
│ ├── `redis-definition` (typography)
│ ├── `core-characteristics` (contentCard) tinted
│ ├── `redis-as-in-memory-store` (contentCard) outlined
│ ├── `key-value-paradigm` (contentCard) tinted
│ └── `single-threaded-model` (contentCard) outlined

├── Section 2 · `history-of-redis` · History of Redis
│ ├── `origin-story` (typography)
│ ├── `major-milestones` (table)
│ └── `evolution-timeline` (contentCard) tinted

├── Section 3 · `why-redis` · Why Redis
│ ├── `why-intro` (typography)
│ ├── `subsection: common-use-cases`
│ │ ├── `use-cases-intro` (typography)
│ │ ├── `use-case-caching` (contentCard) outlined
│ │ ├── `use-case-sessions` (contentCard) outlined
│ │ ├── `use-case-analytics` (contentCard) outlined
│ │ ├── `use-case-rate-limiting` (contentCard) outlined
│ │ ├── `use-case-messaging` (contentCard) outlined
│ │ ├── `use-case-geospatial` (contentCard) outlined
│ │ ├── `use-case-search` (contentCard) outlined
│ │ └── `use-case-locks` (contentCard) outlined
│ ├── `performance-benefits` (contentCard) tinted
│ ├── `flexibility-advantages` (contentCard) outlined
│ ├── `simplicity-factor` (contentCard) tinted
│ ├── `scalability-reliability` (contentCard) outlined
│ └── `ecosystem-support` (contentCard) tinted

├── Section 4 · `redis-vs-alternatives` · Redis vs Alternatives
│ ├── `comparison-intro` (typography)
│ ├── `comparison-table` (table)
│ └── `comparison-summary` (contentCard) tinted

├── Section 5 · `when-to-use-redis` · When to Use Redis
│ ├── `when-to-use-intro` (typography)
│ ├── `subsection: major-use-cases`
│ │ ├── `caching-use-case` (contentCard) tinted
│ │ ├── `caching-strategies` (table)
│ │ ├── `caching-example` (codeSnippet) java
│ │ ├── `session-management` (contentCard) outlined
│ │ ├── `session-example` (codeSnippet) java
│ │ ├── `real-time-analytics` (contentCard) tinted
│ │ ├── `analytics-scenarios` (list) unordered
│ │ ├── `analytics-example` (codeSnippet) java
│ │ ├── `rate-limiting` (contentCard) outlined
│ │ ├── `rate-limiting-algorithms` (table)
│ │ ├── `rate-limiting-example` (codeSnippet) java
│ │ ├── `message-queues` (contentCard) tinted
│ │ ├── `queue-patterns` (table)
│ │ ├── `pubsub-example` (codeSnippet) java
│ │ ├── `geospatial` (contentCard) outlined
│ │ ├── `geospatial-commands` (table)
│ │ ├── `geospatial-example` (codeSnippet) java
│ │ ├── `full-text-search` (contentCard) tinted
│ │ ├── `search-features` (list) unordered
│ │ ├── `search-example` (codeSnippet) java
│ │ ├── `distributed-locks` (contentCard) outlined
│ │ ├── `lock-algorithms` (table)
│ │ ├── `redlock-example` (codeSnippet) java
│ │ ├── `leaderboards` (contentCard) tinted
│ │ ├── `leaderboard-example` (codeSnippet) java
│ │ ├── `time-series` (contentCard) outlined
│ │ └── `time-series-example` (codeSnippet) java
│ └── `subsection: when-not-to-use`
│ ├── `anti-patterns` (contentCard) outlined
│ ├── `alternative-solutions` (table)
│ └── `memory-constraints` (alert) warning

├── Section 6 · `internal-architecture` · Internal Architecture
│ ├── `architecture-diagram` (diagram)
│ ├── `core-components` (contentCard) outlined
│ ├── `event-loop` (contentCard) tinted
│ ├── `request-flow` (typography)
│ ├── `request-flow-diagram` (diagram)
│ ├── `memory-management` (contentCard) outlined
│ ├── `eviction-intro` (contentCard) tinted
│ ├── `eviction-policies` (table)
│ ├── `data-encoding` (contentCard) tinted
│ └── `encoding-table` (table)

├── Section 7 · `data-structures` · Data Structures & Commands
│ ├── `subsection: strings-section`
│ │ ├── `strings-description` (typography)
│ │ ├── `strings-use-cases` (contentCard) tinted
│ │ ├── `strings-commands` (table)
│ │ ├── `strings-example` (codeSnippet) bash
│ │ └── `strings-advanced` (contentCard) outlined
│ ├── `subsection: lists-section`
│ │ ├── `lists-description` (typography)
│ │ ├── `lists-use-cases` (contentCard) outlined
│ │ ├── `lists-commands` (table)
│ │ ├── `lists-example` (codeSnippet) bash
│ │ ├── `lists-blocking` (contentCard) tinted
│ │ └── `lists-queue-example` (codeSnippet) java
│ ├── `subsection: sets-section`
│ │ ├── `sets-description` (typography)
│ │ ├── `sets-use-cases` (contentCard) tinted
│ │ ├── `sets-commands` (table)
│ │ ├── `sets-example` (codeSnippet) bash
│ │ ├── `sets-operations` (contentCard) outlined
│ │ └── `sets-social-example` (codeSnippet) java
│ ├── `subsection: hashes-section`
│ │ ├── `hashes-description` (typography)
│ │ ├── `hashes-use-cases` (contentCard) outlined
│ │ ├── `hashes-commands` (table)
│ │ ├── `hashes-example` (codeSnippet) bash
│ │ ├── `hashes-vs-strings` (contentCard) tinted
│ │ └── `hashes-user-example` (codeSnippet) java
│ ├── `subsection: sorted-sets-section`
│ │ ├── `sorted-sets-description` (typography)
│ │ ├── `sorted-sets-use-cases` (contentCard) tinted
│ │ ├── `sorted-sets-commands` (table)
│ │ ├── `sorted-sets-example` (codeSnippet) bash
│ │ ├── `sorted-sets-internals` (contentCard) outlined
│ │ └── `sorted-sets-leaderboard-example` (codeSnippet) java
│ ├── `subsection: streams-section`
│ │ ├── `streams-description` (typography)
│ │ ├── `streams-use-cases` (contentCard) outlined
│ │ ├── `streams-commands` (table)
│ │ ├── `streams-example` (codeSnippet) bash
│ │ ├── `streams-consumer-groups` (contentCard) tinted
│ │ ├── `streams-consumer-diagram` (diagram)
│ │ └── `streams-event-example` (codeSnippet) java
│ ├── `subsection: bitmaps-section`
│ │ ├── `bitmaps-description` (typography)
│ │ ├── `bitmaps-use-cases` (contentCard) tinted
│ │ ├── `bitmaps-commands` (table)
│ │ └── `bitmaps-example` (codeSnippet) java
│ ├── `subsection: hyperloglog-section`
│ │ ├── `hyperloglog-description` (typography)
│ │ ├── `hyperloglog-use-cases` (contentCard) outlined
│ │ ├── `hyperloglog-commands` (table)
│ │ └── `hyperloglog-example` (codeSnippet) java
│ └── `subsection: geospatial-section`
│ ├── `geospatial-description` (typography)
│ ├── `geospatial-use-cases-detail` (contentCard) tinted
│ ├── `geospatial-commands-detail` (table)
│ └── `geospatial-example-detail` (codeSnippet) java

├── Section 8 · `data-types-comparison` · Data Types Comparison
│ ├── `data-types-table` (table)
│ ├── `selection-guide` (contentCard) tinted
│ └── `performance-characteristics` (table)

├── Section 9 · `persistence` · Persistence Mechanisms
│ ├── `persistence-intro` (typography)
│ ├── `persistence-diagram` (diagram)
│ ├── `subsection: rdb-section`
│ │ ├── `rdb-description` (typography)
│ │ ├── `rdb-advantages` (contentCard) tinted
│ │ ├── `rdb-diagram` (diagram)
│ │ ├── `rdb-disadvantages` (contentCard) outlined
│ │ ├── `rdb-configuration` (codeSnippet) conf
│ │ └── `rdb-commands` (table)
│ ├── `subsection: aof-section`
│ │ ├── `aof-description` (typography)
│ │ ├── `aof-diagram` (diagram)
│ │ ├── `aof-advantages` (contentCard) tinted
│ │ ├── `aof-disadvantages` (contentCard) outlined
│ │ ├── `aof-fsync-policies` (table)
│ │ ├── `aof-configuration` (codeSnippet) conf
│ │ └── `aof-rewrite` (contentCard) tinted
│ ├── `rdb-vs-aof-table` (table)
│ ├── `hybrid-persistence` (contentCard) outlined
│ ├── `recovery-scenarios` (table)
│ └── `persistence-recommendations` (contentCard) tinted

├── Section 10 · `pub-sub` · Pub/Sub
│ ├── `pubsub-intro` (typography)
│ ├── `pubsub-diagram` (diagram)
│ ├── `pubsub-concepts` (contentCard) tinted
│ ├── `pubsub-commands` (table)
│ ├── `pubsub-patterns` (contentCard) outlined
│ ├── `pubsub-example` (codeSnippet) java
│ ├── `pubsub-vs-streams` (table)
│ ├── `pubsub-limitations` (alert) warning
│ └── `pubsub-use-cases` (contentCard) tinted

├── Section 11 · `transactions` · Transactions
│ ├── `transactions-intro` (typography)
│ ├── `acid-properties` (contentCard) outlined
│ ├── `transaction-commands` (table)
│ ├── `basic-transaction-example` (codeSnippet) bash
│ ├── `watch-optimistic-locking` (contentCard) tinted
│ ├── `watch-example` (codeSnippet) java
│ ├── `transaction-errors` (contentCard) outlined
│ ├── `transaction-vs-lua` (table)
│ └── `transaction-patterns` (contentCard) tinted

├── Section 12 · `lua-scripting` · Lua Scripting
│ ├── `lua-intro` (typography)
│ ├── `lua-benefits` (contentCard) tinted
│ ├── `lua-commands` (table)
│ ├── `lua-basic-example` (codeSnippet) lua
│ ├── `lua-rate-limiter` (codeSnippet) lua
│ ├── `lua-atomic-update` (codeSnippet) lua
│ ├── `lua-best-practices` (contentCard) outlined
│ └── `lua-pitfalls` (alert) warning

└── Section 13 · `commands-cheatsheet` · Commands Cheat Sheet
├── `cheatsheet-intro` (typography)
├── `string-commands-cheat` (table)
├── `list-commands-cheat` (table)
├── `set-commands-cheat` (table)
├── `hash-commands-cheat` (table)
├── `sortedset-commands-cheat` (table)
├── `admin-commands-cheat` (table)
└── `quick-reference` (contentCard) tinted
