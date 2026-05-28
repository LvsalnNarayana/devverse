━━━ PAGE 2: spring-boot-core ━━━

├── Section 1 · `dependency-injection` · Dependency Injection
│ ├── `di-intro` (typography)
│ ├── `di-types-diagram` (diagram)
│ ├── `subsection: constructor-injection`
│ │ ├── `constructor-injection-desc` (typography)
│ │ ├── `constructor-injection-example` (codeSnippet) java
│ │ └── `constructor-injection-benefits` (contentCard) tinted
│ ├── `subsection: setter-injection`
│ │ ├── `setter-injection-desc` (typography)
│ │ └── `setter-injection-example` (codeSnippet) java
│ ├── `subsection: field-injection`
│ │ ├── `field-injection-desc` (typography)
│ │ ├── `field-injection-example` (codeSnippet) java
│ │ └── `field-injection-warning` (alert) warning
│ ├── `injection-comparison-table` (table)
│ └── `circular-dependency` (contentCard) outlined

├── Section 2 · `bean-annotations` · Bean Annotations Complete Reference
│ ├── `bean-annotations-intro` (typography)
│ ├── `subsection: component-annotations`
│ │ ├── `at-component-table` (table)
│ │ ├── `at-component-example` (codeSnippet) java
│ │ ├── `at-service-table` (table)
│ │ ├── `at-service-example` (codeSnippet) java
│ │ ├── `at-repository-table` (table)
│ │ ├── `at-repository-example` (codeSnippet) java
│ │ ├── `at-controller-table` (table)
│ │ └── `at-rest-controller-table` (table)
│ ├── `subsection: bean-declaration`
│ │ ├── `at-bean-attributes-table` (table)
│ │ ├── `at-bean-example` (codeSnippet) java
│ │ ├── `at-configuration-attributes-table` (table)
│ │ └── `at-configuration-example` (codeSnippet) java
│ ├── `subsection: injection-annotations`
│ │ ├── `at-autowired-attributes-table` (table)
│ │ ├── `at-autowired-example` (codeSnippet) java
│ │ ├── `at-qualifier-attributes-table` (table)
│ │ ├── `at-qualifier-example` (codeSnippet) java
│ │ ├── `at-primary-table` (table)
│ │ ├── `at-primary-example` (codeSnippet) java
│ │ ├── `at-resource-table` (table)
│ │ └── `at-inject-table` (table)
│ └── `bean-annotations-comparison` (table)

├── Section 3 · `bean-lifecycle` · Bean Lifecycle
│ ├── `lifecycle-intro` (typography)
│ ├── `bean-lifecycle-diagram` (diagram)
│ ├── `lifecycle-phases-table` (table)
│ ├── `subsection: lifecycle-annotations`
│ │ ├── `at-postconstruct-table` (table)
│ │ ├── `at-postconstruct-example` (codeSnippet) java
│ │ ├── `at-predestroy-table` (table)
│ │ └── `at-predestroy-example` (codeSnippet) java
│ ├── `subsection: lifecycle-interfaces`
│ │ ├── `initializing-bean` (contentCard) tinted
│ │ ├── `initializing-bean-example` (codeSnippet) java
│ │ ├── `disposable-bean` (contentCard) outlined
│ │ └── `disposable-bean-example` (codeSnippet) java
│ └── `lifecycle-order-table` (table)

├── Section 4 · `bean-scopes` · Bean Scopes
│ ├── `scopes-intro` (typography)
│ ├── `at-scope-attributes-table` (table)
│ ├── `scopes-comparison-table` (table)
│ ├── `singleton-scope` (codeSnippet) java
│ ├── `prototype-scope` (codeSnippet) java
│ ├── `request-scope` (codeSnippet) java
│ ├── `session-scope` (codeSnippet) java
│ ├── `application-scope` (codeSnippet) java
│ └── `scope-proxy-mode` (codeSnippet) java

├── Section 5 · `component-scanning` · Component Scanning
│ ├── `scanning-intro` (typography)
│ ├── `scanning-diagram` (diagram)
│ ├── `at-component-scan-attributes-table` (table)
│ ├── `component-scan-example` (codeSnippet) java
│ ├── `include-exclude-filters` (codeSnippet) java
│ ├── `filter-types-table` (table)
│ └── `lazy-initialization` (codeSnippet) java

├── Section 6 · `conditional-annotations` · Conditional Annotations
│ ├── `conditional-intro` (typography)
│ ├── `conditional-annotations-table` (table)
│ ├── `at-conditional-on-class-table` (table)
│ ├── `at-conditional-on-class-example` (codeSnippet) java
│ ├── `at-conditional-on-bean-table` (table)
│ ├── `at-conditional-on-bean-example` (codeSnippet) java
│ ├── `at-conditional-on-property-table` (table)
│ ├── `at-conditional-on-property-example` (codeSnippet) java
│ ├── `at-conditional-on-missing-bean` (codeSnippet) java
│ ├── `at-conditional-on-web-application` (codeSnippet) java
│ ├── `at-conditional-on-expression` (codeSnippet) java
│ ├── `custom-condition` (codeSnippet) java
│ └── `conditional-evaluation-order` (contentCard) outlined

├── Section 7 · `application-events` · Application Events
│ ├── `events-intro` (typography)
│ ├── `events-flow-diagram` (diagram)
│ ├── `built-in-events-table` (table)
│ ├── `at-event-listener-attributes-table` (table)
│ ├── `event-listener-example` (codeSnippet) java
│ ├── `custom-event-example` (codeSnippet) java
│ ├── `publishing-events` (codeSnippet) java
│ ├── `async-events` (codeSnippet) java
│ ├── `ordered-events` (codeSnippet) java
│ └── `transaction-events` (codeSnippet) java

├── Section 8 · `application-context` · ApplicationContext
│ ├── `context-intro` (typography)
│ ├── `context-hierarchy-diagram` (diagram)
│ ├── `context-types-table` (table)
│ ├── `context-methods-table` (table)
│ ├── `context-usage-example` (codeSnippet) java
│ ├── `bean-factory-vs-context` (table)
│ └── `context-aware-interfaces-table` (table)

└── Section 9 · `aop` · AOP — Aspect Oriented Programming
├── `aop-intro` (typography)
├── `aop-concepts-diagram` (diagram)
├── `aop-terminology-table` (table)
├── `at-aspect-table` (table)
├── `subsection: advice-annotations`
│ ├── `at-before-attributes-table` (table)
│ ├── `at-before-example` (codeSnippet) java
│ ├── `at-after-attributes-table` (table)
│ ├── `at-after-returning-attributes-table` (table)
│ ├── `at-after-throwing-attributes-table` (table)
│ ├── `at-around-attributes-table` (table)
│ └── `at-around-example` (codeSnippet) java
├── `subsection: pointcut-annotations`
│ ├── `at-pointcut-attributes-table` (table)
│ ├── `pointcut-expressions-table` (table)
│ └── `pointcut-examples` (codeSnippet) java
├── `aop-proxy-types` (contentCard) tinted
├── `at-enable-aspect-j-auto-proxy-table` (table)
├── `custom-annotation-aop` (codeSnippet) java
└── `aop-ordering` (codeSnippet) java
