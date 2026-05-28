━━━ PAGE 4: redis-deployment-monitoring ━━━
(Security, monitoring, observability, ops, troubleshooting, real-world examples)

├── Section 1 · `security` · Security
│ ├── `security-intro` (typography)
│ ├── `security-layers` (diagram)
│ ├── `authentication` (contentCard) tinted
│ ├── `subsection: acl-section`
│ │ ├── `acl-intro` (typography)
│ │ ├── `acl-commands` (table)
│ │ ├── `acl-example` (codeSnippet) bash
│ │ └── `acl-patterns` (contentCard) outlined
│ ├── `network-security` (contentCard) tinted
│ ├── `tls-encryption` (contentCard) outlined
│ ├── `tls-configuration` (codeSnippet) conf
│ ├── `dangerous-commands` (alert) warning
│ └── `security-checklist` (list) unordered

├── Section 2 · `monitoring-observability` · Monitoring & Observability
│ ├── `monitoring-intro` (typography)
│ ├── `key-metrics` (contentCard) tinted
│ ├── `info-command` (contentCard) outlined
│ ├── `monitoring-commands` (table)
│ ├── `slowlog` (contentCard) tinted
│ ├── `latency-monitoring` (contentCard) outlined
│ ├── `subsection: prometheus-grafana`
│ │ ├── `prometheus-intro` (typography)
│ │ ├── `redis-exporter-setup` (codeSnippet) bash
│ │ ├── `prometheus-config` (codeSnippet) yaml
│ │ ├── `grafana-dashboard-overview` (contentCard) tinted
│ │ └── `key-grafana-panels` (table)
│ ├── `monitoring-tools` (table)
│ └── `alerting-thresholds` (table)

├── Section 3 · `deployment-strategies` · Deployment Strategies
│ ├── `deployment-intro` (typography)
│ ├── `deployment-modes-table` (table)
│ ├── `subsection: standalone-deployment`
│ │ ├── `standalone-description` (typography)
│ │ ├── `standalone-config` (codeSnippet) conf
│ │ └── `standalone-use-cases` (contentCard) outlined
│ ├── `subsection: sentinel-deployment`
│ │ ├── `sentinel-deployment-diagram` (diagram)
│ │ ├── `sentinel-setup-steps` (stepList)
│ │ └── `sentinel-deployment-config` (codeSnippet) conf
│ ├── `subsection: cluster-deployment`
│ │ ├── `cluster-deployment-diagram` (diagram)
│ │ ├── `cluster-setup-steps` (stepList)
│ │ └── `cluster-deployment-config` (codeSnippet) bash
│ └── `deployment-recommendations` (contentCard) tinted

├── Section 4 · `docker-kubernetes` · Docker & Kubernetes
│ ├── `container-intro` (typography)
│ ├── `subsection: docker-setup`
│ │ ├── `docker-run-command` (codeSnippet) bash
│ │ ├── `docker-compose-standalone` (codeSnippet) yaml
│ │ └── `docker-compose-sentinel` (codeSnippet) yaml
│ ├── `subsection: kubernetes-setup`
│ │ ├── `k8s-intro` (typography)
│ │ ├── `k8s-deployment-diagram` (diagram)
│ │ ├── `redis-k8s-deployment` (codeSnippet) yaml
│ │ ├── `redis-k8s-service` (codeSnippet) yaml
│ │ ├── `redis-k8s-configmap` (codeSnippet) yaml
│ │ └── `redis-operator-overview` (contentCard) tinted
│ └── `container-best-practices` (contentCard) outlined

├── Section 5 · `backup-recovery` · Backup & Recovery
│ ├── `backup-intro` (typography)
│ ├── `backup-strategies` (contentCard) tinted
│ ├── `rdb-backup-commands` (codeSnippet) bash
│ ├── `aof-backup-commands` (codeSnippet) bash
│ ├── `automated-backup-script` (codeSnippet) bash
│ ├── `recovery-procedure` (stepList)
│ ├── `recovery-scenarios-table` (table)
│ └── `backup-best-practices` (contentCard) outlined

├── Section 6 · `troubleshooting` · Troubleshooting
│ ├── `troubleshooting-intro` (typography)
│ ├── `common-issues` (table)
│ ├── `subsection: performance-issues`
│ │ ├── `slow-queries` (contentCard) tinted
│ │ └── `memory-issues` (contentCard) outlined
│ ├── `connection-issues` (contentCard) tinted
│ ├── `replication-issues` (contentCard) outlined
│ ├── `cluster-issues` (contentCard) tinted
│ ├── `persistence-issues` (contentCard) outlined
│ └── `diagnostic-commands` (table)

└── Section 7 · `use-case-examples` · Real-World Use Case Examples
├── `use-case-intro` (typography)
├── `subsection: ecommerce-cart`
│ ├── `cart-architecture` (typography)
│ ├── `cart-diagram` (diagram)
│ └── `cart-implementation` (codeSnippet) java
├── `subsection: social-feed`
│ ├── `feed-architecture` (typography)
│ ├── `feed-diagram` (diagram)
│ └── `feed-implementation` (codeSnippet) java
├── `subsection: real-time-analytics`
│ ├── `analytics-architecture` (typography)
│ ├── `analytics-diagram` (diagram)
│ └── `analytics-implementation` (codeSnippet) java
└── `subsection: job-queue`
├── `queue-architecture` (typography)
├── `queue-diagram` (diagram)
└── `queue-implementation` (codeSnippet) java
