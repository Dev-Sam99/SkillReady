Q: How does C# / .NET Garbage Collection (GC) work, and what are Generations 0, 1, and 2?
A: .NET GC is an automatic memory manager operating on the Managed Heap. It divides memory into **Generations** to optimize collection times:

- **Gen 0 (Short-Lived):** Newly allocated objects (local variables, temporary strings). Collected frequently and quickly.
- **Gen 1 (Buffer):** Serves as a buffer between short-lived and long-lived objects. Objects surviving Gen 0 collection move to Gen 1.
- **Gen 2 (Long-Lived):** Static variables, application-scoped objects, singleton services. Collection is expensive (Full GC).
- **LOH (Large Object Heap):** Objects > 85,000 bytes. Avoids expensive compaction by allocating directly on LOH.

---
Q: Explain Dependency Injection Lifetimes in ASP.NET Core (`Transient`, `Scoped`, `Singleton`).
A:
- **`Transient` (`AddTransient`):** Created EVERY TIME they are requested. Ideal for lightweight, stateless services.
- **`Scoped` (`AddScoped`):** Created ONCE PER HTTP REQUEST scope. Ideal for Entity Framework DbContexts, web session contexts.
- **`Singleton` (`AddSingleton`):** Created ONCE on first request and shared application-wide across all requests. Ideal for caching, configuration settings.

**Captive Dependency Trap:** Injecting a Scoped service (`DbContext`) into a Singleton service creates a memory leak or concurrency thread-safety issue!
---
Q: What is Async/Await under the hood in C# (`Task`, `ValueTask`, State Machine)?
A: When a method is marked `async`, the C# compiler generates an implicit **State Machine** (struct implementing `IAsyncStateMachine`).

- When `await` is encountered on an incomplete task, the state machine captures current SynchronizationContext, yields execution back to caller, and registers a continuation.
- **`Task`:** Allocates a heap object representing async work.
- **`ValueTask`:** High-performance value type (struct) allocation avoiding heap allocations when async methods complete synchronously (e.g. cached hits).

```csharp
public async ValueTask<UserDto> GetUserAsync(int userId)
{
    if (_cache.TryGetValue(userId, out var cachedUser))
    {
        return cachedUser; // No Heap Task allocation!
    }
    return await _dbRepository.FetchUserAsync(userId);
}
```
---
Q: Explain Entity Framework Core (EF Core) Change Tracker, `AsNoTracking()`, and N+1 Query Problem.
A:
- **Change Tracker:** EF Core tracks entity states (`Added`, `Modified`, `Deleted`, `Unchanged`) to build `UPDATE`/`INSERT` SQL statements on `SaveChangesAsync()`.
- **`AsNoTracking()`:** Disables entity tracking for READ-ONLY queries. Improves performance by 30-50% and reduces memory footprint.
- **N+1 Problem:** Occurs when executing 1 initial query for parent entities, followed by N subsequent database queries for each child record in a loop (`IEnumerable` lazy loading). Fix using **Eager Loading (`.Include()`)** or **Explicit Projection (`.Select()`)**.

```csharp
// Optimized EF Core Query
var orders = await _context.Orders
    .AsNoTracking()
    .Where(o => o.Status == OrderStatus.Completed)
    .Select(o => new OrderDto {
        Id = o.Id,
        CustomerName = o.Customer.Name // Single JOIN generated!
    })
    .ToListAsync();
```
---
Q: What is the ASP.NET Core Middleware Pipeline and how does `Use` vs `Run` vs `Map` work?
A: Middleware handles HTTP requests and responses sequentially in a pipeline execution chain.

- **`app.Use(...)`:** Executes logic and calls `next()` to pass control to the next middleware in the chain.
- **`app.Run(...)`:** Short-circuits the pipeline (terminating middleware; does NOT call `next()`).
- **`app.Map(...)`:** Branches the pipeline based on request path matching (e.g. `/api/health`).

```csharp
app.Use(async (context, next) =>
{
    var timer = Stopwatch.StartNew();
    await next(); // Pass to next middleware
    timer.Stop();
    logger.LogInformation("Request took {Ms}ms", timer.ElapsedMilliseconds);
});
```
