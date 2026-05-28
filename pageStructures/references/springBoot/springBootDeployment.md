━━━ PAGE 8: spring-boot-deployment ━━━

├── Section 1 · `actuator-deep-dive` · Actuator — Complete Reference
│ ├── `actuator-intro` (typography)
│ ├── `actuator-architecture-diagram` (diagram)
│ ├── `all-endpoints-table` (table)
│ ├── `actuator-config-properties-table` (table)
│ ├── `subsection: health-indicators`
│ │ ├── `built-in-health-indicators-table` (table)
│ │ ├── `custom-health-indicator-example` (codeSnippet) java
│ │ └── `composite-health-indicator` (codeSnippet) java
│ ├── `subsection: custom-endpoints`
│ │ ├── `at-endpoint-attributes-table` (table)
│ │ ├── `at-read-operation-table` (table)
│ │ ├── `at-write-operation-table` (table)
│ │ └── `custom-endpoint-example` (codeSnippet) java
│ ├── `actuator-security-config` (codeSnippet) java
│ └── `actuator-properties-table` (table)

├── Section 2 · `metrics-micrometer` · Metrics & Micrometer
│ ├── `metrics-intro` (typography)
│ ├── `micrometer-architecture-diagram` (diagram)
│ ├── `meter-types-table` (table)
│ ├── `meter-registry-methods-table` (table)
│ ├── `counter-example` (codeSnippet) java
│ ├── `gauge-example` (codeSnippet) java
│ ├── `timer-example` (codeSnippet) java
│ ├── `at-timed-attributes-table` (table)
│ ├── `at-counted-attributes-table` (table)
│ ├── `custom-metric-example` (codeSnippet) java
│ └── `micrometer-registries-table` (table)

├── Section 3 · `logging` · Logging
│ ├── `logging-intro` (typography)
│ ├── `logging-hierarchy-diagram` (diagram)
│ ├── `logging-properties-table` (table)
│ ├── `log-levels-table` (table)
│ ├── `logging-config-example` (codeSnippet) yaml
│ ├── `subsection: logback`
│ │ ├── `logback-config-example` (codeSnippet) xml
│ │ └── `logback-rolling-policy` (codeSnippet) xml
│ ├── `subsection: log4j2`
│ │ └── `log4j2-config-example` (codeSnippet) xml
│ ├── `structured-logging-example` (codeSnippet) java
│ └── `mdc-example` (codeSnippet) java

├── Section 4 · `docker-deployment` · Docker
│ ├── `docker-intro` (typography)
│ ├── `docker-deployment-diagram` (diagram)
│ ├── `subsection: dockerfile`
│ │ ├── `basic-dockerfile` (codeSnippet) dockerfile
│ │ ├── `layered-jar-dockerfile` (codeSnippet) dockerfile
│ │ └── `multi-stage-dockerfile` (codeSnippet) dockerfile
│ ├── `subsection: buildpacks`
│ │ ├── `buildpacks-intro` (typography)
│ │ ├── `buildpacks-config` (codeSnippet) xml
│ │ └── `buildpacks-commands` (codeSnippet) bash
│ ├── `subsection: jib`
│ │ ├── `jib-intro` (typography)
│ │ └── `jib-config` (codeSnippet) xml
│ ├── `docker-compose-example` (codeSnippet) yaml
│ └── `docker-best-practices` (contentCard) tinted

├── Section 5 · `kubernetes-deployment` · Kubernetes
│ ├── `k8s-intro` (typography)
│ ├── `k8s-deployment-diagram` (diagram)
│ ├── `k8s-deployment-manifest` (codeSnippet) yaml
│ ├── `k8s-service-manifest` (codeSnippet) yaml
│ ├── `k8s-configmap-manifest` (codeSnippet) yaml
│ ├── `k8s-secrets-manifest` (codeSnippet) yaml
│ ├── `subsection: probes`
│ │ ├── `liveness-probe-config` (codeSnippet) yaml
│ │ ├── `readiness-probe-config` (codeSnippet) yaml
│ │ ├── `startup-probe-config` (codeSnippet) yaml
│ │ └── `probes-comparison-table` (table)
│ ├── `subsection: graceful-shutdown`
│ │ ├── `graceful-shutdown-config` (codeSnippet) yaml
│ │ └── `graceful-shutdown-diagram` (diagram)
│ └── `k8s-best-practices` (contentCard) tinted

├── Section 6 · `graalvm-native` · GraalVM Native Image
│ ├── `graalvm-intro` (typography)
│ ├── `native-vs-jvm-diagram` (diagram)
│ ├── `native-vs-jvm-comparison-table` (table)
│ ├── `native-build-config` (codeSnippet) xml
│ ├── `native-build-commands` (codeSnippet) bash
│ ├── `native-hints-example` (codeSnippet) java
│ ├── `aot-processing-diagram` (diagram)
│ └── `native-limitations` (contentCard) outlined

├── Section 7 · `prometheus-grafana` · Prometheus & Grafana
│ ├── `prometheus-intro` (typography)
│ ├── `prometheus-grafana-diagram` (diagram)
│ ├── `prometheus-dependency` (codeSnippet) xml
│ ├── `prometheus-config` (codeSnippet) yaml
│ ├── `prometheus-scrape-config` (codeSnippet) yaml
│ ├── `grafana-dashboard-overview` (contentCard) tinted
│ ├── `key-grafana-panels-table` (table)
│ └── `alerting-rules-example` (codeSnippet) yaml

├── Section 8 · `performance-tuning` · Performance Tuning
│ ├── `performance-intro` (typography)
│ ├── `subsection: jvm-tuning`
│ │ ├── `jvm-flags-table` (table)
│ │ └── `jvm-config-example` (codeSnippet) bash
│ ├── `subsection: thread-pool-tuning`
│ │ ├── `tomcat-thread-pool-config` (codeSnippet) yaml
│ │ └── `thread-pool-sizing-guide` (contentCard) tinted
│ ├── `subsection: connection-pool-tuning`
│ │ ├── `hikari-properties-table` (table)
│ │ └── `hikari-config-example` (codeSnippet) yaml
│ ├── `startup-time-optimization` (contentCard) outlined
│ └── `performance-antipatterns-table` (table)

└── Section 9 · `troubleshooting` · Troubleshooting
├── `troubleshooting-intro` (typography)
├── `common-issues-table` (table)
├── `subsection: startup-issues`
│ ├── `bean-creation-issues` (contentCard) tinted
│ ├── `port-in-use-issues` (contentCard) outlined
│ └── `auto-config-debug` (codeSnippet) bash
├── `subsection: runtime-issues`
│ ├── `memory-leak-detection` (contentCard) tinted
│ ├── `thread-dump-analysis` (codeSnippet) bash
│ └── `heap-dump-analysis` (codeSnippet) bash
├── `diagnostic-commands-table` (table)
└── `failure-analyzer-example` (codeSnippet) java
