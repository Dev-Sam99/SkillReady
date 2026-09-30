Q: Tell me about a time you had a major technical disagreement with a Senior Architect or Teammate. How did you resolve it?
A: **Situation:** During a core architecture overhaul of our payment checkout service, the Principal Architect wanted to migrate from a monolithic SQL setup directly to microservices with Event Sourcing using Kafka. Having analyzed our transaction volume and team size, I believed adding Kafka would introduce excessive operational overhead and potential eventual consistency issues for real-time payments.

**Action:**
1. Avoided emotional debate during team syncs. Instead, I gathered empirical benchmark data and created a POC comparing latency, setup complexity, and failure-recovery scenarios between a Modular Monolith with Postgres vs Kafka Microservices.
2. Scheduled a 1-on-1 architecture review where I presented the SLA risks and timeline impacts.
3. Proposed a phased compromise: Start with a clean Modular Monolith using Outbox Pattern for eventual event streaming, migrating to true microservices only when traffic throughput demanded it.

**Result:** The team adopted the Modular Monolith approach. We launched 3 weeks ahead of deadline with zero downtime and saved an estimated $4,000/month in cloud infrastructure costs.
---
Q: Describe a scenario where a critical Production Outage occurred. How did you diagnose and fix it?
A: **Situation:** On a Friday afternoon, API response times spiked from 80ms to over 15,000ms, resulting in cascading HTTP 504 Gateway Timeouts during peak user activity.

**Action:**
1. Immediately declared a Sev-1 incident, alerted stakeholders, and joined the war room.
2. Checked APM logs (Datadog/Grafana) and traced the spike to a newly deployed feature query that executed an un-indexed SQL join across 2 million customer orders.
3. Executed an immediate rollback to the previous stable release container image within 4 minutes to restore SLA.
4. Analyzed post-mortem: Wrote a migration adding a composite B-Tree index on `(customer_id, created_at DESC)` and added automated query execution plan checks in CI/CD pipeline.

**Result:** Service returned to 100% health in under 6 minutes total MTTR (Mean Time To Recovery).
---
Q: How do you handle Scope Creep and tight deadlines when product managers add last-minute feature requests?
A: **Approach:**
1. Acknowledge the business value of the new request without giving an immediate "yes" or "no".
2. Assess technical impact on velocity: Calculate additional story points, risk profile, and testing overhead.
3. Present trade-offs transparently to the PM: *"We can add Feature X for this sprint, BUT we will need to defer Feature Y to Sprint 12, OR cut non-critical animations from the MVP to meet the release date."*
4. Ensure alignment is documented in Jira/linear ticket backlogs before proceeding.
---
Q: Describe how you mentor junior developers and foster code quality on your engineering team.
A:
1. **Constructive Code Reviews:** Avoid subjective style arguments. Use automated linters/Prettier for formatting, and focus PR reviews on architecture, performance, edge cases, and security.
2. **Pair Programming:** Host bi-weekly pair debugging sessions to walk through complex async patterns or state management.
3. **Internal Documentation & Tech Talks:** Encourage writing ADRs (Architecture Decision Records) and hosting 15-minute knowledge-share talks after solving difficult technical problems.
