Q: How do B-Tree Indexes work in SQL databases, and why can over-indexing harm performance?
A: **B-Tree (Balanced Tree) Indexes** store data in a self-balancing tree structure where lookup, insertion, and deletion operations run in $O(\log N)$ time.

- Leaf nodes contain the indexed column values and pointers (RID / Primary Key) to actual table rows.
- Index lookup traverses root -> branch -> leaf, avoiding full table scans.

**Why Over-indexing harms performance:**
1. **Slower `INSERT`/`UPDATE`/`DELETE` writes:** Every write operation forces the database engine to update multiple B-Tree index structures synchronously.
2. **Memory Footprint:** Indexes consume RAM (Buffer Pool) and disk space.
3. **Query Optimizer Overhead:** Too many indexes confuse the SQL Optimizer when picking execution plans.

---
Q: What are SQL Window Functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`)?
A: **Window Functions** perform calculations across a set of table rows related to the current row WITHOUT collapsing rows into a single summary output (unlike `GROUP BY`).

- **`ROW_NUMBER()`:** Assigns sequential integer (1, 2, 3, 4).
- **`RANK()`:** Assigns rank with gaps for ties (1, 2, 2, 4).
- **`DENSE_RANK()`:** Assigns rank without gaps for ties (1, 2, 2, 3).
- **`LAG()` / `LEAD()`:** Accesses data from a previous or subsequent row without self-joins.

```sql
SELECT 
    employee_id,
    department_id,
    salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank
FROM employees;
```
---
Q: Explain Database Normalization (1NF, 2NF, 3NF, BCNF) vs De-normalization.
A:
- **1NF (First Normal Form):** Atomic values (no repeating groups/arrays in single cell).
- **2NF:** Must be in 1NF + All non-key attributes must depend on the WHOLE primary key (eliminates partial dependencies).
- **3NF:** Must be in 2NF + No transitive dependencies (non-key columns must NOT depend on other non-key columns).

**De-normalization:** Intentionally adding redundant data or pre-calculated aggregates to a 3NF database to reduce costly multi-table JOINs in high-read OLAP data warehouses.
---
Q: What are ACID Properties in Relational Databases?
A:
- **Atomicity:** All statements in a transaction succeed together, or all roll back completely (All or Nothing).
- **Consistency:** Database transitions valid state to valid state (enforces schema constraints, foreign keys).
- **Isolation:** Concurrent transactions execute without interfering with each other.
- **Durability:** Once committed, transaction data is written to non-volatile storage (WAL / Redo Logs) and survives system crashes.
---
Q: Explain SQL Transaction Isolation Levels and concurrency side-effects.
A: Concurrency Side-Effects:
- **Dirty Read:** Reading uncommitted data written by another transaction.
- **Non-Repeatable Read:** Re-reading same row yields different data due to another committed transaction.
- **Phantom Read:** Re-executing query returns new rows inserted by another transaction.

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|---|---|---|---|
| Read Uncommitted | Allowed | Allowed | Allowed |
| Read Committed (Default Postgres/SQL Server) | Prevented | Allowed | Allowed |
| Repeatable Read | Prevented | Prevented | Allowed |
| Serializable | Prevented | Prevented | Prevented |
