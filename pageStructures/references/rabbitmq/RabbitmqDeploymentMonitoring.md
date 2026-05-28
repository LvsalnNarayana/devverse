━━━ PAGE 4: rabbitmq-deployment-monitoring ━━━
(Security, monitoring, deployment, Docker, Kubernetes, backup, troubleshooting)

├── Section 1 · `security` · Security
│ ├── `security-intro` (typography)
│ ├── `security-layers-diagram` (diagram)
│ ├── `subsection: authentication`
│ │ ├── `auth-intro` (typography)
│ │ ├── `user-management-commands` (codeSnippet) bash
│ │ ├── `auth-mechanisms-table` (table)
│ │ └── `ldap-auth-config` (codeSnippet) conf
│ ├── `subsection: authorization`
│ │ ├── `vhost-intro` (typography)
│ │ ├── `vhost-commands` (codeSnippet) bash
│ │ ├── `permissions-table` (table)
│ │ └── `permissions-commands` (codeSnippet) bash
│ ├── `subsection: tls-encryption`
│ │ ├── `tls-intro` (typography)
│ │ ├── `tls-config` (codeSnippet) conf
│ │ └── `tls-client-config` (codeSnippet) java
│ ├── `dangerous-configs` (alert) warning
│ └── `security-checklist` (list) unordered

├── Section 2 · `monitoring-observability` · Monitoring & Observability
│ ├── `monitoring-intro` (typography)
│ ├── `key-metrics` (contentCard) tinted
│ ├── `management-ui-overview` (contentCard) outlined
│ ├── `monitoring-commands` (table)
│ ├── `subsection: prometheus-grafana`
│ │ ├── `prometheus-intro` (typography)
│ │ ├── `prometheus-plugin-setup` (codeSnippet) bash
│ │ ├── `prometheus-config` (codeSnippet) yaml
│ │ ├── `grafana-dashboard-overview` (contentCard) tinted
│ │ └── `key-grafana-panels` (table)
│ ├── `broker-metrics-table` (table)
│ ├── `queue-metrics-table` (table)
│ ├── `consumer-metrics-table` (table)
│ ├── `monitoring-tools` (table)
│ └── `alerting-thresholds` (table)

├── Section 3 · `deployment-strategies` · Deployment Strategies
│ ├── `deployment-intro` (typography)
│ ├── `deployment-modes-table` (table)
│ ├── `subsection: standalone-deployment`
│ │ ├── `standalone-description` (typography)
│ │ ├── `standalone-config` (codeSnippet) conf
│ │ └── `standalone-use-cases` (contentCard) outlined
│ ├── `subsection: cluster-deployment`
│ │ ├── `cluster-deployment-diagram` (diagram)
│ │ ├── `cluster-setup-steps` (stepList)
│ │ └── `cluster-deployment-config` (codeSnippet) bash
│ ├── `subsection: vhost-strategy`
│ │ ├── `vhost-description` (typography)
│ │ ├── `vhost-isolation-diagram` (diagram)
│ │ └── `vhost-setup-commands` (codeSnippet) bash
│ └── `deployment-recommendations` (contentCard) tinted

├── Section 4 · `docker-kubernetes` · Docker & Kubernetes
│ ├── `container-intro` (typography)
│ ├── `subsection: docker-setup`
│ │ ├── `docker-run-command` (codeSnippet) bash
│ │ ├── `docker-compose-standalone` (codeSnippet) yaml
│ │ └── `docker-compose-cluster` (codeSnippet) yaml
│ ├── `subsection: kubernetes-setup`
│ │ ├── `k8s-intro` (typography)
│ │ ├── `k8s-deployment-diagram` (diagram)
│ │ ├── `rabbitmq-k8s-deployment` (codeSnippet) yaml
│ │ ├── `rabbitmq-k8s-service` (codeSnippet) yaml
│ │ ├── `rabbitmq-k8s-configmap` (codeSnippet) yaml
│ │ └── `rabbitmq-operator-overview` (contentCard) tinted
│ └── `container-best-practices` (contentCard) outlined

├── Section 5 · `backup-recovery` · Backup & Recovery
│ ├── `backup-intro` (typography)
│ ├── `backup-strategies` (contentCard) tinted
│ ├── `definitions-export` (codeSnippet) bash
│ ├── `definitions-import` (codeSnippet) bash
│ ├── `automated-backup-script` (codeSnippet) bash
│ ├── `recovery-procedure` (stepList)
│ ├── `recovery-scenarios-table` (table)
│ └── `backup-best-practices` (contentCard) outlined

├── Section 6 · `troubleshooting` · Troubleshooting
│ ├── `troubleshooting-intro` (typography)
│ ├── `common-issues` (table)
│ ├── `subsection: performance-issues`
│ │ ├── `slow-consumers` (contentCard) tinted
│ │ ├── `memory-pressure` (contentCard) outlined
│ │ └── `queue-buildup` (contentCard) tinted
│ ├── `connection-issues` (contentCard) outlined
│ ├── `clustering-issues` (contentCard) tinted
│ ├── `message-loss-issues` (contentCard) outlined
│ ├── `replication-issues` (contentCard) tinted
│ └── `diagnostic-commands` (table)

└── Section 7 · `use-case-examples` · Real-World Use Case Examples
├── `use-case-intro` (typography)
├── `subsection: order-processing`
│ ├── `order-architecture` (typography)
│ ├── `order-diagram` (diagram)
│ └── `order-implementation` (codeSnippet) java
├── `subsection: notification-system`
│ ├── `notification-architecture` (typography)
│ ├── `notification-diagram` (diagram)
│ └── `notification-implementation` (codeSnippet) java
├── `subsection: event-driven-microservices`
│ ├── `microservices-architecture` (typography)
│ ├── `microservices-diagram` (diagram)
│ └── `microservices-implementation` (codeSnippet) java
└── `subsection: task-scheduler`
├── `scheduler-architecture` (typography)
├── `scheduler-diagram` (diagram)
└── `scheduler-implementation` (codeSnippet) java
