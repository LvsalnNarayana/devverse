---
title: Apache Kafka Basics
referenceId: kafka-basics
page: /references/kafka-basics
section: Reference Library / Messaging
source: pageStructures/references/KafkaBasics.md
---

```
reference/
└── kafka-basics.md

├── 1. Introduction
│   ├── 1.1 What Kafka is (distributed commit log)
│   ├── 1.2 When to choose Kafka vs queues
│   └── 1.3 What you will learn

├── 2. Cluster & brokers
│   ├── 2.1 Broker responsibilities
│   ├── 2.2 Replication & ISR
│   └── 2.3 KRaft vs ZooKeeper (overview)

├── 3. Topics & partitions
│   ├── 3.1 Topic naming & retention
│   ├── 3.2 Partition keys & ordering guarantees
│   └── 3.3 Compacted vs delete retention

├── 4. Producers
│   ├── 4.1 Serialization & headers
│   ├── 4.2 Partitioning strategy
│   └── 4.3 acks, retries, idempotence

├── 5. Consumers
│   ├── 5.1 Consumer groups & rebalancing
│   ├── 5.2 Offsets & commit strategies
│   └── 5.3 Lag monitoring

├── 6. Operations
│   ├── 6.1 CLI essentials (topics, describe, consume)
│   ├── 6.2 Capacity planning (partitions, disk)
│   └── 6.3 Security basics (SASL/SSL overview)

└── 7. Spring Boot integration (pointer)
    └── 7.1 Link to kafka-spring-boot reference (planned)
```
