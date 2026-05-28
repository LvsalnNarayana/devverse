━━━ PAGE 1: spring-boot-fundamentals ━━━

├── Section 1 · `what-is-spring-boot` · What is Spring Boot
│ ├── `spring-boot-definition` (typography)
│ ├── `core-characteristics` (contentCard) tinted
│ ├── `convention-over-configuration` (contentCard) outlined
│ ├── `opinionated-defaults` (contentCard) tinted
│ └── `spring-boot-vs-spring-framework` (table)

├── Section 2 · `history-of-spring-boot` · History of Spring Boot
│ ├── `origin-story` (typography)
│ ├── `major-milestones` (table)
│ └── `evolution-timeline` (contentCard) tinted

├── Section 3 · `why-spring-boot` · Why Spring Boot
│ ├── `why-intro` (typography)
│ ├── `subsection: advantages`
│ │ ├── `rapid-development` (contentCard) outlined
│ │ ├── `embedded-server-advantage` (contentCard) outlined
│ │ ├── `production-ready` (contentCard) outlined
│ │ ├── `auto-configuration-advantage` (contentCard) outlined
│ │ ├── `microservices-ready` (contentCard) outlined
│ │ └── `vast-ecosystem` (contentCard) outlined
│ └── `subsection: when-not-to-use`
│ ├── `anti-patterns` (contentCard) outlined
│ └── `alternative-solutions` (table)

├── Section 4 · `spring-boot-vs-alternatives` · Spring Boot vs Alternatives
│ ├── `comparison-intro` (typography)
│ ├── `comparison-table` (table)
│ └── `comparison-summary` (contentCard) tinted

├── Section 5 · `project-setup` · Project Setup
│ ├── `setup-intro` (typography)
│ ├── `spring-initializr` (contentCard) tinted
│ ├── `maven-gradle-structure` (multiTabCodeSnippet) maven/gradle
│ ├── `project-structure-diagram` (diagram)
│ ├── `project-structure-table` (table)
│ └── `first-application` (codeSnippet) java

├── Section 6 · `spring-boot-application-annotation` · @SpringBootApplication
│ ├── `annotation-intro` (typography)
│ ├── `annotation-definition` (contentCard) tinted
│ ├── `annotation-attributes-table` (table)
│ ├── `composed-annotations-diagram` (diagram)
│ ├── `annotation-usage-example` (codeSnippet) java
│ ├── `exclude-auto-config` (codeSnippet) java
│ ├── `scan-base-packages-example` (codeSnippet) java
│ └── `annotation-internals` (contentCard) outlined

├── Section 7 · `spring-application-class` · SpringApplication Class
│ ├── `spring-application-intro` (typography)
│ ├── `subsection: constructors`
│ │ ├── `constructors-table` (table)
│ │ └── `constructor-examples` (codeSnippet) java
│ ├── `subsection: static-methods`
│ │ ├── `static-methods-table` (table)
│ │ └── `run-method-variants` (codeSnippet) java
│ ├── `subsection: instance-methods`
│ │ ├── `instance-methods-table` (table)
│ │ └── `instance-methods-example` (codeSnippet) java
│ ├── `subsection: configuration-methods`
│ │ ├── `set-banner-mode` (codeSnippet) java
│ │ ├── `set-web-application-type` (codeSnippet) java
│ │ ├── `add-listeners` (codeSnippet) java
│ │ └── `set-default-properties` (codeSnippet) java
│ └── `spring-application-builder` (codeSnippet) java

├── Section 8 · `auto-configuration` · Auto-Configuration Internals
│ ├── `auto-config-intro` (typography)
│ ├── `auto-config-flow-diagram` (diagram)
│ ├── `spring-factories-mechanism` (contentCard) tinted
│ ├── `autoconfiguration-imports` (contentCard) outlined
│ ├── `conditional-annotations-overview` (contentCard) tinted
│ ├── `auto-config-order` (contentCard) outlined
│ ├── `debug-auto-config` (codeSnippet) bash
│ ├── `custom-auto-config-example` (codeSnippet) java
│ └── `auto-config-exclusion` (codeSnippet) java

├── Section 9 · `starters` · Spring Boot Starters
│ ├── `starters-intro` (typography)
│ ├── `starter-mechanism-diagram` (diagram)
│ ├── `official-starters-table` (table)
│ ├── `starter-internals` (contentCard) tinted
│ └── `custom-starter-guide` (codeSnippet) java

├── Section 10 · `application-lifecycle` · Application Lifecycle
│ ├── `lifecycle-intro` (typography)
│ ├── `lifecycle-diagram` (diagram)
│ ├── `lifecycle-events-table` (table)
│ ├── `subsection: lifecycle-interfaces`
│ │ ├── `command-line-runner` (contentCard) tinted
│ │ ├── `command-line-runner-example` (codeSnippet) java
│ │ ├── `application-runner` (contentCard) outlined
│ │ ├── `application-runner-example` (codeSnippet) java
│ │ ├── `init-destroying-beans` (contentCard) tinted
│ │ └── `smart-lifecycle-example` (codeSnippet) java
│ └── `startup-failure-analysis` (contentCard) outlined

├── Section 11 · `embedded-server` · Embedded Server
│ ├── `embedded-server-intro` (typography)
│ ├── `embedded-server-diagram` (diagram)
│ ├── `server-comparison-table` (table)
│ ├── `tomcat-configuration` (codeSnippet) yaml
│ ├── `switch-to-jetty` (codeSnippet) xml
│ ├── `switch-to-undertow` (codeSnippet) xml
│ ├── `ssl-configuration` (codeSnippet) yaml
│ └── `server-customization` (codeSnippet) java

├── Section 12 · `configuration-properties` · Configuration & Properties
│ ├── `config-intro` (typography)
│ ├── `config-sources-diagram` (diagram)
│ ├── `config-precedence-table` (table)
│ ├── `subsection: application-properties`
│ │ ├── `properties-vs-yaml` (table)
│ │ ├── `properties-example` (multiTabCodeSnippet) properties/yaml
│ │ └── `common-properties-table` (table)
│ ├── `subsection: configuration-properties-annotation`
│ │ ├── `at-configuration-properties-intro` (typography)
│ │ ├── `at-configuration-properties-attributes-table` (table)
│ │ ├── `configuration-properties-example` (codeSnippet) java
│ │ └── `nested-properties-example` (codeSnippet) java
│ ├── `subsection: value-annotation`
│ │ ├── `at-value-intro` (typography)
│ │ ├── `at-value-attributes-table` (table)
│ │ ├── `at-value-examples` (codeSnippet) java
│ │ └── `spel-expressions` (codeSnippet) java
│ └── `config-validation` (codeSnippet) java

├── Section 13 · `profiles` · Profiles
│ ├── `profiles-intro` (typography)
│ ├── `profiles-diagram` (diagram)
│ ├── `at-profile-attributes-table` (table)
│ ├── `profile-specific-properties` (codeSnippet) yaml
│ ├── `at-profile-example` (codeSnippet) java
│ ├── `activating-profiles` (multiTabCodeSnippet) yaml/bash/java
│ ├── `profile-groups` (codeSnippet) yaml
│ └── `profile-conditions` (codeSnippet) java

├── Section 14 · `environment-abstraction` · Environment Abstraction
│ ├── `environment-intro` (typography)
│ ├── `environment-methods-table` (table)
│ ├── `environment-usage-example` (codeSnippet) java
│ ├── `property-sources-table` (table)
│ └── `custom-property-source` (codeSnippet) java

└── Section 15 · `logging` · Logging

    ├── `logging-intro` (typography)
    ├── `logging-architecture-diagram` (diagram)

    ├── subsection: `default-logging`
    │   ├── `default-logging-intro` (typography)
    │   ├── `default-logging-stack` (contentCard) tinted
    │   ├── `log-levels-table` (table)
    │   ├── `default-output-format` (codeSnippet) bash
    │   └── `log-level-configuration` (codeSnippet) yaml

    ├── subsection: `logback`
    │   ├── `logback-intro` (typography)
    │   ├── `logback-spring-xml-vs-logback-xml` (contentCard) outlined
    │   ├── `logback-components-table` (table)
    │   ├── `basic-logback-spring-xml` (codeSnippet) xml
    │   ├── `rolling-file-appender` (codeSnippet) xml
    │   ├── `json-encoder-logstash` (codeSnippet) xml
    │   ├── `async-appender` (codeSnippet) xml
    │   └── `logback-internals` (contentCard) tinted

    ├── subsection: `profile-based-logging`
    │   ├── `profile-logging-intro` (typography)
    │   ├── `springProfile-element` (contentCard) tinted
    │   ├── `profile-logback-example` (codeSnippet) xml
    │   ├── `profile-via-application-yaml` (codeSnippet) yaml
    │   └── `profile-logging-patterns-table` (table)

    ├── subsection: `log4j2`
    │   ├── `log4j2-intro` (typography)
    │   ├── `log4j2-dependency-switch` (codeSnippet) xml
    │   ├── `log4j2-xml-config` (codeSnippet) xml
    │   ├── `log4j2-async-config` (codeSnippet) xml
    │   └── `log4j2-vs-logback` (table)

    ├── subsection: `structured-logging`
    │   ├── `structured-logging-intro` (typography)
    │   ├── `mdc-usage` (contentCard) tinted
    │   ├── `mdc-example` (codeSnippet) java
    │   ├── `logstash-logback-encoder` (codeSnippet) xml
    │   ├── `structured-json-output` (codeSnippet) json
    │   └── `mdc-filter-example` (codeSnippet) java

    ├── subsection: `kafka-log-appender`
    │   ├── `kafka-logging-intro` (typography)
    │   ├── `kafka-appender-use-cases` (contentCard) outlined
    │   ├── `kafka-log4j2-appender-dependency` (codeSnippet) xml
    │   ├── `kafka-log4j2-appender-config` (codeSnippet) xml
    │   ├── `kafka-logback-appender-dependency` (codeSnippet) xml
    │   ├── `kafka-logback-appender-config` (codeSnippet) xml
    │   ├── `kafka-appender-reliability` (contentCard) tinted
    │   └── `kafka-appender-pitfalls` (alert) warning

    ├── subsection: `elk-stack-integration`
    │   ├── `elk-intro` (typography)
    │   ├── `elk-architecture-diagram` (diagram)
    │   ├── `logstash-logback-encoder-setup` (codeSnippet) xml
    │   ├── `filebeat-config` (codeSnippet) yaml
    │   ├── `logstash-pipeline-config` (codeSnippet) conf
    │   └── `elk-best-practices` (contentCard) outlined

    ├── subsection: `loki-grafana`
    │   ├── `loki-intro` (typography)
    │   ├── `loki-dependency` (codeSnippet) xml
    │   ├── `loki-appender-config` (codeSnippet) yaml
    │   ├── `loki-logback-config` (codeSnippet) xml
    │   └── `loki-vs-elk` (table)

    ├── subsection: `distributed-tracing-correlation`
    │   ├── `tracing-intro` (typography)
    │   ├── `micrometer-tracing-dependency` (codeSnippet) xml
    │   ├── `trace-id-in-logs` (codeSnippet) yaml
    │   ├── `mdc-trace-propagation` (codeSnippet) java
    │   └── `tracing-log-correlation-table` (table)

    ├── subsection: `logging-best-practices`
    │   ├── `best-practices-intro` (typography)
    │   ├── `what-to-log` (contentCard) tinted
    │   ├── `log-level-guide-table` (table)
    │   ├── `performance-impact` (contentCard) outlined
    │   ├── `sensitive-data-masking` (codeSnippet) java
    │   └── `logging-antipatterns` (alert) warning

    └── `logging-decision-guide` (contentCard) tinted
