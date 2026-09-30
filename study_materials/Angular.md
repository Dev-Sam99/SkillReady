Q: How does Angular's Change Detection mechanism work under the hood, and how do you optimize it with OnPush?
A: Angular uses `zone.js` to monkey-patch asynchronous browser APIs (XHR, setTimeout, DOM events). When an async event fires, `zone.js` triggers change detection top-down from the root component. 

In a 5+ YOE production app, default change detection (`ChangeDetectionStrategy.Default`) checks every component on every tick, causing severe performance drops in heavy UIs. 

To optimize:
1. Use `ChangeDetectionStrategy.OnPush`: Component is checked ONLY when an `@Input()` reference changes, an event originates from component/children, or manually triggered via `ChangeDetectorRef.markForCheck()`.
2. Use Immutable Data patterns (RxJS `BehaviorSubject` or Signals).

```typescript
@Component({
  selector: 'app-user-profile',
  template: `<div>{{ user().name }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
  user = input.required<User>(); // Using modern Signals input
}
```
---
Q: What is the difference between Angular Signals and RxJS Observables, and when should you use each?
A: **Signals** (introduced in Angular 16+) provide fine-grained reactivity. They track dependencies automatically without subscription overhead or memory leak risks, and operate synchronously.

**RxJS Observables** represent async data streams over time (HTTP requests, WebSockets, complex event compositions).

**Senior Recommendation:** Use Signals for UI state, computed properties, and local component reactivity. Use RxJS for asynchronous streams, cancellation (`switchMap`), debounce (`debounceTime`), or retry mechanisms.

```typescript
// Signals for synchronous UI state
const count = signal(0);
const doubleCount = computed(() => count() * 2);

// RxJS for async HTTP & debouncing search inputs
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.userService.search(term))
).subscribe(results => this.results.set(results));
```
---
Q: How do you handle Memory Leaks caused by RxJS Subscriptions in Angular?
A: In long-lived SPA applications, failing to unsubscribe from infinite Observables (e.g. `interval`, route parameters, global stores) causes memory leaks.

**Solutions for 5+ YOE Developers:**
1. **Prefer Async Pipe (`| async`):** Handles subscription & unsubscription automatically in template.
2. **`takeUntilDestroyed` (Angular 16+):** Automatically unsubscribes when the injection context (Component/Service) is destroyed.
3. **`DestroyRef` or `takeUntil(this.destroy$)`:** For legacy components.

```typescript
@Component({...})
export class DataFeedComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private dataService = inject(DataService);

  ngOnInit() {
    this.dataService.stream$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.processData(data));
  }
}
```
---
Q: How does Angular's Dependency Injection (DI) Hierarchical Injector work?
A: Angular DI has two main injector hierarchies:
1. **ElementInjector Hierarchy:** Created at DOM nodes (Components/Directives).
2. **EnvironmentInjector Hierarchy:** Configured at route levels or root (`providedIn: 'root'`).

When a component requests a dependency, Angular searches locally in its `ElementInjector`. If not found, it bubbles up component parents, then switches to the `EnvironmentInjector` up to the Root.

**Real-world scenario:** Providing a service in `@Component({ providers: [FeatureService] })` creates a unique instance for *that component subtree*, useful for tab-isolated form states.
---
Q: What are Standalone Components and how do they change Angular architecture?
A: Introduced in Angular 14+, Standalone components eliminate `NgModule` boilerplate. Components, directives, and pipes declare their own dependencies directly via `imports: [...]`.

**Benefits:**
- Simplifies lazy loading via `loadComponent: () => import(...)`.
- Enables modular domain-driven architecture.
- Improves build times and tree-shaking efficiency.

```typescript
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, UserListComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}
```
---
Q: How do custom HttpInterceptors work in modern Standalone Angular?
A: HttpInterceptors intercept and transform outgoing HTTP requests and incoming HTTP responses globally (e.g. attaching Bearer tokens, refresh token logic, global error logging).

In modern Angular (15+), functional interceptors (`HttpInterceptorFn`) are preferred over class-based interceptors.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token 
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) authService.refreshTokenAndRetry(req);
      return throwError(() => error);
    })
  );
};
```
---
Q: Explain Angular Router Resolvers vs Route Guards.
A: **Route Guards (`CanActivateFn`, `CanDeactivateFn`):** Control route navigation permissions (Auth checks, role RBAC, preventing unsaved form loss). They evaluate to boolean or `UrlTree`.

**Route Resolvers (`ResolveFn`):** Fetch necessary data BEFORE navigation completes. The router waits for the resolver to emit before rendering the target component, avoiding partial UI layout shifts.
---
Q: What is the ContentProjection (`ng-content`) pattern and Multi-slot projection?
A: Content projection allows passing custom HTML or components into a child component's layout (similar to React `children`).

**Multi-slot projection:** Uses `select="[slot-name]"` attribute selectors.

```html
<!-- Card Component Template -->
<div className="card-header">
  <ng-content select="[card-title]"></ng-content>
</div>
<div className="card-body">
  <ng-content></ng-content>
</div>

<!-- Usage -->
<app-card>
  <h2 card-title>Analytics Overview</h2>
  <p>Main content area...</p>
</app-card>
```
---
Q: How do you optimize large-scale Angular applications for initial load time?
A:
1. **Lazy Loading Routes:** Split bundles by feature modules (`loadChildren` / `loadComponent`).
2. **Deferrable Views (`@defer`):** Angular 17+ feature to defer loading expensive components until visible in viewport or interaction (`on viewport`, `on hover`).
3. **Preloading Strategies:** Use `PreloadAllModules` or custom network-aware preloading.
4. **OnPush & Signals:** Reduces runtime JS execution overhead.
5. **Optimize Assets & Fonts:** Inline critical CSS and use WebP/AVIF images.

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="skeleton-loader">Loading Chart...</div>
}
```
---
Q: Explain ViewChild, ViewChildren, ContentChild, and ContentChildren.
A:
- **`ViewChild` / `ViewChildren`:** Access elements/components declared within the component's OWN template (`ngAfterViewInit`).
- **`ContentChild` / `ContentChildren`:** Access elements projected into the component via `<ng-content>` (`ngAfterContentInit`).

In Angular 17.2+, Signal queries (`viewChild()`, `contentChild()`) replace decorators for cleaner type safety.
