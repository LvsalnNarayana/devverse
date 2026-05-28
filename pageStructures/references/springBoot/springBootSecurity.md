━━━ PAGE 5: spring-boot-security ━━━

├── Section 1 · `security-overview` · Spring Security Overview
│ ├── `security-intro` (typography)
│ ├── `security-architecture-diagram` (diagram)
│ ├── `security-filter-chain-diagram` (diagram)
│ ├── `security-components-table` (table)
│ └── `security-dependency` (codeSnippet) xml

├── Section 2 · `security-annotations` · Security Annotations — Complete Reference
│ ├── `security-annotations-intro` (typography)
│ ├── `at-enable-web-security-attributes-table` (table)
│ ├── `at-enable-method-security-attributes-table` (table)
│ ├── `at-secured-attributes-table` (table)
│ ├── `at-secured-example` (codeSnippet) java
│ ├── `at-pre-authorize-attributes-table` (table)
│ ├── `at-pre-authorize-example` (codeSnippet) java
│ ├── `at-post-authorize-attributes-table` (table)
│ ├── `at-roles-allowed-attributes-table` (table)
│ └── `security-annotations-comparison` (table)

├── Section 3 · `security-config` · SecurityFilterChain Configuration
│ ├── `security-config-intro` (typography)
│ ├── `security-filter-chain-methods-table` (table)
│ ├── `http-security-methods-table` (table)
│ ├── `basic-security-config` (codeSnippet) java
│ ├── `role-based-config` (codeSnippet) java
│ └── `multiple-security-configs` (codeSnippet) java

├── Section 4 · `authentication` · Authentication
│ ├── `authentication-intro` (typography)
│ ├── `authentication-flow-diagram` (diagram)
│ ├── `subsection: user-details`
│ │ ├── `user-details-methods-table` (table)
│ │ ├── `user-details-service-methods-table` (table)
│ │ └── `custom-user-details-example` (codeSnippet) java
│ ├── `subsection: authentication-providers`
│ │ ├── `authentication-provider-methods-table` (table)
│ │ ├── `dao-authentication-provider` (codeSnippet) java
│ │ └── `custom-auth-provider` (codeSnippet) java
│ ├── `subsection: password-encoding`
│ │ ├── `password-encoder-methods-table` (table)
│ │ ├── `bcrypt-example` (codeSnippet) java
│ │ └── `password-encoders-comparison` (table)
│ └── `in-memory-authentication` (codeSnippet) java

├── Section 5 · `jwt-authentication` · JWT Authentication
│ ├── `jwt-intro` (typography)
│ ├── `jwt-flow-diagram` (diagram)
│ ├── `jwt-structure-diagram` (diagram)
│ ├── `jwt-dependency` (codeSnippet) xml
│ ├── `jwt-service-example` (codeSnippet) java
│ ├── `jwt-filter-example` (codeSnippet) java
│ ├── `jwt-security-config` (codeSnippet) java
│ └── `jwt-token-claims-table` (table)

├── Section 6 · `oauth2` · OAuth2 & OpenID Connect
│ ├── `oauth2-intro` (typography)
│ ├── `oauth2-flow-diagram` (diagram)
│ ├── `oauth2-roles-table` (table)
│ ├── `oauth2-grant-types-table` (table)
│ ├── `oauth2-client-config` (codeSnippet) yaml
│ ├── `oauth2-resource-server-config` (codeSnippet) java
│ └── `oauth2-login-config` (codeSnippet) java

├── Section 7 · `authorization` · Authorization
│ ├── `authorization-intro` (typography)
│ ├── `authorization-flow-diagram` (diagram)
│ ├── `request-matchers-methods-table` (table)
│ ├── `authority-vs-role` (table)
│ ├── `spel-security-expressions-table` (table)
│ └── `hierarchical-roles-example` (codeSnippet) java

├── Section 8 · `csrf-cors-security` · CSRF & CORS
│ ├── `csrf-intro` (typography)
│ ├── `csrf-flow-diagram` (diagram)
│ ├── `csrf-config-options` (multiTabCodeSnippet) enabled/disabled
│ ├── `cors-security-config` (codeSnippet) java
│ └── `csrf-vs-cors-table` (table)

├── Section 9 · `session-management` · Session Management
│ ├── `session-intro` (typography)
│ ├── `session-creation-policies-table` (table)
│ ├── `session-management-config` (codeSnippet) java
│ ├── `concurrent-session-control` (codeSnippet) java
│ └── `stateless-session-config` (codeSnippet) java

└── Section 10 · `custom-security-filters` · Custom Security Filters
├── `custom-filter-intro` (typography)
├── `security-filter-order-diagram` (diagram)
├── `custom-filter-example` (codeSnippet) java
├── `filter-placement-methods-table` (table)
├── `once-per-request-filter` (codeSnippet) java
└── `filter-order-table` (table)
