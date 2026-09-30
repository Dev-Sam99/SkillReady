Q: How do you unit test Angular Components using `TestBed` and ComponentFixture?
A: `TestBed` is Angular's primary testing API to configure a dynamic testing module environment.

```typescript
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUser']);
    mockUserService.getUser.and.returnValue(of({ name: 'Sam' }));

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent], // Standalone component
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers initial lifecycle & change detection
  });

  it('should display user name in DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-name')?.textContent).toContain('Sam');
  });
});
```
---
Q: How do you test HTTP Services using `HttpTestingController` in Angular?
A: `HttpTestingController` mocks backend HTTP responses without executing actual network calls.

```typescript
describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = inject(DataService);
    httpMock = inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no unhandled outstanding HTTP requests
  });

  it('should fetch data via GET', () => {
    const mockPayload = [{ id: 1, title: 'Test' }];

    service.getData().subscribe(data => {
      expect(data).toEqual(mockPayload);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockPayload); // Emits mock response
  });
});
```
---
Q: How do you unit test asynchronous code using `fakeAsync`, `tick()`, and `flush()` in Angular?
A: `fakeAsync` runs async code inside a linear, synchronous zone where time can be manually fast-forwarded using `tick(milliseconds)` or `flush()`.

```typescript
it('should debounce search input for 300ms', fakeAsync(() => {
  let searchResult = '';
  component.searchResults$.subscribe(res => searchResult = res);

  component.onSearchInput('Angular');
  expect(searchResult).toBe(''); // Not emitted yet

  tick(300); // Fast-forward time by 300ms
  expect(searchResult).toBe('Angular'); // Now emitted!
}));
```
---
Q: How do you mock Signals and RxJS Observables in Angular Unit Tests?
A:
- **Signals:** Can be initialized directly with `signal(mockValue)` inside test specs.
- **RxJS Observables:** Use `of(mockValue)` for immediate emissions or `throwError(() => new Error())` for error paths.

```typescript
it('should display error message on API failure', () => {
  mockUserService.getUser.and.returnValue(throwError(() => new Error('404 Not Found')));
  
  fixture.detectChanges(); // Run lifecycle
  
  expect(component.errorMessage()).toBe('Failed to load user profile');
});
```
