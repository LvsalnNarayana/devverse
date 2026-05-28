━━━ PAGE 3: rabbitmq-spring-boot ━━━
(Spring AMQP, RabbitTemplate, listeners, error handling, patterns, testing)

├── Section 1 · `spring-rabbitmq-setup` · Setup & Configuration
│ ├── `setup-intro` (typography)
│ ├── `maven-gradle-dependencies` (multiTabCodeSnippet) maven/gradle
│ ├── `application-properties-config` (multiTabCodeSnippet) properties/yaml
│ ├── `rabbitmq-connection-config` (codeSnippet) java
│ └── `connection-factory-config` (codeSnippet) java

├── Section 2 · `rabbit-template` · RabbitTemplate
│ ├── `rabbittemplate-intro` (typography)
│ ├── `rabbittemplate-config` (codeSnippet) java
│ ├── `sending-messages` (codeSnippet) java
│ ├── `sending-pojo-messages` (codeSnippet) java
│ ├── `receiving-messages` (codeSnippet) java
│ ├── `rpc-with-rabbittemplate` (codeSnippet) java
│ └── `message-conversion-table` (table)

├── Section 3 · `exchange-queue-declaration` · Exchange & Queue Declaration
│ ├── `declaration-intro` (typography)
│ ├── `exchange-declaration` (codeSnippet) java
│ ├── `queue-declaration` (codeSnippet) java
│ ├── `binding-declaration` (codeSnippet) java
│ ├── `declarables-config` (codeSnippet) java
│ └── `declaration-best-practices` (contentCard) tinted

├── Section 4 · `spring-listeners` · Message Listeners
│ ├── `listeners-intro` (typography)
│ ├── `listener-architecture-diagram` (diagram)
│ ├── `rabbitlistener-basic` (codeSnippet) java
│ ├── `listener-container-config` (codeSnippet) java
│ ├── `concurrent-listeners` (codeSnippet) java
│ ├── `manual-ack-listener` (codeSnippet) java
│ ├── `batch-listener` (codeSnippet) java
│ └── `listener-ack-modes-table` (table)

├── Section 5 · `spring-serialization` · Serialization & Conversion
│ ├── `serialization-intro` (typography)
│ ├── `jackson-message-converter` (codeSnippet) java
│ ├── `custom-message-converter` (codeSnippet) java
│ ├── `message-converter-config` (codeSnippet) java
│ └── `serialization-comparison-table` (table)

├── Section 6 · `spring-error-handling` · Error Handling & Retry
│ ├── `error-handling-intro` (typography)
│ ├── `error-handling-flow-diagram` (diagram)
│ ├── `retry-interceptor-config` (codeSnippet) java
│ ├── `exponential-backoff-config` (codeSnippet) java
│ ├── `dead-letter-config` (codeSnippet) java
│ ├── `dead-letter-flow-diagram` (diagram)
│ ├── `error-handler-types-table` (table)
│ └── `republish-message-handler` (codeSnippet) java

├── Section 7 · `publisher-confirms-spring` · Publisher Confirms with Spring
│ ├── `confirms-intro` (typography)
│ ├── `confirms-config` (codeSnippet) java
│ ├── `confirm-callback` (codeSnippet) java
│ ├── `return-callback` (codeSnippet) java
│ └── `confirms-best-practices` (contentCard) tinted

├── Section 8 · `spring-patterns` · Architecture Patterns with Spring
│ ├── `patterns-intro` (typography)
│ ├── `subsection: event-driven-microservices`
│ │ ├── `event-driven-diagram` (diagram)
│ │ └── `event-driven-implementation` (codeSnippet) java
│ ├── `subsection: saga-pattern-spring`
│ │ ├── `saga-diagram` (diagram)
│ │ └── `saga-implementation` (codeSnippet) java
│ ├── `subsection: outbox-pattern-spring`
│ │ ├── `outbox-diagram` (diagram)
│ │ └── `outbox-implementation` (codeSnippet) java
│ └── `subsection: competing-consumers`
│ ├── `competing-consumers-diagram` (diagram)
│ └── `competing-consumers-implementation` (codeSnippet) java

├── Section 9 · `spring-cloud-stream-rabbit` · Spring Cloud Stream with RabbitMQ
│ ├── `cloud-stream-intro` (typography)
│ ├── `cloud-stream-vs-spring-amqp` (table)
│ ├── `cloud-stream-dependency` (codeSnippet) java
│ ├── `cloud-stream-config` (codeSnippet) yaml
│ ├── `functional-producer-consumer` (codeSnippet) java
│ └── `cloud-stream-architecture-diagram` (diagram)

└── Section 10 · `spring-rabbitmq-testing` · Testing
├── `testing-intro` (typography)
├── `embedded-rabbitmq-setup` (codeSnippet) java
├── `testcontainers-rabbitmq-setup` (codeSnippet) java
├── `producer-test-example` (codeSnippet) java
├── `consumer-test-example` (codeSnippet) java
└── `testing-strategies-table` (table)
