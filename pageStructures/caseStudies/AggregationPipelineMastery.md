---
title: Aggregation Pipeline Mastery
caseStudyId: aggregation-pipeline-mastery
page: /case-studies/aggregation-pipeline-mastery
section: Case Studies / MongoDB
source: pageStructures/caseStudies/AggregationPipelineMastery.md
---

```
blog/
└── aggregation-pipeline-mastery.md          # Main published article (or split per section below)

├── 1. Introduction
│   ├── 1.1 What this project demonstrates
│   ├── 1.2 Who it is for
│   └── 1.3 What you will learn

├── 2. Business context
│   ├── 2.1 Commerce domain (orders, products, payments, reviews)
│   ├── 2.2 Why analytics belongs in a dedicated service
│   └── 2.3 Sample questions the pipelines answer

├── 3. Architecture
│   ├── 3.1 High-level system view                    [Diagram D1, D2]
│   ├── 3.2 Microservices and responsibilities
│   │   ├── 3.2.1 order-service
│   │   ├── 3.2.2 product-service
│   │   ├── 3.2.3 payment-service
│   │   ├── 3.2.4 review-service
│   │   └── 3.2.5 analytics-service
│   ├── 3.3 API Gateway and Eureka                      [Diagram D5]
│   ├── 3.4 Config Server
│   └── 3.5 MongoDB `commerce` database                 [Diagram D3, D4]

├── 4. Data model
│   ├── 4.1 Collection: orders
│   ├── 4.2 Collection: payments
│   ├── 4.3 Collection: products (incl. parentCategory for graph)
│   ├── 4.4 Collection: reviews
│   └── 4.5 Cross-collection relationships for $lookup

├── 5. MongoDB aggregation concepts (theory)
│   ├── 5.1 Pipeline mental model
│   ├── 5.2 $match — filter early                      [Diagram D16]
│   ├── 5.3 $group — aggregations
│   ├── 5.4 $lookup — joins across collections
│   ├── 5.5 $unwind — array to documents
│   ├── 5.6 $facet — multiple reports in one query
│   ├── 5.7 $graphLookup — hierarchies
│   └── 5.8 Pipeline optimization habits

├── 6. Implemented analytics APIs
│   ├── 6.1 Overview table                            [Diagram D6]
│   ├── 6.2 Enriched orders ($match → $lookup → $project)   [D7, S1]
│   ├── 6.3 Product rating summary ($lookup → $unwind → $group) [D8]
│   ├── 6.4 Payment revenue by status ($match → $group)
│   ├── 6.5 User commerce profile (dual pipeline)       [S4]
│   ├── 6.6 Dashboard facet ($facet)                   [D9, S5]
│   ├── 6.7 Category hierarchy ($graphLookup)          [D10, S6]
│   └── 6.8 Meta and optimization endpoints

├── 7. Raw pipeline executor
│   ├── 7.1 Why expose native stage JSON
│   ├── 7.2 POST /api/analytics/pipeline/execute        [D11, S2]
│   ├── 7.3 GET /api/analytics/pipeline/examples
│   ├── 7.4 Validation and guardrails
│   └── 7.5 mongosh / Compass equivalence

├── 8. Spring Boot implementation notes
│   ├── 8.1 MongoTemplate vs Spring Data aggregations
│   ├── 8.2 Document lifecycle callbacks
│   ├── 8.3 DTO mapping from BSON Document
│   └── 8.4 Error handling (AnalyticsExceptionAdvisor)

├── 9. Observability and operations
│   ├── 9.1 Actuator and Prometheus                     [D12]
│   ├── 9.2 Pipeline duration metrics
│   ├── 9.3 Logging
│   └── 9.4 Running locally (startup order)

├── 10. Load testing
│   ├── 10.1 k6 setup and run-test.sh
│   ├── 10.2 Scenario mix                              [D13, S12]
│   ├── 10.3 Thresholds and reports
│   └── 10.4 Interpreting results when DB is empty

├── 11. Domain service CRUD (supporting layer)
│   ├── 11.1 Order state machine                        [D14, S11]
│   ├── 11.2 Seeding data for meaningful aggregations  [S3]
│   └── 11.3 Gateway-routed CRUD paths

├── 12. Failure scenarios
│   ├── 12.1 Invalid pipeline / collection              [S9]
│   ├── 12.2 Empty or sparse data                       [S10]
│   └── 12.3 High latency under load

├── 13. Project expectations checklist
│   ├── 13.1 What is complete (project.md mapping)
│   └── 13.2 Suggested next steps

├── 14. Conclusion
│   ├── 14.1 Key takeaways
│   └── 14.2 Repository links (project.md, aggregation-endpoints.txt)

└── Appendix
    ├── A. Full endpoint list (from aggregation-endpoints.txt)
    ├── B. Sample curl commands
    ├── C. Sample mongosh scripts
    ├── D. Diagram index (D1–D17)
    └── E. Sequence diagram index (S1–S12)
```
