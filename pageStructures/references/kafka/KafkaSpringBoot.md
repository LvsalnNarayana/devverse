references/kafka/

━━━ PAGE 4: kafka-spring-boot ━━━

├── Setup & Configuration [spring-setup]
│ ├── maven-gradle-dependencies [maven-gradle-dependencies] (multiTabCodeSnippet)
│ ├── application-properties-config [application-properties-config] (multiTabCodeSnippet)
│ ├── kafka-beans-config-class [kafka-beans-config-class] (codeSnippet)
│ └── spring-kafka-auto-config [spring-kafka-auto-config] (contentCard)

├── Producer Implementation [spring-producer]
│ ├── spring-producer-architecture-diagram [spring-producer-architecture-diagram] (diagram)
│ ├── kafka-template-basic [kafka-template-basic] (codeSnippet)
│ ├── kafka-template-with-callback [kafka-template-with-callback] (codeSnippet)
│ ├── producer-factory-config [producer-factory-config] (codeSnippet)
│ ├── sending-pojo-messages [sending-pojo-messages] (codeSnippet)
│ ├── producer-config-properties-table [producer-config-properties-table] (basicTable)
│ └── producer-error-handling [producer-error-handling] (codeSnippet)

├── Consumer Implementation [spring-consumer]
│ ├── spring-consumer-architecture-diagram [spring-consumer-architecture-diagram] (diagram)
│ ├── kafka-listener-basic [kafka-listener-basic] (codeSnippet)
│ ├── listener-factory-config [listener-factory-config] (codeSnippet)
│ ├── concurrent-kafka-listener [concurrent-kafka-listener] (codeSnippet)
│ ├── manual-offset-commit [manual-offset-commit] (codeSnippet)
│ ├── consumer-config-properties-table [consumer-config-properties-table] (basicTable)
│ ├── listener-ack-modes-table [listener-ack-modes-table] (basicTable)
│ └── batch-listener [batch-listener] (codeSnippet)

├── Serialization & Deserialization [spring-serialization]
│ ├── json-serializer-config [json-serializer-config] (codeSnippet)
│ ├── avro-with-schema-registry [avro-with-schema-registry] (codeSnippet)
│ ├── custom-serializer [custom-serializer] (codeSnippet)
│ └── trusted-packages-config [trusted-packages-config] (contentCard)

├── Error Handling & Retry [spring-error-handling]
│ ├── error-handling-flow-diagram [error-handling-flow-diagram] (diagram)
│ ├── default-error-handler [default-error-handler] (codeSnippet)
│ ├── retry-with-backoff [retry-with-backoff] (codeSnippet)
│ ├── dead-letter-topic-config [dead-letter-topic-config] (codeSnippet)
│ ├── dead-letter-flow-diagram [dead-letter-flow-diagram] (diagram)
│ └── error-handler-types-table [error-handler-types-table] (basicTable)

├── Transactions [spring-transactions]
│ ├── spring-transaction-flow-diagram [spring-transaction-flow-diagram] (diagram)
│ ├── kafka-transaction-manager-config [kafka-transaction-manager-config] (codeSnippet)
│ ├── transactional-producer-example [transactional-producer-example] (codeSnippet)
│ ├── consume-transform-produce [consume-transform-produce] (codeSnippet)
│ └── kafka-db-transaction-sync [kafka-db-transaction-sync] (codeSnippet)

├── Architecture Patterns [spring-patterns]
│ ├── event-driven-microservices-diagram [event-driven-microservices-diagram] (diagram)
│ ├── saga-pattern-diagram [saga-pattern-diagram] (diagram)
│ ├── saga-pattern-implementation [saga-pattern-implementation] (codeSnippet)
│ ├── outbox-pattern-diagram [outbox-pattern-diagram] (diagram)
│ ├── outbox-pattern-implementation [outbox-pattern-implementation] (codeSnippet)
│ ├── cqrs-with-kafka-diagram [cqrs-with-kafka-diagram] (diagram)
│ ├── cqrs-implementation [cqrs-implementation] (codeSnippet)
│ ├── event-sourcing-diagram [event-sourcing-diagram] (diagram)
│ └── event-sourcing-implementation [event-sourcing-implementation] (codeSnippet)

├── Kafka Streams with Spring [spring-streams]
│ ├── streams-binder-config [streams-binder-config] (codeSnippet)
│ ├── kstream-topology-example [kstream-topology-example] (codeSnippet)
│ ├── ktable-aggregation-example [ktable-aggregation-example] (codeSnippet)
│ ├── spring-cloud-stream-diagram [spring-cloud-stream-diagram] (diagram)
│ └── streams-error-handling [streams-error-handling] (codeSnippet)

├── Spring Cloud Stream [spring-cloud-stream]
│ ├── cloud-stream-vs-spring-kafka-table [cloud-stream-vs-spring-kafka-table] (basicTable)
│ ├── cloud-stream-binder-config [cloud-stream-binder-config] (codeSnippet)
│ ├── functional-producer-consumer [functional-producer-consumer] (codeSnippet)
│ ├── cloud-stream-architecture-diagram [cloud-stream-architecture-diagram] (diagram)
│ └── binding-config-properties-table [binding-config-properties-table] (basicTable)

└── Testing [spring-testing]
├── embedded-kafka-setup [embedded-kafka-setup] (codeSnippet)
├── producer-test-example [producer-test-example] (codeSnippet)
├── consumer-test-example [consumer-test-example] (codeSnippet)
├── testcontainers-kafka-setup [testcontainers-kafka-setup] (codeSnippet)
└── testing-strategies-table [testing-strategies-table] (basicTable)
