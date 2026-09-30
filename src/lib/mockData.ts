import type { Question, Topic } from '@/types';

export const MOCK_TOPICS: Topic[] = [
  {
    "id": "topic-01",
    "name": "Angular"
  },
  {
    "id": "topic-02",
    "name": "Behavioral Questions"
  },
  {
    "id": "topic-03",
    "name": "CSS"
  },
  {
    "id": "topic-04",
    "name": ".NET Framework & Core"
  },
  {
    "id": "topic-05",
    "name": "Git & Version Control"
  },
  {
    "id": "topic-06",
    "name": "JavaScript"
  },
  {
    "id": "topic-07",
    "name": "React"
  },
  {
    "id": "topic-08",
    "name": "SQL & Databases"
  },
  {
    "id": "topic-09",
    "name": "TypeScript"
  },
  {
    "id": "topic-10",
    "name": "Unit Testing (Angular/Jasmine)"
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    "id": "q-01-01",
    "topic_id": "topic-01",
    "question": "How does Angular's Change Detection mechanism work under the hood, and how do you optimize it with OnPush?",
    "answer": "Angular uses `zone.js` to monkey-patch asynchronous browser APIs (XHR, setTimeout, DOM events). When an async event fires, `zone.js` triggers change detection top-down from the root component. \n\nIn a 5+ YOE production app, default change detection (`ChangeDetectionStrategy.Default`) checks every component on every tick, causing severe performance drops in heavy UIs. \n\nTo optimize:\n1. Use `ChangeDetectionStrategy.OnPush`: Component is checked ONLY when an `@Input()` reference changes, an event originates from component/children, or manually triggered via `ChangeDetectorRef.markForCheck()`.\n2. Use Immutable Data patterns (RxJS `BehaviorSubject` or Signals).\n\n```typescript\n@Component({\n  selector: 'app-user-profile',\n  template: `<div>{{ user().name }}</div>`,\n  changeDetection: ChangeDetectionStrategy.OnPush\n})\nexport class UserProfileComponent {\n  user = input.required<User>(); // Using modern Signals input\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-02",
    "topic_id": "topic-01",
    "question": "What is the difference between Angular Signals and RxJS Observables, and when should you use each?",
    "answer": "**Signals** (introduced in Angular 16+) provide fine-grained reactivity. They track dependencies automatically without subscription overhead or memory leak risks, and operate synchronously.\n\n**RxJS Observables** represent async data streams over time (HTTP requests, WebSockets, complex event compositions).\n\n**Senior Recommendation:** Use Signals for UI state, computed properties, and local component reactivity. Use RxJS for asynchronous streams, cancellation (`switchMap`), debounce (`debounceTime`), or retry mechanisms.\n\n```typescript\n// Signals for synchronous UI state\nconst count = signal(0);\nconst doubleCount = computed(() => count() * 2);\n\n// RxJS for async HTTP & debouncing search inputs\nthis.searchControl.valueChanges.pipe(\n  debounceTime(300),\n  distinctUntilChanged(),\n  switchMap(term => this.userService.search(term))\n).subscribe(results => this.results.set(results));\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-03",
    "topic_id": "topic-01",
    "question": "How do you handle Memory Leaks caused by RxJS Subscriptions in Angular?",
    "answer": "In long-lived SPA applications, failing to unsubscribe from infinite Observables (e.g. `interval`, route parameters, global stores) causes memory leaks.\n\n**Solutions for 5+ YOE Developers:**\n1. **Prefer Async Pipe (`| async`):** Handles subscription & unsubscription automatically in template.\n2. **`takeUntilDestroyed` (Angular 16+):** Automatically unsubscribes when the injection context (Component/Service) is destroyed.\n3. **`DestroyRef` or `takeUntil(this.destroy$)`:** For legacy components.\n\n```typescript\n@Component({...})\nexport class DataFeedComponent implements OnInit {\n  private destroyRef = inject(DestroyRef);\n  private dataService = inject(DataService);\n\n  ngOnInit() {\n    this.dataService.stream$\n      .pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe(data => this.processData(data));\n  }\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-04",
    "topic_id": "topic-01",
    "question": "How does Angular's Dependency Injection (DI) Hierarchical Injector work?",
    "answer": "Angular DI has two main injector hierarchies:\n1. **ElementInjector Hierarchy:** Created at DOM nodes (Components/Directives).\n2. **EnvironmentInjector Hierarchy:** Configured at route levels or root (`providedIn: 'root'`).\n\nWhen a component requests a dependency, Angular searches locally in its `ElementInjector`. If not found, it bubbles up component parents, then switches to the `EnvironmentInjector` up to the Root.\n\n**Real-world scenario:** Providing a service in `@Component({ providers: [FeatureService] })` creates a unique instance for *that component subtree*, useful for tab-isolated form states.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-05",
    "topic_id": "topic-01",
    "question": "What are Standalone Components and how do they change Angular architecture?",
    "answer": "Introduced in Angular 14+, Standalone components eliminate `NgModule` boilerplate. Components, directives, and pipes declare their own dependencies directly via `imports: [...]`.\n\n**Benefits:**\n- Simplifies lazy loading via `loadComponent: () => import(...)`.\n- Enables modular domain-driven architecture.\n- Improves build times and tree-shaking efficiency.\n\n```typescript\n@Component({\n  standalone: true,\n  selector: 'app-dashboard',\n  imports: [CommonModule, UserListComponent, ReactiveFormsModule],\n  templateUrl: './dashboard.component.html'\n})\nexport class DashboardComponent {}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-06",
    "topic_id": "topic-01",
    "question": "How do custom HttpInterceptors work in modern Standalone Angular?",
    "answer": "HttpInterceptors intercept and transform outgoing HTTP requests and incoming HTTP responses globally (e.g. attaching Bearer tokens, refresh token logic, global error logging).\n\nIn modern Angular (15+), functional interceptors (`HttpInterceptorFn`) are preferred over class-based interceptors.\n\n```typescript\nexport const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const authService = inject(AuthService);\n  const token = authService.getToken();\n\n  const authReq = token \n    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })\n    : req;\n\n  return next(authReq).pipe(\n    catchError((error: HttpErrorResponse) => {\n      if (error.status === 401) authService.refreshTokenAndRetry(req);\n      return throwError(() => error);\n    })\n  );\n};\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-07",
    "topic_id": "topic-01",
    "question": "Explain Angular Router Resolvers vs Route Guards.",
    "answer": "**Route Guards (`CanActivateFn`, `CanDeactivateFn`):** Control route navigation permissions (Auth checks, role RBAC, preventing unsaved form loss). They evaluate to boolean or `UrlTree`.\n\n**Route Resolvers (`ResolveFn`):** Fetch necessary data BEFORE navigation completes. The router waits for the resolver to emit before rendering the target component, avoiding partial UI layout shifts.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-08",
    "topic_id": "topic-01",
    "question": "What is the ContentProjection (`ng-content`) pattern and Multi-slot projection?",
    "answer": "Content projection allows passing custom HTML or components into a child component's layout (similar to React `children`).\n\n**Multi-slot projection:** Uses `select=\"[slot-name]\"` attribute selectors.\n\n```html\n<!-- Card Component Template -->\n<div className=\"card-header\">\n  <ng-content select=\"[card-title]\"></ng-content>\n</div>\n<div className=\"card-body\">\n  <ng-content></ng-content>\n</div>\n\n<!-- Usage -->\n<app-card>\n  <h2 card-title>Analytics Overview</h2>\n  <p>Main content area...</p>\n</app-card>\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-09",
    "topic_id": "topic-01",
    "question": "How do you optimize large-scale Angular applications for initial load time?",
    "answer": "1. **Lazy Loading Routes:** Split bundles by feature modules (`loadChildren` / `loadComponent`).\n2. **Deferrable Views (`@defer`):** Angular 17+ feature to defer loading expensive components until visible in viewport or interaction (`on viewport`, `on hover`).\n3. **Preloading Strategies:** Use `PreloadAllModules` or custom network-aware preloading.\n4. **OnPush & Signals:** Reduces runtime JS execution overhead.\n5. **Optimize Assets & Fonts:** Inline critical CSS and use WebP/AVIF images.\n\n```html\n@defer (on viewport) {\n  <app-heavy-chart [data]=\"chartData()\" />\n} @placeholder {\n  <div class=\"skeleton-loader\">Loading Chart...</div>\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-01-10",
    "topic_id": "topic-01",
    "question": "Explain ViewChild, ViewChildren, ContentChild, and ContentChildren.",
    "answer": "- **`ViewChild` / `ViewChildren`:** Access elements/components declared within the component's OWN template (`ngAfterViewInit`).\n- **`ContentChild` / `ContentChildren`:** Access elements projected into the component via `<ng-content>` (`ngAfterContentInit`).\n\nIn Angular 17.2+, Signal queries (`viewChild()`, `contentChild()`) replace decorators for cleaner type safety.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-02-01",
    "topic_id": "topic-02",
    "question": "Tell me about a time you had a major technical disagreement with a Senior Architect or Teammate. How did you resolve it?",
    "answer": "**Situation:** During a core architecture overhaul of our payment checkout service, the Principal Architect wanted to migrate from a monolithic SQL setup directly to microservices with Event Sourcing using Kafka. Having analyzed our transaction volume and team size, I believed adding Kafka would introduce excessive operational overhead and potential eventual consistency issues for real-time payments.\n\n**Action:**\n1. Avoided emotional debate during team syncs. Instead, I gathered empirical benchmark data and created a POC comparing latency, setup complexity, and failure-recovery scenarios between a Modular Monolith with Postgres vs Kafka Microservices.\n2. Scheduled a 1-on-1 architecture review where I presented the SLA risks and timeline impacts.\n3. Proposed a phased compromise: Start with a clean Modular Monolith using Outbox Pattern for eventual event streaming, migrating to true microservices only when traffic throughput demanded it.\n\n**Result:** The team adopted the Modular Monolith approach. We launched 3 weeks ahead of deadline with zero downtime and saved an estimated $4,000/month in cloud infrastructure costs.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-02-02",
    "topic_id": "topic-02",
    "question": "Describe a scenario where a critical Production Outage occurred. How did you diagnose and fix it?",
    "answer": "**Situation:** On a Friday afternoon, API response times spiked from 80ms to over 15,000ms, resulting in cascading HTTP 504 Gateway Timeouts during peak user activity.\n\n**Action:**\n1. Immediately declared a Sev-1 incident, alerted stakeholders, and joined the war room.\n2. Checked APM logs (Datadog/Grafana) and traced the spike to a newly deployed feature query that executed an un-indexed SQL join across 2 million customer orders.\n3. Executed an immediate rollback to the previous stable release container image within 4 minutes to restore SLA.\n4. Analyzed post-mortem: Wrote a migration adding a composite B-Tree index on `(customer_id, created_at DESC)` and added automated query execution plan checks in CI/CD pipeline.\n\n**Result:** Service returned to 100% health in under 6 minutes total MTTR (Mean Time To Recovery).",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-02-03",
    "topic_id": "topic-02",
    "question": "How do you handle Scope Creep and tight deadlines when product managers add last-minute feature requests?",
    "answer": "**Approach:**\n1. Acknowledge the business value of the new request without giving an immediate \"yes\" or \"no\".\n2. Assess technical impact on velocity: Calculate additional story points, risk profile, and testing overhead.\n3. Present trade-offs transparently to the PM: *\"We can add Feature X for this sprint, BUT we will need to defer Feature Y to Sprint 12, OR cut non-critical animations from the MVP to meet the release date.\"*\n4. Ensure alignment is documented in Jira/linear ticket backlogs before proceeding.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-02-04",
    "topic_id": "topic-02",
    "question": "Describe how you mentor junior developers and foster code quality on your engineering team.",
    "answer": "1. **Constructive Code Reviews:** Avoid subjective style arguments. Use automated linters/Prettier for formatting, and focus PR reviews on architecture, performance, edge cases, and security.\n2. **Pair Programming:** Host bi-weekly pair debugging sessions to walk through complex async patterns or state management.\n3. **Internal Documentation & Tech Talks:** Encourage writing ADRs (Architecture Decision Records) and hosting 15-minute knowledge-share talks after solving difficult technical problems.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-03-01",
    "topic_id": "topic-03",
    "question": "How does the CSS Box Model work, and what is the difference between `content-box` and `border-box`?",
    "answer": "The **CSS Box Model** consists of four layers surrounding every HTML element: **Content ➔ Padding ➔ Border ➔ Margin**.\n\n- **`box-sizing: content-box` (Default):** `width` applies ONLY to the content. Total element width = `width + padding-left + padding-right + border-left + border-right`. Causes layout calculations to break easily!\n- **`box-sizing: border-box` (Recommended):** `width` includes content, padding, AND border. Element stays at declared width regardless of padding/border.\n\n```css\n/* Modern CSS Reset Rule */\n*, *::before, *::after {\n  box-sizing: border-box;\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-03-02",
    "topic_id": "topic-03",
    "question": "Explain CSS Flexbox vs CSS Grid and when to use each.",
    "answer": "- **CSS Flexbox (1D Layout):** Designed for layouts in a single direction (row OR column). Ideal for navigation bars, alignment, pill buttons, centered items.\n- **CSS Grid (2D Layout):** Designed for 2D layouts using rows AND columns simultaneously. Ideal for full page layouts, dashboard grid cards, complex image galleries.\n\n```css\n/* Responsive Grid layout without media queries */\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-03-03",
    "topic_id": "topic-03",
    "question": "Explain CSS Specificity Hierarchy and how Specificity scores are calculated.",
    "answer": "Specificity determines which CSS rule applies when multiple selectors match an element. Calculated as `(Inline, IDs, Classes/Attributes/Pseudo-classes, Elements)`:\n\n1. **Inline styles (`style=\"...\"`):** Score `(1, 0, 0, 0)`\n2. **IDs (`#header`):** Score `(0, 1, 0, 0)`\n3. **Classes, attributes, pseudo-classes (`.btn`, `[type=\"text\"]`, `:hover`):** Score `(0, 0, 1, 0)`\n4. **Elements & pseudo-elements (`div`, `p`, `::before`):** Score `(0, 0, 0, 1)`\n\n*Note:* `!important` overrides normal specificity rules, but overuse leads to unmaintainable CSS.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-03-04",
    "topic_id": "topic-03",
    "question": "What are BEM naming conventions in CSS and why do they improve maintainability?",
    "answer": "**BEM (Block, Element, Modifier)** provides clean namespace modularity:\n- `Block`: Standalone component (`.card`)\n- `Element`: Child element dependent on block (`.card__title`, `.card__button`)\n- `Modifier`: Variant or state of block/element (`.card--dark`, `.card__button--disabled`)\n\nPrevents specificity wars and style leakage in large enterprise codebases.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-04-01",
    "topic_id": "topic-04",
    "question": "How does C# / .NET Garbage Collection (GC) work, and what are Generations 0, 1, and 2?",
    "answer": ".NET GC is an automatic memory manager operating on the Managed Heap. It divides memory into **Generations** to optimize collection times:\n\n- **Gen 0 (Short-Lived):** Newly allocated objects (local variables, temporary strings). Collected frequently and quickly.\n- **Gen 1 (Buffer):** Serves as a buffer between short-lived and long-lived objects. Objects surviving Gen 0 collection move to Gen 1.\n- **Gen 2 (Long-Lived):** Static variables, application-scoped objects, singleton services. Collection is expensive (Full GC).\n- **LOH (Large Object Heap):** Objects > 85,000 bytes. Avoids expensive compaction by allocating directly on LOH.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-04-02",
    "topic_id": "topic-04",
    "question": "Explain Dependency Injection Lifetimes in ASP.NET Core (`Transient`, `Scoped`, `Singleton`).",
    "answer": "- **`Transient` (`AddTransient`):** Created EVERY TIME they are requested. Ideal for lightweight, stateless services.\n- **`Scoped` (`AddScoped`):** Created ONCE PER HTTP REQUEST scope. Ideal for Entity Framework DbContexts, web session contexts.\n- **`Singleton` (`AddSingleton`):** Created ONCE on first request and shared application-wide across all requests. Ideal for caching, configuration settings.\n\n**Captive Dependency Trap:** Injecting a Scoped service (`DbContext`) into a Singleton service creates a memory leak or concurrency thread-safety issue!",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-04-03",
    "topic_id": "topic-04",
    "question": "What is Async/Await under the hood in C# (`Task`, `ValueTask`, State Machine)?",
    "answer": "When a method is marked `async`, the C# compiler generates an implicit **State Machine** (struct implementing `IAsyncStateMachine`).\n\n- When `await` is encountered on an incomplete task, the state machine captures current SynchronizationContext, yields execution back to caller, and registers a continuation.\n- **`Task`:** Allocates a heap object representing async work.\n- **`ValueTask`:** High-performance value type (struct) allocation avoiding heap allocations when async methods complete synchronously (e.g. cached hits).\n\n```csharp\npublic async ValueTask<UserDto> GetUserAsync(int userId)\n{\n    if (_cache.TryGetValue(userId, out var cachedUser))\n    {\n        return cachedUser; // No Heap Task allocation!\n    }\n    return await _dbRepository.FetchUserAsync(userId);\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-04-04",
    "topic_id": "topic-04",
    "question": "Explain Entity Framework Core (EF Core) Change Tracker, `AsNoTracking()`, and N+1 Query Problem.",
    "answer": "- **Change Tracker:** EF Core tracks entity states (`Added`, `Modified`, `Deleted`, `Unchanged`) to build `UPDATE`/`INSERT` SQL statements on `SaveChangesAsync()`.\n- **`AsNoTracking()`:** Disables entity tracking for READ-ONLY queries. Improves performance by 30-50% and reduces memory footprint.\n- **N+1 Problem:** Occurs when executing 1 initial query for parent entities, followed by N subsequent database queries for each child record in a loop (`IEnumerable` lazy loading). Fix using **Eager Loading (`.Include()`)** or **Explicit Projection (`.Select()`)**.\n\n```csharp\n// Optimized EF Core Query\nvar orders = await _context.Orders\n    .AsNoTracking()\n    .Where(o => o.Status == OrderStatus.Completed)\n    .Select(o => new OrderDto {\n        Id = o.Id,\n        CustomerName = o.Customer.Name // Single JOIN generated!\n    })\n    .ToListAsync();\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-04-05",
    "topic_id": "topic-04",
    "question": "What is the ASP.NET Core Middleware Pipeline and how does `Use` vs `Run` vs `Map` work?",
    "answer": "Middleware handles HTTP requests and responses sequentially in a pipeline execution chain.\n\n- **`app.Use(...)`:** Executes logic and calls `next()` to pass control to the next middleware in the chain.\n- **`app.Run(...)`:** Short-circuits the pipeline (terminating middleware; does NOT call `next()`).\n- **`app.Map(...)`:** Branches the pipeline based on request path matching (e.g. `/api/health`).\n\n```csharp\napp.Use(async (context, next) =>\n{\n    var timer = Stopwatch.StartNew();\n    await next(); // Pass to next middleware\n    timer.Stop();\n    logger.LogInformation(\"Request took {Ms}ms\", timer.ElapsedMilliseconds);\n});\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-05-01",
    "topic_id": "topic-05",
    "question": "Explain `git rebase` vs `git merge` and when to use each in a production team workflow.",
    "answer": "- **`git merge`:** Creates a new **Merge Commit** combining two branch histories. Preserves exact history and branch timelines, but can pollute git log with multiple merge commits.\n- **`git rebase`:** Re-applies commits from your feature branch on top of the target branch, creating a clean linear git history without extra merge commits. Rewrites commit hashes!\n\n**Golden Rule:** NEVER rebase shared public/main branches. Rebase feature branches locally before merging into `main`.\n\n```bash\n# Rebase feature branch onto latest main\ngit checkout feature/user-auth\ngit fetch origin\ngit rebase origin/main\n\n# If conflicts occur, resolve files then:\ngit add .\ngit rebase --continue\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-05-02",
    "topic_id": "topic-05",
    "question": "How do you recover a deleted branch or lost commits using `git reflog`?",
    "answer": "`git reflog` tracks every reference update (commit, checkout, rebase, reset) made in your local repository, even if commits were detached or branches deleted.\n\n**Recovery Steps:**\n1. Run `git reflog` to find the HEAD commit hash prior to deletion (e.g. `HEAD@{4}`).\n2. Restore branch: `git checkout -b recovered-branch HEAD@{4}`.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-05-03",
    "topic_id": "topic-05",
    "question": "What is `git cherry-pick` and when should you use it?",
    "answer": "`git cherry-pick <commit-hash>` applies a specific commit from another branch onto your current branch without merging the entire branch.\n\n**Use Case:** Hotfixing a production issue by picking a single bugfix commit from a `dev` or `feature` branch into `release` or `main`.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-05-04",
    "topic_id": "topic-05",
    "question": "Explain `git reset --soft` vs `git reset --mixed` vs `git reset --hard`.",
    "answer": "- **`--soft`:** Moves `HEAD` pointer back. Leaves changes staged in **Index / Staging Area**. No work lost.\n- **`--mixed` (Default):** Moves `HEAD` pointer back. Unstages changes into **Working Directory**. No work lost.\n- **`--hard`:** Moves `HEAD` pointer back AND discards all uncommitted working directory & staging changes. Destructive!",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-05-05",
    "topic_id": "topic-05",
    "question": "How does `git bisect` work to find which commit introduced a bug?",
    "answer": "`git bisect` uses Binary Search across commit history to isolate the exact commit that broke the build:\n\n```bash\ngit bisect start\ngit bisect bad                 # Current commit is broken\ngit bisect good v1.2.0         # Last known working commit/tag\n\n# Git checks out midpoint commit automatically. Test app, then run:\ngit bisect good # OR git bisect bad\n\n# Once identified, finish with:\ngit bisect reset\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-01",
    "topic_id": "topic-06",
    "question": "Explain JavaScript Event Loop, Microtask Queue, and Macrotask Queue with an execution order example.",
    "answer": "JavaScript is single-threaded. Async execution is managed via the **Event Loop**, which continuously monitors the Call Stack and task queues.\n\n- **Call Stack:** Executes synchronous JS code line by line.\n- **Microtask Queue:** Holds Promise `.then()` callbacks, `queueMicrotask`, `process.nextTick`, and MutationObserver. Microtasks have HIGHER priority and are drained COMPLETELY before moving to the next task.\n- **Macrotask Queue (Task Queue):** Holds `setTimeout`, `setInterval`, `setImmediate`, and I/O events. Executed ONE per loop iteration after microtask queue is empty.\n\n```javascript\nconsole.log('1');\n\nsetTimeout(() => console.log('2'), 0);\n\nPromise.resolve().then(() => {\n  console.log('3');\n  queueMicrotask(() => console.log('4'));\n});\n\nconsole.log('5');\n\n// Output Order: 1, 5, 3, 4, 2\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-02",
    "topic_id": "topic-06",
    "question": "What is a Closure in JavaScript and what are its practical production use cases?",
    "answer": "A **Closure** is the combination of a function bundled together with references to its lexical environment. A inner function retains access to variables declared in its outer scope even after the outer function has executed.\n\n**Production Use Cases:**\n1. Data Privacy / Encapsulation (Private variables before ES class `#private` fields).\n2. Function Currying & Partial Application.\n3. Memoization & Caching functions.\n4. Custom Event Handlers & State Persistence.\n\n```javascript\nfunction createCounter() {\n  let count = 0; // Private scope variable\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.count); // undefined (Encapsulated)\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-03",
    "topic_id": "topic-06",
    "question": "How does `this` binding work in JavaScript (Default, Implicit, Explicit, Arrow Functions)?",
    "answer": "`this` refers to the object executing the current function, determined at RUNTIME (except arrow functions):\n\n1. **Default Binding:** Global object (`window` or `globalThis`), or `undefined` in strict mode `'use strict'`.\n2. **Implicit Binding:** Object calling the method (`obj.func()` -> `this` is `obj`).\n3. **Explicit Binding:** Using `.call(thisArg, a, b)`, `.apply(thisArg, [a, b])`, or `.bind(thisArg)`.\n4. **Arrow Functions:** Do NOT have their own `this`. They lexically capture `this` from the enclosing scope at creation.\n\n```javascript\nconst user = {\n  name: 'Sam',\n  greetStandard: function() { console.log(this.name); },\n  greetArrow: () => { console.log(this.name); }\n};\n\nuser.greetStandard(); // 'Sam'\nuser.greetArrow(); // undefined (captures outer/global scope)\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-04",
    "topic_id": "topic-06",
    "question": "What are WeakMap and WeakSet, and how do they differ from Map and Set regarding Garbage Collection?",
    "answer": "- **Map / Set:** Hold STRONG references to keys. Keys will NOT be garbage collected even if references elsewhere are deleted, causing memory leaks if not cleaned up manually.\n- **WeakMap / WeakSet:** Hold WEAK references to keys. Keys MUST be objects. If there are no other strong references to a key object, V8 engine garbage collects it automatically.\n\n**Real-world scenario:** Caching metadata for DOM nodes without preventing DOM nodes from being garbage-collected when removed from page.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-05",
    "topic_id": "topic-06",
    "question": "What is Prototype Inheritance and how does the Prototype Chain work?",
    "answer": "Every JavaScript object has an internal `[[Prototype]]` property (accessible via `Object.getPrototypeOf(obj)` or `__proto__`). When accessing a property on an object:\n1. JS engine checks the object itself.\n2. If not found, it checks the object's Prototype.\n3. It recursively moves up the chain until `Object.prototype` (whose prototype is `null`).\n\n```javascript\nfunction Animal(name) {\n  this.name = name;\n}\nAnimal.prototype.speak = function() {\n  return `${this.name} makes a noise.`;\n};\n\nconst dog = new Animal('Rex');\nconsole.log(dog.speak()); // Found on Animal.prototype\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-06",
    "topic_id": "topic-06",
    "question": "Explain `debounce` vs `throttle` functions with code implementation.",
    "answer": "Both optimize high-frequency events (scroll, resize, search input).\n\n- **Debounce:** Delays function execution until after `N` milliseconds have elapsed since the LAST time it was invoked. (Great for auto-complete search inputs).\n- **Throttle:** Ensures function executes at most ONCE per `N` milliseconds window. (Great for window scroll / resize handlers).\n\n```javascript\n// Debounce Implementation\nfunction debounce(fn, delay) {\n  let timerId;\n  return function(...args) {\n    clearTimeout(timerId);\n    timerId = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Throttle Implementation\nfunction throttle(fn, limit) {\n  let inThrottle = false;\n  return function(...args) {\n    if (!inThrottle) {\n      fn.apply(this, args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  };\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-07",
    "topic_id": "topic-06",
    "question": "What is JavaScript Memory Management and how does V8 Garbage Collection (Mark-and-Sweep) work?",
    "answer": "Memory is allocated in the **Stack** (primitive values & function execution frames) and **Heap** (objects, functions, closures).\n\nV8 uses **Generational Garbage Collection**:\n1. **Scavenger (Young Generation):** Fast collection for short-lived objects using Cheney's copying algorithm.\n2. **Mark-and-Sweep (Old Generation):**\n   - **Mark:** Walks object graph starting from roots (global window, stack variables) and marks reachable objects.\n   - **Sweep:** Reclaims un-marked (unreachable) memory addresses.\n   - **Compact:** Defragments heap space.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-08",
    "topic_id": "topic-06",
    "question": "What are JavaScript Generators and Iterators (`function*` and `yield`)?",
    "answer": "Generators are special functions that can pause execution midway and resume later, maintaining state.\n- Declared with `function*`.\n- Use `yield` keyword to return intermediate values.\n- Returns an Iterator object with `.next()` method emitting `{ value, done }`.\n\n```javascript\nfunction* idGenerator() {\n  let id = 1;\n  while (true) {\n    yield id++;\n  }\n}\n\nconst gen = idGenerator();\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-09",
    "topic_id": "topic-06",
    "question": "Explain Shallow Copy vs Deep Copy in JavaScript and safe deep cloning techniques.",
    "answer": "- **Shallow Copy:** Copies primitive values, but object/array references still point to the same memory addresses (`Object.assign()`, Spread operator `{...obj}`).\n- **Deep Copy:** Recursively duplicates all nested objects/arrays creating independent memory copies.\n\n**Deep Clone Methods:**\n1. **`structuredClone(obj)`:** Modern native Web API (Handles Maps, Sets, Date, RegExp, ArrayBuffers).\n2. **`JSON.parse(JSON.stringify(obj))`:** Quick hack, BUT fails on `undefined`, functions, Symbols, circular references, and Date objects.\n\n```javascript\nconst original = { a: 1, b: { c: 2 } };\nconst deepCloned = structuredClone(original);\ndeepCloned.b.c = 99;\nconsole.log(original.b.c); // 2 (Original unchanged)\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-06-10",
    "topic_id": "topic-06",
    "question": "What is Event Delegation and why is it important for web performance?",
    "answer": "**Event Delegation** is a technique of attaching a single event listener to a parent element instead of attaching multiple listeners to individual child elements. It leverages **Event Bubbling** (events firing on child nodes bubble up through DOM ancestors).\n\n**Benefits:**\n- Drastically reduces memory usage (1 listener vs 1000 listeners).\n- Dynamically handles newly added child DOM elements without re-attaching event listeners.\n\n```javascript\ndocument.getElementById('user-list').addEventListener('click', (event) => {\n  const target = event.target;\n  if (target.matches('button.delete-user')) {\n    const userId = target.dataset.id;\n    deleteUser(userId);\n  }\n});\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-07-01",
    "topic_id": "topic-07",
    "question": "How does React Virtual DOM and Reconciliation Algorithm (Fiber) work under the hood?",
    "answer": "**Virtual DOM (VDOM)** is a lightweight in-memory JSON representation of the real DOM. When component state changes:\n1. React creates a new VDOM tree.\n2. **Diffing Algorithm (Heuristic O(N)):** React compares the new VDOM tree with the previous VDOM tree.\n   - Elements of different types produce different trees (destroys & rebuilds subtree).\n   - `key` props identify dynamic list elements to preserve DOM node identity across re-renders.\n3. **Reconciliation (React Fiber):** Fiber breaks rendering work into small units (fibers) that can be paused, prioritized (e.g. user input over background animations), and resumed without blocking the browser main thread.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-07-02",
    "topic_id": "topic-07",
    "question": "What is the difference between `useMemo`, `useCallback`, and `React.memo`? When should you NOT use them?",
    "answer": "- **`React.memo`:** Higher Order Component (HOC) that skips re-rendering a child component if its props haven't changed (shallow comparison).\n- **`useMemo`:** Caches the RESULT of an expensive calculation across renders.\n- **`useCallback`:** Caches a FUNCTION REFERENCE across renders to prevent unnecessary re-creation of callback props passed to memoized child components.\n\n**When NOT to use:**\nDo NOT over-optimize trivial components or cheap inline functions. The overhead of dependency array checking and memoization cache memory can exceed the cost of re-rendering.\n\n```typescript\n// Prevents recalculating heavy filtering on every render\nconst filteredList = useMemo(() => {\n  return items.filter(item => item.value > threshold);\n}, [items, threshold]);\n\n// Prevents reference change when passing handler to memoized ChildComponent\nconst handleClick = useCallback((id: string) => {\n  deleteItem(id);\n}, [deleteItem]);\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-07-03",
    "topic_id": "topic-07",
    "question": "What are React Server Components (RSC) and how do they differ from SSR (Server-Side Rendering)?",
    "answer": "- **SSR (Server-Side Rendering):** Renders HTML on the server, but still sends ALL JavaScript code to the client for hydration (`hydrateRoot`).\n- **React Server Components (RSC):** Components execute ONLY on the server and do NOT send any JavaScript bundle to the client! Their output is streamed as a specialized JSON payload (RSC Payload).\n\n**Key Differences:**\n- RSCs cannot use state (`useState`), effects (`useEffect`), or browser APIs.\n- RSCs can query databases directly (`const users = await db.query()`) without API routes.\n- Client components (`'use client'`) handle interactive UI elements.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-07-04",
    "topic_id": "topic-07",
    "question": "Explain React `useRef` vs `useState` and how `useRef` avoids triggering re-renders.",
    "answer": "- **`useState`:** Triggers a component re-render whenever the state setter is invoked.\n- **`useRef`:** Returns a mutable ref object (`{ current: initialValue }`) that persists across renders WITHOUT triggering a component re-render when mutated.\n\n**Use Cases for `useRef`:**\n1. Direct DOM node manipulation (`inputRef.current.focus()`).\n2. Storing mutable values independent of render cycle (timers, previous state snapshots, WebSocket connections).\n\n```typescript\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n  const timerRef = useRef<NodeJS.Timeout | null>(null);\n\n  const startTimer = () => {\n    if (timerRef.current) return;\n    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);\n  };\n\n  const stopTimer = () => {\n    if (timerRef.current) clearInterval(timerRef.current);\n    timerRef.current = null;\n  };\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-07-05",
    "topic_id": "topic-07",
    "question": "How do custom React Hooks promote code reusability? Give a real-world production example.",
    "answer": "Custom Hooks encapsulate component state logic and side-effects into reusable functions. Custom hooks must start with `use` and can call other hooks (`useState`, `useEffect`).\n\n**Production Example: Custom `useDebounce` Hook**\n\n```typescript\nimport { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay: number = 300): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\n// Usage in Component\nfunction SearchBar() {\n  const [searchTerm, setSearchTerm] = useState('');\n  const debouncedSearch = useDebounce(searchTerm, 500);\n\n  useEffect(() => {\n    if (debouncedSearch) fetchResults(debouncedSearch);\n  }, [debouncedSearch]);\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-07-06",
    "topic_id": "topic-07",
    "question": "Explain React Concurrency Features (`useTransition`, `useDeferredValue`).",
    "answer": "React 18 introduced Concurrency, allowing renders to be interrupted.\n\n- **`useTransition`:** Marks state updates as non-urgent transitions. High-priority updates (typing in input) take precedence over low-priority transition renders (filtering 10,000 list items).\n- **`useDeferredValue`:** Defer updating a non-critical UI value until urgent updates finish (similar to debounce without delay timeouts).\n\n```typescript\nconst [isPending, startTransition] = useTransition();\nconst [query, setQuery] = useState('');\nconst [results, setResults] = useState([]);\n\nconst handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {\n  setQuery(e.target.value); // Urgent UI update (input field updates immediately)\n  \n  startTransition(() => {\n    setResults(heavySearch(e.target.value)); // Non-urgent update\n  });\n};\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-07-07",
    "topic_id": "topic-07",
    "question": "How do Error Boundaries work in React and how do you catch errors in async code?",
    "answer": "**Error Boundaries** are React components that catch JavaScript errors anywhere in their child component tree, log errors, and render a fallback UI.\n\nCurrently, Error Boundaries MUST be Class components (`componentDidCatch` or `getDerivedStateFromError`).\n\n*Note:* Error boundaries do NOT catch errors inside async callbacks (`setTimeout`, `fetch`, event handlers). To catch async errors, pass them into state or use `useErrorBoundary` hook libraries.\n\n```tsx\nclass ErrorBoundary extends React.Component<Props, State> {\n  state = { hasError: false };\n\n  static getDerivedStateFromError(error: Error) {\n    return { hasError: true };\n  }\n\n  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {\n    logErrorToMonitoringService(error, errorInfo);\n  }\n\n  render() {\n    if (this.state.hasError) return <h2>Something went wrong.</h2>;\n    return this.props.children;\n  }\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-08-01",
    "topic_id": "topic-08",
    "question": "How do B-Tree Indexes work in SQL databases, and why can over-indexing harm performance?",
    "answer": "**B-Tree (Balanced Tree) Indexes** store data in a self-balancing tree structure where lookup, insertion, and deletion operations run in $O(\\log N)$ time.\n\n- Leaf nodes contain the indexed column values and pointers (RID / Primary Key) to actual table rows.\n- Index lookup traverses root -> branch -> leaf, avoiding full table scans.\n\n**Why Over-indexing harms performance:**\n1. **Slower `INSERT`/`UPDATE`/`DELETE` writes:** Every write operation forces the database engine to update multiple B-Tree index structures synchronously.\n2. **Memory Footprint:** Indexes consume RAM (Buffer Pool) and disk space.\n3. **Query Optimizer Overhead:** Too many indexes confuse the SQL Optimizer when picking execution plans.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-08-02",
    "topic_id": "topic-08",
    "question": "What are SQL Window Functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`)?",
    "answer": "**Window Functions** perform calculations across a set of table rows related to the current row WITHOUT collapsing rows into a single summary output (unlike `GROUP BY`).\n\n- **`ROW_NUMBER()`:** Assigns sequential integer (1, 2, 3, 4).\n- **`RANK()`:** Assigns rank with gaps for ties (1, 2, 2, 4).\n- **`DENSE_RANK()`:** Assigns rank without gaps for ties (1, 2, 2, 3).\n- **`LAG()` / `LEAD()`:** Accesses data from a previous or subsequent row without self-joins.\n\n```sql\nSELECT \n    employee_id,\n    department_id,\n    salary,\n    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank\nFROM employees;\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-08-03",
    "topic_id": "topic-08",
    "question": "Explain Database Normalization (1NF, 2NF, 3NF, BCNF) vs De-normalization.",
    "answer": "- **1NF (First Normal Form):** Atomic values (no repeating groups/arrays in single cell).\n- **2NF:** Must be in 1NF + All non-key attributes must depend on the WHOLE primary key (eliminates partial dependencies).\n- **3NF:** Must be in 2NF + No transitive dependencies (non-key columns must NOT depend on other non-key columns).\n\n**De-normalization:** Intentionally adding redundant data or pre-calculated aggregates to a 3NF database to reduce costly multi-table JOINs in high-read OLAP data warehouses.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-08-04",
    "topic_id": "topic-08",
    "question": "What are ACID Properties in Relational Databases?",
    "answer": "- **Atomicity:** All statements in a transaction succeed together, or all roll back completely (All or Nothing).\n- **Consistency:** Database transitions valid state to valid state (enforces schema constraints, foreign keys).\n- **Isolation:** Concurrent transactions execute without interfering with each other.\n- **Durability:** Once committed, transaction data is written to non-volatile storage (WAL / Redo Logs) and survives system crashes.",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-08-05",
    "topic_id": "topic-08",
    "question": "Explain SQL Transaction Isolation Levels and concurrency side-effects.",
    "answer": "Concurrency Side-Effects:\n- **Dirty Read:** Reading uncommitted data written by another transaction.\n- **Non-Repeatable Read:** Re-reading same row yields different data due to another committed transaction.\n- **Phantom Read:** Re-executing query returns new rows inserted by another transaction.\n\n| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |\n|---|---|---|---|\n| Read Uncommitted | Allowed | Allowed | Allowed |\n| Read Committed (Default Postgres/SQL Server) | Prevented | Allowed | Allowed |\n| Repeatable Read | Prevented | Prevented | Allowed |\n| Serializable | Prevented | Prevented | Prevented |",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-09-01",
    "topic_id": "topic-09",
    "question": "What is the difference between `interface` and `type` alias in TypeScript, and when should you use each?",
    "answer": "- **`interface`:** Designed for object shape definitions. Supports **Declaration Merging** (extending interfaces with the same name across files/libraries) and performance-optimized OOP structures.\n- **`type` alias:** Can represent objects, primitives, unions (`string | number`), tuples, and complex conditional/mapped types. Does NOT support declaration merging.\n\n**Senior Guidelines:**\n- Use `interface` for public APIs, library definitions, and class implementations.\n- Use `type` for Unions, Intersections, Primitives, Utilities, and complex mapped types.\n\n```typescript\n// Interface Declaration Merging\ninterface User { name: string; }\ninterface User { age: number; } // Merged automatically into { name, age }\n\n// Type Union & Mapped Type\ntype Status = 'pending' | 'approved' | 'rejected';\ntype UserPermissions<T> = { [K in keyof T]?: boolean };\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-09-02",
    "topic_id": "topic-09",
    "question": "Explain TypeScript Generics with a practical Type-safe API Response wrapper example.",
    "answer": "Generics provide type variables (`<T>`) so functions, interfaces, and classes can operate over multiple types while retaining strict static type safety.\n\n```typescript\nexport interface ApiResponse<TData> {\n  status: 'success' | 'error';\n  statusCode: number;\n  data: TData;\n  error?: string;\n}\n\ninterface UserDto {\n  id: string;\n  email: string;\n}\n\n// Type-safe API call wrapper\nasync function fetchApi<T>(url: string): Promise<ApiResponse<T>> {\n  const response = await fetch(url);\n  return await response.json();\n}\n\n// Consumed with explicit DTO return type\nconst result = await fetchApi<UserDto>('/api/users/1');\nconsole.log(result.data.email); // Fully typed as string!\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-09-03",
    "topic_id": "topic-09",
    "question": "What are Utility Types in TypeScript? Explain `Pick`, `Omit`, `Partial`, `Required`, and `Record`.",
    "answer": "Built-in type transformations:\n\n- **`Partial<T>`:** Makes all properties optional.\n- **`Required<T>`:** Makes all properties mandatory.\n- **`Pick<T, K>`:** Extracts a subset of keys `K` from `T`.\n- **`Omit<T, K>`:** Removes keys `K` from `T`.\n- **`Record<K, T>`:** Maps keys `K` to values of type `T`.\n\n```typescript\ninterface Article {\n  id: string;\n  title: string;\n  content: string;\n  authorId: string;\n}\n\n// Omit id for creation payload\ntype CreateArticleDto = Omit<Article, 'id'>;\n\n// Dictionary map of articles by ID\ntype ArticleMap = Record<string, Article>;\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-09-04",
    "topic_id": "topic-09",
    "question": "How do TypeScript Discriminated Unions work and why are they vital for state machines?",
    "answer": "A **Discriminated Union** (Tagged Union) combines multiple interfaces that share a common literal property (the \"discriminant\"). TypeScript uses this property to narrow down exact types inside conditional blocks automatically.\n\n```typescript\ninterface LoadingState { status: 'loading'; }\ninterface SuccessState { status: 'success'; data: string[]; }\ninterface ErrorState { status: 'error'; message: string; }\n\ntype State = LoadingState | SuccessState | ErrorState;\n\nfunction renderState(state: State) {\n  switch (state.status) {\n    case 'loading': return 'Spinner';\n    case 'success': return `Items: ${state.data.length}`; // TS knows data exists here!\n    case 'error': return `Error: ${state.message}`; // TS knows message exists here!\n  }\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-09-05",
    "topic_id": "topic-09",
    "question": "Explain `unknown` vs `any` vs `never` types in TypeScript.",
    "answer": "- **`any`:** Disables all type checking. Bypasses safety checks and propagates unsafe types downstream.\n- **`unknown`:** Type-safe counterpart of `any`. Represents any value, BUT requires type narrowing (type guards/typeof checks) BEFORE calling methods on it.\n- **`never`:** Represents values that NEVER occur (functions that throw errors infinitely or unreachable union branches).\n\n```typescript\nfunction processInput(input: unknown) {\n  // input.toUpperCase(); // Error: Object is of type 'unknown'\n  if (typeof input === 'string') {\n    console.log(input.toUpperCase()); // Safe after narrowing!\n  }\n}\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-10-01",
    "topic_id": "topic-10",
    "question": "How do you unit test Angular Components using `TestBed` and ComponentFixture?",
    "answer": "`TestBed` is Angular's primary testing API to configure a dynamic testing module environment.\n\n```typescript\ndescribe('UserProfileComponent', () => {\n  let component: UserProfileComponent;\n  let fixture: ComponentFixture<UserProfileComponent>;\n  let mockUserService: jasmine.SpyObj<UserService>;\n\n  beforeEach(async () => {\n    mockUserService = jasmine.createSpyObj('UserService', ['getUser']);\n    mockUserService.getUser.and.returnValue(of({ name: 'Sam' }));\n\n    await TestBed.configureTestingModule({\n      imports: [UserProfileComponent], // Standalone component\n      providers: [\n        { provide: UserService, useValue: mockUserService }\n      ]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(UserProfileComponent);\n    component = fixture.componentInstance;\n    fixture.detectChanges(); // Triggers initial lifecycle & change detection\n  });\n\n  it('should display user name in DOM', () => {\n    const compiled = fixture.nativeElement as HTMLElement;\n    expect(compiled.querySelector('.user-name')?.textContent).toContain('Sam');\n  });\n});\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-10-02",
    "topic_id": "topic-10",
    "question": "How do you test HTTP Services using `HttpTestingController` in Angular?",
    "answer": "`HttpTestingController` mocks backend HTTP responses without executing actual network calls.\n\n```typescript\ndescribe('DataService', () => {\n  let service: DataService;\n  let httpMock: HttpTestingController;\n\n  beforeEach(() => {\n    TestBed.configureTestingModule({\n      providers: [DataService, provideHttpClient(), provideHttpClientTesting()]\n    });\n    service = inject(DataService);\n    httpMock = inject(HttpTestingController);\n  });\n\n  afterEach(() => {\n    httpMock.verify(); // Ensures no unhandled outstanding HTTP requests\n  });\n\n  it('should fetch data via GET', () => {\n    const mockPayload = [{ id: 1, title: 'Test' }];\n\n    service.getData().subscribe(data => {\n      expect(data).toEqual(mockPayload);\n    });\n\n    const req = httpMock.expectOne('/api/data');\n    expect(req.request.method).toBe('GET');\n    req.flush(mockPayload); // Emits mock response\n  });\n});\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-10-03",
    "topic_id": "topic-10",
    "question": "How do you unit test asynchronous code using `fakeAsync`, `tick()`, and `flush()` in Angular?",
    "answer": "`fakeAsync` runs async code inside a linear, synchronous zone where time can be manually fast-forwarded using `tick(milliseconds)` or `flush()`.\n\n```typescript\nit('should debounce search input for 300ms', fakeAsync(() => {\n  let searchResult = '';\n  component.searchResults$.subscribe(res => searchResult = res);\n\n  component.onSearchInput('Angular');\n  expect(searchResult).toBe(''); // Not emitted yet\n\n  tick(300); // Fast-forward time by 300ms\n  expect(searchResult).toBe('Angular'); // Now emitted!\n}));\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  },
  {
    "id": "q-10-04",
    "topic_id": "topic-10",
    "question": "How do you mock Signals and RxJS Observables in Angular Unit Tests?",
    "answer": "- **Signals:** Can be initialized directly with `signal(mockValue)` inside test specs.\n- **RxJS Observables:** Use `of(mockValue)` for immediate emissions or `throwError(() => new Error())` for error paths.\n\n```typescript\nit('should display error message on API failure', () => {\n  mockUserService.getUser.and.returnValue(throwError(() => new Error('404 Not Found')));\n  \n  fixture.detectChanges(); // Run lifecycle\n  \n  expect(component.errorMessage()).toBe('Failed to load user profile');\n});\n```",
    "confidence": "weak",
    "last_reviewed": null,
    "created_at": "2026-09-24T12:00:00.000Z",
    "updated_at": "2026-09-24T12:00:00.000Z"
  }
];
