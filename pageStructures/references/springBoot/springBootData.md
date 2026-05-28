━━━ PAGE 4: spring-boot-data ━━━

├── Section 1 · `jpa-overview` · JPA & Hibernate Overview
│ ├── `jpa-intro` (typography)
│ ├── `jpa-architecture-diagram` (diagram)
│ ├── `jpa-vs-hibernate-table` (table)
│ ├── `persistence-context-diagram` (diagram)
│ └── `entity-states-diagram` (diagram)

├── Section 2 · `entity-annotations` · Entity Annotations — Complete Reference
│ ├── `entity-annotations-intro` (typography)
│ ├── `subsection: class-level-annotations`
│ │ ├── `at-entity-attributes-table` (table)
│ │ ├── `at-entity-example` (codeSnippet) java
│ │ ├── `at-table-attributes-table` (table)
│ │ ├── `at-table-example` (codeSnippet) java
│ │ ├── `at-mapped-superclass-table` (table)
│ │ ├── `at-inheritance-attributes-table` (table)
│ │ └── `inheritance-strategies-table` (table)
│ ├── `subsection: field-level-annotations`
│ │ ├── `at-id-table` (table)
│ │ ├── `at-generated-value-attributes-table` (table)
│ │ ├── `at-column-attributes-table` (table)
│ │ ├── `at-column-example` (codeSnippet) java
│ │ ├── `at-transient-table` (table)
│ │ ├── `at-enumerated-attributes-table` (table)
│ │ ├── `at-lob-table` (table)
│ │ ├── `at-temporal-attributes-table` (table)
│ │ ├── `at-embedded-table` (table)
│ │ └── `at-embeddable-table` (table)
│ └── `entity-example-complete` (codeSnippet) java

├── Section 3 · `relationships` · Relationships — Complete Reference
│ ├── `relationships-intro` (typography)
│ ├── `relationships-diagram` (diagram)
│ ├── `subsection: one-to-one`
│ │ ├── `at-one-to-one-attributes-table` (table)
│ │ └── `one-to-one-example` (codeSnippet) java
│ ├── `subsection: one-to-many`
│ │ ├── `at-one-to-many-attributes-table` (table)
│ │ └── `one-to-many-example` (codeSnippet) java
│ ├── `subsection: many-to-one`
│ │ ├── `at-many-to-one-attributes-table` (table)
│ │ └── `many-to-one-example` (codeSnippet) java
│ ├── `subsection: many-to-many`
│ │ ├── `at-many-to-many-attributes-table` (table)
│ │ ├── `at-join-table-attributes-table` (table)
│ │ └── `many-to-many-example` (codeSnippet) java
│ ├── `at-join-column-attributes-table` (table)
│ ├── `fetch-types-table` (table)
│ ├── `cascade-types-table` (table)
│ └── `n-plus-one-problem` (contentCard) outlined

├── Section 4 · `repositories` · Repositories — Complete Reference
│ ├── `repositories-intro` (typography)
│ ├── `repository-hierarchy-diagram` (diagram)
│ ├── `subsection: repository-interfaces`
│ │ ├── `repository-interfaces-table` (table)
│ │ ├── `crud-repository-methods-table` (table)
│ │ ├── `jpa-repository-methods-table` (table)
│ │ └── `paging-sorting-methods-table` (table)
│ ├── `subsection: derived-queries`
│ │ ├── `derived-query-keywords-table` (table)
│ │ └── `derived-query-examples` (codeSnippet) java
│ ├── `subsection: custom-queries`
│ │ ├── `at-query-attributes-table` (table)
│ │ ├── `jpql-examples` (codeSnippet) java
│ │ ├── `native-query-examples` (codeSnippet) java
│ │ └── `named-query-examples` (codeSnippet) java
│ ├── `subsection: custom-repository`
│ │ ├── `custom-repo-implementation` (codeSnippet) java
│ │ └── `entity-manager-in-repo` (codeSnippet) java
│ └── `at-modifying-attributes-table` (table)

├── Section 5 · `entity-manager` · EntityManager — Complete Reference
│ ├── `entity-manager-intro` (typography)
│ ├── `entity-manager-methods-table` (table)
│ ├── `entity-manager-example` (codeSnippet) java
│ ├── `criteria-api-example` (codeSnippet) java
│ └── `entity-manager-vs-repository` (table)

├── Section 6 · `transactions-data` · Transactions
│ ├── `transactions-intro` (typography)
│ ├── `transaction-flow-diagram` (diagram)
│ ├── `at-transactional-attributes-table` (table)
│ ├── `propagation-types-table` (table)
│ ├── `isolation-levels-table` (table)
│ ├── `transactional-examples` (codeSnippet) java
│ ├── `read-only-transactions` (codeSnippet) java
│ ├── `programmatic-transactions` (codeSnippet) java
│ └── `transaction-pitfalls` (contentCard) outlined

├── Section 7 · `pagination-sorting` · Pagination & Sorting
│ ├── `pagination-intro` (typography)
│ ├── `pageable-methods-table` (table)
│ ├── `page-methods-table` (table)
│ ├── `pagination-example` (codeSnippet) java
│ ├── `sorting-example` (codeSnippet) java
│ └── `slice-vs-page` (table)

├── Section 8 · `auditing` · Auditing
│ ├── `auditing-intro` (typography)
│ ├── `at-enable-jpa-auditing-table` (table)
│ ├── `auditing-annotations-table` (table)
│ ├── `auditing-example` (codeSnippet) java
│ └── `auditor-aware-example` (codeSnippet) java

├── Section 9 · `hibernate-internals` · Hibernate Internals
│ ├── `hibernate-intro` (typography)
│ ├── `hibernate-cache-diagram` (diagram)
│ ├── `first-level-cache` (contentCard) tinted
│ ├── `second-level-cache` (contentCard) outlined
│ ├── `second-level-cache-config` (codeSnippet) java
│ ├── `query-cache` (contentCard) tinted
│ ├── `hibernate-properties-table` (table)
│ ├── `ddl-auto-options-table` (table)
│ └── `fetch-strategies-table` (table)

├── Section 10 · `projections` · Projections & DTOs
│ ├── `projections-intro` (typography)
│ ├── `interface-projection-example` (codeSnippet) java
│ ├── `class-projection-example` (codeSnippet) java
│ ├── `dynamic-projection-example` (codeSnippet) java
│ └── `projections-comparison-table` (table)

└── Section 11 · `database-migrations` · Database Migrations
├── `migrations-intro` (typography)
├── `flyway-vs-liquibase` (table)
├── `subsection: flyway`
│ ├── `flyway-config` (codeSnippet) yaml
│ ├── `flyway-migration-example` (codeSnippet) sql
│ └── `flyway-commands-table` (table)
└── `subsection: liquibase`
├── `liquibase-config` (codeSnippet) yaml
├── `liquibase-changelog-example` (codeSnippet) xml
└── `liquibase-commands-table` (table)
