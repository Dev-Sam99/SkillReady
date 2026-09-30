Q: What is the difference between `interface` and `type` alias in TypeScript, and when should you use each?
A:
- **`interface`:** Designed for object shape definitions. Supports **Declaration Merging** (extending interfaces with the same name across files/libraries) and performance-optimized OOP structures.
- **`type` alias:** Can represent objects, primitives, unions (`string | number`), tuples, and complex conditional/mapped types. Does NOT support declaration merging.

**Senior Guidelines:**
- Use `interface` for public APIs, library definitions, and class implementations.
- Use `type` for Unions, Intersections, Primitives, Utilities, and complex mapped types.

```typescript
// Interface Declaration Merging
interface User { name: string; }
interface User { age: number; } // Merged automatically into { name, age }

// Type Union & Mapped Type
type Status = 'pending' | 'approved' | 'rejected';
type UserPermissions<T> = { [K in keyof T]?: boolean };
```
---
Q: Explain TypeScript Generics with a practical Type-safe API Response wrapper example.
A: Generics provide type variables (`<T>`) so functions, interfaces, and classes can operate over multiple types while retaining strict static type safety.

```typescript
export interface ApiResponse<TData> {
  status: 'success' | 'error';
  statusCode: number;
  data: TData;
  error?: string;
}

interface UserDto {
  id: string;
  email: string;
}

// Type-safe API call wrapper
async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return await response.json();
}

// Consumed with explicit DTO return type
const result = await fetchApi<UserDto>('/api/users/1');
console.log(result.data.email); // Fully typed as string!
```
---
Q: What are Utility Types in TypeScript? Explain `Pick`, `Omit`, `Partial`, `Required`, and `Record`.
A: Built-in type transformations:

- **`Partial<T>`:** Makes all properties optional.
- **`Required<T>`:** Makes all properties mandatory.
- **`Pick<T, K>`:** Extracts a subset of keys `K` from `T`.
- **`Omit<T, K>`:** Removes keys `K` from `T`.
- **`Record<K, T>`:** Maps keys `K` to values of type `T`.

```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

// Omit id for creation payload
type CreateArticleDto = Omit<Article, 'id'>;

// Dictionary map of articles by ID
type ArticleMap = Record<string, Article>;
```
---
Q: How do TypeScript Discriminated Unions work and why are they vital for state machines?
A: A **Discriminated Union** (Tagged Union) combines multiple interfaces that share a common literal property (the "discriminant"). TypeScript uses this property to narrow down exact types inside conditional blocks automatically.

```typescript
interface LoadingState { status: 'loading'; }
interface SuccessState { status: 'success'; data: string[]; }
interface ErrorState { status: 'error'; message: string; }

type State = LoadingState | SuccessState | ErrorState;

function renderState(state: State) {
  switch (state.status) {
    case 'loading': return 'Spinner';
    case 'success': return `Items: ${state.data.length}`; // TS knows data exists here!
    case 'error': return `Error: ${state.message}`; // TS knows message exists here!
  }
}
```
---
Q: Explain `unknown` vs `any` vs `never` types in TypeScript.
A:
- **`any`:** Disables all type checking. Bypasses safety checks and propagates unsafe types downstream.
- **`unknown`:** Type-safe counterpart of `any`. Represents any value, BUT requires type narrowing (type guards/typeof checks) BEFORE calling methods on it.
- **`never`:** Represents values that NEVER occur (functions that throw errors infinitely or unreachable union branches).

```typescript
function processInput(input: unknown) {
  // input.toUpperCase(); // Error: Object is of type 'unknown'
  if (typeof input === 'string') {
    console.log(input.toUpperCase()); // Safe after narrowing!
  }
}
```
