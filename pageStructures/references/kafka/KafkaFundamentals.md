references/kafka/

━━━ PAGE 1: kafka-fundamentals ━━━

├── Introduction [kafka-intro]
│ ├── what-is-kafka [what-is-kafka] (contentCard)
│ ├── kafka-vs-traditional-queues [kafka-vs-traditional-queues] (basicTable)
│ └── when-to-use-kafka [when-to-use-kafka] (contentCard)

├── Core Concepts [core-concepts]
│ ├── topics-and-partitions [topics-and-partitions] (contentCard)
│ ├── offsets-and-retention [offsets-and-retention] (contentCard)
│ ├── producers-overview [producers-overview] (contentCard)
│ ├── consumers-and-groups [consumers-and-groups] (contentCard)
│ ├── brokers-and-clusters [brokers-and-clusters] (contentCard)
│ └── replication-leaders-isr [replication-leaders-isr] (contentCard)

├── Architecture [architecture]
│ ├── cluster-architecture-diagram [cluster-architecture-diagram] (diagram)
│ ├── log-storage-structure [log-storage-structure] (contentCard)
│ ├── log-segment-diagram [log-segment-diagram] (diagram)
│ ├── partition-replication-diagram [partition-replication-diagram] (diagram)
│ └── kraft-vs-zookeeper [kraft-vs-zookeeper] (basicTable)

├── Topics & Partitions [topics-partitions]
│ ├── topic-creation-cli [topic-creation-cli] (codeSnippet)
│ ├── topic-configs [topic-configs] (basicTable)
│ ├── retention-policies [retention-policies] (contentCard)
│ ├── log-compaction [log-compaction] (contentCard)
│ ├── compaction-diagram [compaction-diagram] (diagram)
│ └── partition-count-guidelines [partition-count-guidelines] (contentCard)

├── Replication & Durability [replication-durability]
│ ├── replication-factor-guide [replication-factor-guide] (contentCard)
│ ├── isr-management [isr-management] (contentCard)
│ ├── leader-election-diagram [leader-election-diagram] (diagram)
│ ├── min-insync-replicas [min-insync-replicas] (contentCard)
│ └── durability-config-table [durability-config-table] (basicTable)

└── KRaft Mode [kraft-mode]
├── kraft-architecture-diagram [kraft-architecture-diagram] (diagram)
├── kraft-benefits [kraft-benefits] (contentCard)
├── kraft-configuration [kraft-configuration] (codeSnippet)
└── zookeeper-to-kraft-migration [zookeeper-to-kraft-migration] (stepList)
