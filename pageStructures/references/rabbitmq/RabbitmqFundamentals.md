━━━ PAGE 1: rabbitmq-fundamentals ━━━
(What it is, why, internals, exchanges, queues, bindings, message lifecycle)

├── Section 1 · `what-is-rabbitmq` · What is RabbitMQ
│ ├── `rabbitmq-definition` (typography)
│ ├── `core-characteristics` (contentCard) tinted
│ ├── `amqp-protocol` (contentCard) outlined
│ ├── `message-broker-model` (contentCard) tinted
│ └── `rabbitmq-vs-kafka-intro` (contentCard) outlined

├── Section 2 · `history-of-rabbitmq` · History of RabbitMQ
│ ├── `origin-story` (typography)
│ ├── `major-milestones` (table)
│ └── `evolution-timeline` (contentCard) tinted

├── Section 3 · `why-rabbitmq` · Why RabbitMQ
│ ├── `why-intro` (typography)
│ ├── `subsection: common-use-cases`
│ │ ├── `use-cases-intro` (typography)
│ │ ├── `use-case-task-queues` (contentCard) outlined
│ │ ├── `use-case-rpc` (contentCard) outlined
│ │ ├── `use-case-pub-sub` (contentCard) outlined
│ │ ├── `use-case-routing` (contentCard) outlined
│ │ ├── `use-case-microservices` (contentCard) outlined
│ │ ├── `use-case-event-driven` (contentCard) outlined
│ │ ├── `use-case-saga` (contentCard) outlined
│ │ └── `use-case-priority-queues` (contentCard) outlined
│ ├── `reliability-benefits` (contentCard) tinted
│ ├── `flexibility-advantages` (contentCard) outlined
│ ├── `protocol-support` (contentCard) tinted
│ ├── `management-ui` (contentCard) outlined
│ └── `ecosystem-support` (contentCard) tinted

├── Section 4 · `rabbitmq-vs-alternatives` · RabbitMQ vs Alternatives
│ ├── `comparison-intro` (typography)
│ ├── `comparison-table` (table)
│ └── `comparison-summary` (contentCard) tinted

├── Section 5 · `when-to-use-rabbitmq` · When to Use RabbitMQ
│ ├── `when-to-use-intro` (typography)
│ ├── `subsection: major-use-cases`
│ │ ├── `task-queue-use-case` (contentCard) tinted
│ │ ├── `task-queue-example` (codeSnippet) java
│ │ ├── `rpc-use-case` (contentCard) outlined
│ │ ├── `rpc-diagram` (diagram)
│ │ ├── `rpc-example` (codeSnippet) java
│ │ ├── `pub-sub-use-case` (contentCard) tinted
│ │ ├── `pub-sub-example` (codeSnippet) java
│ │ ├── `routing-use-case` (contentCard) outlined
│ │ ├── `routing-example` (codeSnippet) java
│ │ ├── `priority-queue-use-case` (contentCard) tinted
│ │ ├── `priority-queue-example` (codeSnippet) java
│ │ ├── `dead-letter-use-case` (contentCard) outlined
│ │ └── `dead-letter-example` (codeSnippet) java
│ └── `subsection: when-not-to-use`
│ ├── `anti-patterns` (contentCard) outlined
│ ├── `alternative-solutions` (table)
│ └── `limitations-alert` (alert) warning

├── Section 6 · `internal-architecture` · Internal Architecture
│ ├── `architecture-diagram` (diagram)
│ ├── `core-components` (contentCard) outlined
│ ├── `amqp-model-diagram` (diagram)
│ ├── `connection-vs-channel` (contentCard) tinted
│ ├── `request-flow` (typography)
│ ├── `request-flow-diagram` (diagram)
│ ├── `memory-management` (contentCard) outlined
│ └── `erlang-runtime` (contentCard) tinted

├── Section 7 · `exchanges` · Exchanges
│ ├── `exchanges-intro` (typography)
│ ├── `subsection: direct-exchange`
│ │ ├── `direct-description` (typography)
│ │ ├── `direct-diagram` (diagram)
│ │ ├── `direct-use-cases` (contentCard) tinted
│ │ └── `direct-example` (codeSnippet) java
│ ├── `subsection: fanout-exchange`
│ │ ├── `fanout-description` (typography)
│ │ ├── `fanout-diagram` (diagram)
│ │ ├── `fanout-use-cases` (contentCard) outlined
│ │ └── `fanout-example` (codeSnippet) java
│ ├── `subsection: topic-exchange`
│ │ ├── `topic-description` (typography)
│ │ ├── `topic-diagram` (diagram)
│ │ ├── `topic-routing-keys` (contentCard) tinted
│ │ ├── `topic-wildcards` (table)
│ │ └── `topic-example` (codeSnippet) java
│ ├── `subsection: headers-exchange`
│ │ ├── `headers-description` (typography)
│ │ ├── `headers-use-cases` (contentCard) outlined
│ │ └── `headers-example` (codeSnippet) java
│ └── `exchange-comparison-table` (table)

├── Section 8 · `queues` · Queues
│ ├── `queues-intro` (typography)
│ ├── `queue-properties` (contentCard) tinted
│ ├── `queue-properties-table` (table)
│ ├── `subsection: durable-queues`
│ │ ├── `durable-description` (typography)
│ │ └── `durable-example` (codeSnippet) java
│ ├── `subsection: exclusive-queues`
│ │ ├── `exclusive-description` (typography)
│ │ └── `exclusive-example` (codeSnippet) java
│ ├── `subsection: auto-delete-queues`
│ │ ├── `auto-delete-description` (typography)
│ │ └── `auto-delete-example` (codeSnippet) java
│ ├── `subsection: quorum-queues`
│ │ ├── `quorum-description` (typography)
│ │ ├── `quorum-vs-classic` (table)
│ │ └── `quorum-example` (codeSnippet) java
│ ├── `subsection: priority-queues`
│ │ ├── `priority-description` (typography)
│ │ └── `priority-example` (codeSnippet) java
│ ├── `subsection: lazy-queues`
│ │ ├── `lazy-description` (typography)
│ │ └── `lazy-example` (codeSnippet) java
│ └── `queue-comparison-table` (table)

├── Section 9 · `bindings-routing` · Bindings & Routing
│ ├── `bindings-intro` (typography)
│ ├── `binding-diagram` (diagram)
│ ├── `routing-key-patterns` (contentCard) tinted
│ ├── `routing-key-table` (table)
│ ├── `binding-example` (codeSnippet) java
│ └── `routing-best-practices` (contentCard) outlined

├── Section 10 · `message-lifecycle` · Message Lifecycle
│ ├── `lifecycle-intro` (typography)
│ ├── `message-lifecycle-diagram` (diagram)
│ ├── `message-properties` (contentCard) tinted
│ ├── `message-properties-table` (table)
│ ├── `message-acknowledgement` (contentCard) outlined
│ ├── `ack-modes-table` (table)
│ ├── `message-persistence` (contentCard) tinted
│ ├── `message-ttl` (contentCard) outlined
│ └── `message-priority` (contentCard) tinted

├── Section 11 · `dead-letter` · Dead Letter Exchange
│ ├── `dlx-intro` (typography)
│ ├── `dlx-diagram` (diagram)
│ ├── `dlx-triggers` (contentCard) tinted
│ ├── `dlx-configuration` (codeSnippet) java
│ ├── `dlx-processing` (codeSnippet) java
│ └── `dlx-patterns` (contentCard) outlined

└── Section 12 · `rabbitmq-cli` · CLI & Management Commands
├── `cli-intro` (typography)
├── `rabbitmqctl-commands` (table)
├── `exchange-commands` (codeSnippet) bash
├── `queue-commands` (codeSnippet) bash
├── `user-commands` (codeSnippet) bash
├── `policy-commands` (codeSnippet) bash
└── `management-api-overview` (contentCard) tinted
