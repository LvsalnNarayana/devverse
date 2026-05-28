━━━ PAGE 3: spring-boot-web ━━━

├── Section 1 · `web-mvc-overview` · Spring MVC Overview
│ ├── `web-mvc-intro` (typography)
│ ├── `dispatcher-servlet-diagram` (diagram)
│ ├── `request-processing-flow-diagram` (diagram)
│ └── `mvc-components-table` (table)

├── Section 2 · `controller-annotations` · Controller Annotations
│ ├── `controller-intro` (typography)
│ ├── `at-controller-attributes-table` (table)
│ ├── `at-rest-controller-attributes-table` (table)
│ ├── `at-request-mapping-attributes-table` (table)
│ ├── `request-mapping-example` (codeSnippet) java
│ ├── `subsection: http-method-annotations`
│ │ ├── `at-get-mapping-attributes-table` (table)
│ │ ├── `at-post-mapping-attributes-table` (table)
│ │ ├── `at-put-mapping-attributes-table` (table)
│ │ ├── `at-patch-mapping-attributes-table` (table)
│ │ ├── `at-delete-mapping-attributes-table` (table)
│ │ └── `http-methods-comparison` (table)
│ └── `controller-example` (codeSnippet) java

├── Section 3 · `input-formats` · Input Formats — Complete Reference
│ ├── `inputs-intro` (typography)
│ ├── `subsection: request-body`
│ │ ├── `at-request-body-attributes-table` (table)
│ │ ├── `at-request-body-example` (codeSnippet) java
│ │ └── `request-body-content-types` (table)
│ ├── `subsection: path-variable`
│ │ ├── `at-path-variable-attributes-table` (table)
│ │ ├── `at-path-variable-example` (codeSnippet) java
│ │ └── `path-variable-types` (table)
│ ├── `subsection: request-param`
│ │ ├── `at-request-param-attributes-table` (table)
│ │ ├── `at-request-param-example` (codeSnippet) java
│ │ └── `optional-params-example` (codeSnippet) java
│ ├── `subsection: request-header`
│ │ ├── `at-request-header-attributes-table` (table)
│ │ └── `at-request-header-example` (codeSnippet) java
│ ├── `subsection: cookie-value`
│ │ ├── `at-cookie-value-attributes-table` (table)
│ │ └── `at-cookie-value-example` (codeSnippet) java
│ ├── `subsection: model-attribute`
│ │ ├── `at-model-attribute-attributes-table` (table)
│ │ └── `at-model-attribute-example` (codeSnippet) java
│ ├── `subsection: matrix-variable`
│ │ ├── `at-matrix-variable-attributes-table` (table)
│ │ └── `at-matrix-variable-example` (codeSnippet) java
│ ├── `subsection: request-part`
│ │ ├── `at-request-part-attributes-table` (table)
│ │ └── `at-request-part-example` (codeSnippet) java
│ └── `input-formats-comparison-table` (table)

├── Section 4 · `return-formats` · Return Formats — Complete Reference
│ ├── `returns-intro` (typography)
│ ├── `subsection: response-entity`
│ │ ├── `response-entity-methods-table` (table)
│ │ ├── `response-entity-example` (codeSnippet) java
│ │ └── `response-entity-builder` (codeSnippet) java
│ ├── `subsection: response-body`
│ │ ├── `at-response-body-table` (table)
│ │ └── `at-response-body-example` (codeSnippet) java
│ ├── `subsection: response-status`
│ │ ├── `at-response-status-attributes-table` (table)
│ │ └── `at-response-status-example` (codeSnippet) java
│ ├── `subsection: http-entity`
│ │ ├── `http-entity-methods-table` (table)
│ │ └── `http-entity-example` (codeSnippet) java
│ ├── `subsection: problem-detail`
│ │ ├── `problem-detail-intro` (typography)
│ │ ├── `problem-detail-methods-table` (table)
│ │ └── `problem-detail-example` (codeSnippet) java
│ ├── `subsection: streaming-responses`
│ │ ├── `streaming-intro` (typography)
│ │ ├── `response-body-emitter` (codeSnippet) java
│ │ └── `sse-emitter` (codeSnippet) java
│ └── `return-types-comparison-table` (table)

├── Section 5 · `validation` · Validation — Complete Reference
│ ├── `validation-intro` (typography)
│ ├── `validation-flow-diagram` (diagram)
│ ├── `subsection: constraint-annotations`
│ │ ├── `bean-validation-annotations-table` (table)
│ │ ├── `at-not-null-attributes-table` (table)
│ │ ├── `at-not-blank-attributes-table` (table)
│ │ ├── `at-size-attributes-table` (table)
│ │ ├── `at-min-max-attributes-table` (table)
│ │ ├── `at-pattern-attributes-table` (table)
│ │ ├── `at-email-attributes-table` (table)
│ │ └── `validation-example` (codeSnippet) java
│ ├── `at-valid-vs-at-validated` (table)
│ ├── `validation-groups` (codeSnippet) java
│ ├── `custom-validator` (codeSnippet) java
│ └── `programmatic-validation` (codeSnippet) java

├── Section 6 · `exception-handling` · Exception Handling
│ ├── `exception-handling-intro` (typography)
│ ├── `exception-handling-flow-diagram` (diagram)
│ ├── `subsection: controller-advice`
│ │ ├── `at-controller-advice-attributes-table` (table)
│ │ ├── `at-exception-handler-attributes-table` (table)
│ │ └── `controller-advice-example` (codeSnippet) java
│ ├── `subsection: response-status-exception`
│ │ ├── `response-status-exception-methods-table` (table)
│ │ └── `response-status-exception-example` (codeSnippet) java
│ ├── `subsection: problem-detail-exceptions`
│ │ └── `problem-detail-exception-example` (codeSnippet) java
│ ├── `global-exception-handler-example` (codeSnippet) java
│ └── `exception-hierarchy-table` (table)

├── Section 7 · `filters-interceptors` · Filters & Interceptors
│ ├── `filters-interceptors-intro` (typography)
│ ├── `filter-vs-interceptor-diagram` (diagram)
│ ├── `filter-vs-interceptor-table` (table)
│ ├── `subsection: filters`
│ │ ├── `filter-interface-methods-table` (table)
│ │ ├── `filter-example` (codeSnippet) java
│ │ ├── `at-web-filter-attributes-table` (table)
│ │ ├── `filter-registration-bean` (codeSnippet) java
│ │ └── `ordered-filter` (codeSnippet) java
│ └── `subsection: interceptors`
│ ├── `handler-interceptor-methods-table` (table)
│ ├── `interceptor-example` (codeSnippet) java
│ └── `interceptor-registration` (codeSnippet) java

├── Section 8 · `cors-config` · CORS Configuration
│ ├── `cors-intro` (typography)
│ ├── `cors-flow-diagram` (diagram)
│ ├── `at-cross-origin-attributes-table` (table)
│ ├── `at-cross-origin-example` (codeSnippet) java
│ ├── `global-cors-config` (codeSnippet) java
│ └── `cors-filter-config` (codeSnippet) java

├── Section 9 · `file-handling-web` · File Upload & Download
│ ├── `file-intro` (typography)
│ ├── `multipart-file-methods-table` (table)
│ ├── `file-upload-example` (codeSnippet) java
│ ├── `multiple-file-upload` (codeSnippet) java
│ ├── `file-download-example` (codeSnippet) java
│ ├── `file-config-properties` (table)
│ └── `file-validation` (codeSnippet) java

└── Section 10 · `content-negotiation` · Content Negotiation & Message Converters
├── `content-negotiation-intro` (typography)
├── `content-negotiation-diagram` (diagram)
├── `message-converters-table` (table)
├── `produces-consumes-example` (codeSnippet) java
├── `custom-message-converter` (codeSnippet) java
└── `accept-header-examples` (table)
