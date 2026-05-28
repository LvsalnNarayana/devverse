━━━ PAGE 7: spring-boot-testing ━━━

├── Section 1 · `testing-overview` · Testing Overview
│ ├── `testing-intro` (typography)
│ ├── `testing-pyramid-diagram` (diagram)
│ ├── `testing-layers-table` (table)
│ ├── `test-dependencies` (codeSnippet) xml
│ └── `testing-annotations-overview-table` (table)

├── Section 2 · `unit-testing` · Unit Testing
│ ├── `unit-testing-intro` (typography)
│ ├── `subsection: junit5`
│ │ ├── `junit5-annotations-table` (table)
│ │ ├── `at-test-attributes-table` (table)
│ │ ├── `at-parameterized-test-example` (codeSnippet) java
│ │ ├── `at-nested-example` (codeSnippet) java
│ │ ├── `at-extended-with-table` (table)
│ │ └── `assertions-methods-table` (table)
│ ├── `subsection: mockito`
│ │ ├── `mockito-annotations-table` (table)
│ │ ├── `at-mock-attributes-table` (table)
│ │ ├── `at-spy-attributes-table` (table)
│ │ ├── `at-captor-attributes-table` (table)
│ │ ├── `mockito-methods-table` (table)
│ │ ├── `when-then-example` (codeSnippet) java
│ │ ├── `verify-example` (codeSnippet) java
│ │ └── `argument-captor-example` (codeSnippet) java
│ └── `unit-test-complete-example` (codeSnippet) java

├── Section 3 · `spring-boot-test-annotations` · Spring Boot Test Annotations
│ ├── `test-annotations-intro` (typography)
│ ├── `subsection: spring-boot-test`
│ │ ├── `at-spring-boot-test-attributes-table` (table)
│ │ ├── `web-environment-options-table` (table)
│ │ └── `spring-boot-test-example` (codeSnippet) java
│ ├── `at-test-configuration-table` (table)
│ ├── `at-mock-bean-attributes-table` (table)
│ ├── `at-mock-bean-example` (codeSnippet) java
│ ├── `at-spy-bean-attributes-table` (table)
│ ├── `at-import-attributes-table` (table)
│ ├── `at-active-profiles-test-table` (table)
│ ├── `at-test-property-source-attributes-table` (table)
│ ├── `at-sql-attributes-table` (table)
│ └── `at-test-annotations-comparison` (table)

├── Section 4 · `test-slices` · Test Slices — Complete Reference
│ ├── `test-slices-intro` (typography)
│ ├── `test-slices-table` (table)
│ ├── `subsection: web-mvc-test`
│ │ ├── `at-web-mvc-test-attributes-table` (table)
│ │ └── `web-mvc-test-example` (codeSnippet) java
│ ├── `subsection: data-jpa-test`
│ │ ├── `at-data-jpa-test-attributes-table` (table)
│ │ └── `data-jpa-test-example` (codeSnippet) java
│ ├── `subsection: json-test`
│ │ ├── `at-json-test-attributes-table` (table)
│ │ └── `json-test-example` (codeSnippet) java
│ ├── `at-rest-client-test-table` (table)
│ ├── `at-web-flux-test-table` (table)
│ ├── `at-data-mongo-test-table` (table)
│ ├── `at-data-redis-test-table` (table)
│ └── `test-slices-comparison-table` (table)

├── Section 5 · `mock-mvc` · MockMvc — Complete Reference
│ ├── `mock-mvc-intro` (typography)
│ ├── `mock-mvc-setup-table` (table)
│ ├── `subsection: request-builders`
│ │ ├── `request-builder-methods-table` (table)
│ │ └── `request-building-example` (codeSnippet) java
│ ├── `subsection: result-matchers`
│ │ ├── `status-matchers-table` (table)
│ │ ├── `content-matchers-table` (table)
│ │ ├── `json-path-matchers-table` (table)
│ │ └── `header-matchers-table` (table)
│ ├── `mock-mvc-get-example` (codeSnippet) java
│ ├── `mock-mvc-post-example` (codeSnippet) java
│ ├── `mock-mvc-file-upload-example` (codeSnippet) java
│ └── `mock-mvc-security-example` (codeSnippet) java

├── Section 6 · `test-rest-template` · TestRestTemplate — Complete Reference
│ ├── `test-rest-template-intro` (typography)
│ ├── `test-rest-template-methods-table` (table)
│ ├── `test-rest-template-get-example` (codeSnippet) java
│ ├── `test-rest-template-post-example` (codeSnippet) java
│ └── `test-rest-template-vs-mock-mvc` (table)

├── Section 7 · `web-test-client` · WebTestClient — Complete Reference
│ ├── `web-test-client-intro` (typography)
│ ├── `web-test-client-methods-table` (table)
│ ├── `web-test-client-setup-example` (codeSnippet) java
│ ├── `web-test-client-get-example` (codeSnippet) java
│ └── `web-test-client-reactive-example` (codeSnippet) java

├── Section 8 · `testcontainers` · Testcontainers
│ ├── `testcontainers-intro` (typography)
│ ├── `testcontainers-dependency` (codeSnippet) xml
│ ├── `at-testcontainers-table` (table)
│ ├── `at-service-connection-table` (table)
│ ├── `postgres-testcontainer-example` (codeSnippet) java
│ ├── `redis-testcontainer-example` (codeSnippet) java
│ ├── `kafka-testcontainer-example` (codeSnippet) java
│ └── `compose-support-example` (codeSnippet) java

├── Section 9 · `integration-testing` · Integration Testing Patterns
│ ├── `integration-intro` (typography)
│ ├── `integration-test-flow-diagram` (diagram)
│ ├── `context-caching` (contentCard) tinted
│ ├── `context-caching-diagram` (diagram)
│ ├── `test-slicing-strategy` (contentCard) outlined
│ ├── `database-integration-test` (codeSnippet) java
│ ├── `full-stack-integration-test` (codeSnippet) java
│ └── `integration-testing-best-practices` (contentCard) tinted

└── Section 10 · `testing-best-practices` · Testing Best Practices
├── `best-practices-intro` (typography)
├── `best-practices-card` (contentCard) tinted
├── `test-naming-conventions` (contentCard) outlined
├── `antipatterns-table` (table)
└── `testing-checklist` (list) unordered
