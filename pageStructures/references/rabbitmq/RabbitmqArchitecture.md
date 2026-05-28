━━━ PAGE 2: rabbitmq-architecture ━━━
(Clustering, HA, federation, patterns, reliability, configuration)

├── Section 1 · `rabbitmq-conf` · rabbitmq.conf Configuration
│ ├── `config-intro` (typography)
│ ├── `subsection: network-settings`
│ │ └── `network-table` (table)
│ ├── `subsection: memory-settings`
│ │ ├── `memory-table` (table)
│ │ └── `memory-alert` (alert) warning
│ ├── `subsection: persistence-settings`
│ │ └── `persistence-table` (table)
│ ├── `subsection: security-settings`
│ │ ├── `security-table` (table)
│ │ └── `security-best-practices` (alert) warning
│ ├── `subsection: clustering-settings`
│ │ └── `clustering-table` (table)
│ └── `configuration-example` (codeSnippet) conf

├── Section 2 · `clustering-ha` · Clustering & High Availability
│ ├── `clustering-intro` (typography)
│ ├── `cluster-architecture-diagram` (diagram)
│ ├── `subsection: cluster-setup`
│ │ ├── `cluster-setup-intro` (typography)
│ │ ├── `cluster-setup-steps` (stepList)
│ │ ├── `cluster-setup-commands` (codeSnippet) bash
│ │ └── `cluster-nodes-table` (table)
│ ├── `subsection: quorum-queues-ha`
│ │ ├── `quorum-intro` (typography)
│ │ ├── `quorum-diagram` (diagram)
│ │ ├── `quorum-features` (contentCard) tinted
│ │ ├── `quorum-configuration` (codeSnippet) java
│ │ └── `quorum-recommendations` (contentCard) outlined
│ ├── `subsection: classic-mirrored`
│ │ ├── `mirrored-intro` (typography)
│ │ ├── `mirrored-diagram` (diagram)
│ │ ├── `mirrored-policy` (codeSnippet) bash
│ │ └── `mirrored-deprecation` (alert) warning
│ └── `ha-recommendations` (contentCard) tinted

├── Section 3 · `federation-shovel` · Federation & Shovel
│ ├── `federation-intro` (typography)
│ ├── `federation-diagram` (diagram)
│ ├── `federation-use-cases` (contentCard) tinted
│ ├── `federation-config` (codeSnippet) bash
│ ├── `shovel-intro` (typography)
│ ├── `shovel-diagram` (diagram)
│ ├── `shovel-use-cases` (contentCard) outlined
│ ├── `shovel-config` (codeSnippet) bash
│ └── `federation-vs-shovel` (table)

├── Section 4 · `messaging-patterns` · Messaging Patterns
│ ├── `patterns-intro` (typography)
│ ├── `subsection: work-queues`
│ │ ├── `work-queue-description` (typography)
│ │ ├── `work-queue-diagram` (diagram)
│ │ ├── `work-queue-fair-dispatch` (contentCard) tinted
│ │ └── `work-queue-implementation` (codeSnippet) java
│ ├── `subsection: publish-subscribe`
│ │ ├── `pub-sub-description` (typography)
│ │ ├── `pub-sub-diagram` (diagram)
│ │ └── `pub-sub-implementation` (codeSnippet) java
│ ├── `subsection: routing-pattern`
│ │ ├── `routing-description` (typography)
│ │ ├── `routing-diagram` (diagram)
│ │ └── `routing-implementation` (codeSnippet) java
│ ├── `subsection: topics-pattern`
│ │ ├── `topics-description` (typography)
│ │ ├── `topics-diagram` (diagram)
│ │ └── `topics-implementation` (codeSnippet) java
│ ├── `subsection: rpc-pattern`
│ │ ├── `rpc-description` (typography)
│ │ ├── `rpc-diagram` (diagram)
│ │ └── `rpc-implementation` (codeSnippet) java
│ ├── `subsection: saga-pattern`
│ │ ├── `saga-description` (typography)
│ │ ├── `saga-diagram` (diagram)
│ │ └── `saga-implementation` (codeSnippet) java
│ └── `patterns-comparison-table` (table)

├── Section 5 · `reliability` · Reliability & Guarantees
│ ├── `reliability-intro` (typography)
│ ├── `delivery-guarantees-table` (table)
│ ├── `subsection: publisher-confirms`
│ │ ├── `confirms-description` (typography)
│ │ ├── `confirms-diagram` (diagram)
│ │ ├── `confirms-modes-table` (table)
│ │ └── `confirms-implementation` (codeSnippet) java
│ ├── `subsection: consumer-acks`
│ │ ├── `acks-description` (typography)
│ │ ├── `ack-nack-reject` (contentCard) tinted
│ │ ├── `ack-modes-table` (table)
│ │ └── `acks-implementation` (codeSnippet) java
│ ├── `subsection: retry-mechanisms`
│ │ ├── `retry-description` (typography)
│ │ ├── `retry-diagram` (diagram)
│ │ ├── `exponential-backoff` (contentCard) tinted
│ │ └── `retry-implementation` (codeSnippet) java
│ └── `reliability-checklist` (list) unordered

├── Section 6 · `performance-optimization` · Performance Optimization
│ ├── `performance-intro` (typography)
│ ├── `optimization-areas` (contentCard) tinted
│ ├── `subsection: prefetch-settings`
│ │ ├── `prefetch-description` (typography)
│ │ ├── `prefetch-impact` (contentCard) tinted
│ │ └── `prefetch-config` (codeSnippet) java
│ ├── `subsection: connection-channel`
│ │ ├── `connection-channel-description` (typography)
│ │ ├── `connection-pooling` (contentCard) outlined
│ │ └── `connection-best-practices` (contentCard) tinted
│ ├── `subsection: message-batching`
│ │ ├── `batching-description` (typography)
│ │ └── `batching-implementation` (codeSnippet) java
│ ├── `performance-configs-table` (table)
│ └── `performance-antipatterns` (table)

├── Section 7 · `migration-strategies` · Migration Strategies
│ ├── `migration-intro` (typography)
│ ├── `migration-approaches` (contentCard) tinted
│ ├── `dual-publish-pattern` (contentCard) outlined
│ ├── `migration-steps` (list) ordered
│ ├── `version-upgrade` (contentCard) tinted
│ └── `rollback-strategy` (alert) warning

└── Section 8 · `best-practices-pitfalls` · Best Practices & Pitfalls
├── `best-practices-intro` (typography)
├── `best-practices-card` (contentCard) tinted
├── `design-patterns` (contentCard) outlined
├── `pitfalls-card` (contentCard) tinted
├── `antipatterns-table` (table)
└── `production-readiness` (contentCard) outlined
