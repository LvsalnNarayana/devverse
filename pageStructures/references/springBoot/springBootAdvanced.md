━━━ PAGE 6: spring-boot-advanced ━━━

├── Section 1 · `jms-messaging` · JMS — Java Message Service
│ ├── `jms-intro` (typography)
│ ├── `jms-architecture-diagram` (diagram)
│ ├── `jms-concepts-table` (table)
│ ├── `subsection: jms-template`
│ │ ├── `jms-template-methods-table` (table)
│ │ ├── `jms-send-example` (codeSnippet) java
│ │ └── `jms-receive-example` (codeSnippet) java
│ ├── `subsection: jms-listener`
│ │ ├── `at-jms-listener-attributes-table` (table)
│ │ ├── `jms-listener-example` (codeSnippet) java
│ │ └── `jms-listener-container-config` (codeSnippet) java
│ ├── `jms-message-types-table` (table)
│ ├── `jms-error-handling` (codeSnippet) java
│ └── `jms-transaction-example` (codeSnippet) java

├── Section 2 · `file-handling` · File Handling
│ ├── `file-handling-intro` (typography)
│ ├── `subsection: resource-types`
│ │ ├── `resource-interface-methods-table` (table)
│ │ ├── `resource-types-table` (table)
│ │ ├── `classpath-resource-example` (codeSnippet) java
│ │ ├── `file-system-resource-example` (codeSnippet) java
│ │ ├── `url-resource-example` (codeSnippet) java
│ │ └── `byte-array-resource-example` (codeSnippet) java
│ ├── `subsection: resource-loader`
│ │ ├── `resource-loader-methods-table` (table)
│ │ └── `resource-loader-example` (codeSnippet) java
│ ├── `subsection: multipart-file`
│ │ ├── `multipart-file-methods-table` (table)
│ │ └── `multipart-file-example` (codeSnippet) java
│ ├── `subsection: file-operations`
│ │ ├── `file-copy-move-example` (codeSnippet) java
│ │ ├── `file-watch-service-example` (codeSnippet) java
│ │ └── `temp-file-handling` (codeSnippet) java
│ └── `file-storage-strategies-table` (table)

├── Section 3 · `async-processing` · Async Processing
│ ├── `async-intro` (typography)
│ ├── `async-flow-diagram` (diagram)
│ ├── `at-enable-async-table` (table)
│ ├── `at-async-attributes-table` (table)
│ ├── `async-void-example` (codeSnippet) java
│ ├── `async-future-example` (codeSnippet) java
│ ├── `async-completable-future-example` (codeSnippet) java
│ ├── `thread-pool-executor-config` (codeSnippet) java
│ ├── `async-exception-handling` (codeSnippet) java
│ └── `async-pitfalls` (alert) warning

├── Section 4 · `scheduling` · Scheduling
│ ├── `scheduling-intro` (typography)
│ ├── `at-enable-scheduling-table` (table)
│ ├── `at-scheduled-attributes-table` (table)
│ ├── `fixed-rate-example` (codeSnippet) java
│ ├── `fixed-delay-example` (codeSnippet) java
│ ├── `cron-example` (codeSnippet) java
│ ├── `cron-expressions-table` (table)
│ ├── `dynamic-scheduling-example` (codeSnippet) java
│ ├── `scheduled-task-registrar` (codeSnippet) java
│ └── `scheduling-pitfalls` (contentCard) outlined

├── Section 5 · `caching` · Caching Abstraction
│ ├── `caching-intro` (typography)
│ ├── `caching-flow-diagram` (diagram)
│ ├── `at-enable-caching-table` (table)
│ ├── `subsection: cache-annotations`
│ │ ├── `at-cacheable-attributes-table` (table)
│ │ ├── `at-cacheable-example` (codeSnippet) java
│ │ ├── `at-cache-put-attributes-table` (table)
│ │ ├── `at-cache-put-example` (codeSnippet) java
│ │ ├── `at-cache-evict-attributes-table` (table)
│ │ ├── `at-cache-evict-example` (codeSnippet) java
│ │ └── `at-caching-example` (codeSnippet) java
│ ├── `cache-managers-table` (table)
│ ├── `caffeine-cache-config` (codeSnippet) java
│ ├── `cache-key-generation` (codeSnippet) java
│ ├── `conditional-caching` (codeSnippet) java
│ └── `cache-pitfalls` (contentCard) outlined

├── Section 6 · `virtual-threads` · Virtual Threads
│ ├── `virtual-threads-intro` (typography)
│ ├── `virtual-vs-platform-threads-diagram` (diagram)
│ ├── `virtual-vs-platform-comparison-table` (table)
│ ├── `virtual-threads-config` (codeSnippet) yaml
│ ├── `virtual-thread-executor-example` (codeSnippet) java
│ ├── `virtual-threads-with-spring` (codeSnippet) java
│ ├── `virtual-threads-tomcat-config` (codeSnippet) java
│ ├── `pinning-issues` (contentCard) outlined
│ └── `virtual-threads-best-practices` (contentCard) tinted

├── Section 7 · `reactive-programming` · Reactive Programming — WebFlux
│ ├── `reactive-intro` (typography)
│ ├── `reactive-vs-servlet-diagram` (diagram)
│ ├── `reactive-vs-mvc-table` (table)
│ ├── `subsection: reactor-core`
│ │ ├── `mono-methods-table` (table)
│ │ ├── `mono-example` (codeSnippet) java
│ │ ├── `flux-methods-table` (table)
│ │ ├── `flux-example` (codeSnippet) java
│ │ └── `operators-reference-table` (table)
│ ├── `subsection: webflux-controllers`
│ │ ├── `reactive-controller-example` (codeSnippet) java
│ │ ├── `router-function-example` (codeSnippet) java
│ │ └── `handler-function-example` (codeSnippet) java
│ ├── `subsection: webclient`
│ │ ├── `web-client-methods-table` (table)
│ │ ├── `web-client-example` (codeSnippet) java
│ │ └── `web-client-error-handling` (codeSnippet) java
│ ├── `subsection: reactive-data`
│ │ ├── `reactive-repositories-example` (codeSnippet) java
│ │ └── `r2dbc-config` (codeSnippet) java
│ ├── `backpressure-diagram` (diagram)
│ └── `reactive-pitfalls` (alert) warning

├── Section 8 · `websocket` · WebSocket
│ ├── `websocket-intro` (typography)
│ ├── `websocket-flow-diagram` (diagram)
│ ├── `at-enable-web-socket-table` (table)
│ ├── `websocket-handler-example` (codeSnippet) java
│ ├── `stomp-websocket-config` (codeSnippet) java
│ ├── `at-message-mapping-attributes-table` (table)
│ ├── `at-send-to-attributes-table` (table)
│ ├── `stomp-controller-example` (codeSnippet) java
│ └── `websocket-vs-sse-table` (table)

├── Section 9 · `sse` · Server-Sent Events
│ ├── `sse-intro` (typography)
│ ├── `sse-flow-diagram` (diagram)
│ ├── `sse-emitter-methods-table` (table)
│ ├── `sse-example` (codeSnippet) java
│ └── `sse-reactive-example` (codeSnippet) java

├── Section 10 · `rest-client` · REST Clients
│ ├── `rest-clients-intro` (typography)
│ ├── `rest-clients-comparison-table` (table)
│ ├── `subsection: rest-template`
│ │ ├── `rest-template-methods-table` (table)
│ │ └── `rest-template-example` (codeSnippet) java
│ ├── `subsection: rest-client-new`
│ │ ├── `rest-client-methods-table` (table)
│ │ └── `rest-client-example` (codeSnippet) java
│ ├── `subsection: feign-client`
│ │ ├── `at-feign-client-attributes-table` (table)
│ │ └── `feign-client-example` (codeSnippet) java
│ └── `http-interface-example` (codeSnippet) java

├── Section 11 · `events-advanced` · Application Events — Advanced
│ ├── `events-advanced-intro` (typography)
│ ├── `event-driven-diagram` (diagram)
│ ├── `application-event-publisher-methods-table` (table)
│ ├── `domain-events-example` (codeSnippet) java
│ ├── `transactional-event-listener-attributes-table` (table)
│ └── `transactional-event-example` (codeSnippet) java

├── Section 12 · `internationalization` · Internationalization (i18n)
│ ├── `i18n-intro` (typography)
│ ├── `message-source-methods-table` (table)
│ ├── `i18n-config` (codeSnippet) java
│ ├── `messages-properties-example` (codeSnippet) properties
│ └── `locale-resolver-example` (codeSnippet) java

├── Section 13 · `http-client-customization` · HTTP Client Customization
│ ├── `http-client-intro` (typography)
│ ├── `rest-template-interceptor` (codeSnippet) java
│ ├── `client-http-request-interceptor-methods-table` (table)
│ ├── `request-logging-interceptor` (codeSnippet) java
│ └── `connection-pool-config` (codeSnippet) java

└── Section 14 · `advanced-config` · Advanced Configuration Patterns
├── `advanced-config-intro` (typography)
├── `subsection: configuration-properties-advanced`
│ ├── `at-config-properties-validation` (codeSnippet) java
│ └── `immutable-config-properties` (codeSnippet) java
├── `subsection: bean-factory-post-processor`
│ ├── `bfpp-methods-table` (table)
│ └── `bfpp-example` (codeSnippet) java
├── `subsection: bean-post-processor`
│ ├── `bpp-methods-table` (table)
│ └── `bpp-example` (codeSnippet) java
├── `import-annotation-example` (codeSnippet) java
├── `deferred-import-selector` (codeSnippet) java
└── `factory-bean-example` (codeSnippet) java
