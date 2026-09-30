Q: How does React Virtual DOM and Reconciliation Algorithm (Fiber) work under the hood?
A: **Virtual DOM (VDOM)** is a lightweight in-memory JSON representation of the real DOM. When component state changes:
1. React creates a new VDOM tree.
2. **Diffing Algorithm (Heuristic O(N)):** React compares the new VDOM tree with the previous VDOM tree.
   - Elements of different types produce different trees (destroys & rebuilds subtree).
   - `key` props identify dynamic list elements to preserve DOM node identity across re-renders.
3. **Reconciliation (React Fiber):** Fiber breaks rendering work into small units (fibers) that can be paused, prioritized (e.g. user input over background animations), and resumed without blocking the browser main thread.

---
Q: What is the difference between `useMemo`, `useCallback`, and `React.memo`? When should you NOT use them?
A:
- **`React.memo`:** Higher Order Component (HOC) that skips re-rendering a child component if its props haven't changed (shallow comparison).
- **`useMemo`:** Caches the RESULT of an expensive calculation across renders.
- **`useCallback`:** Caches a FUNCTION REFERENCE across renders to prevent unnecessary re-creation of callback props passed to memoized child components.

**When NOT to use:**
Do NOT over-optimize trivial components or cheap inline functions. The overhead of dependency array checking and memoization cache memory can exceed the cost of re-rendering.

```typescript
// Prevents recalculating heavy filtering on every render
const filteredList = useMemo(() => {
  return items.filter(item => item.value > threshold);
}, [items, threshold]);

// Prevents reference change when passing handler to memoized ChildComponent
const handleClick = useCallback((id: string) => {
  deleteItem(id);
}, [deleteItem]);
```
---
Q: What are React Server Components (RSC) and how do they differ from SSR (Server-Side Rendering)?
A:
- **SSR (Server-Side Rendering):** Renders HTML on the server, but still sends ALL JavaScript code to the client for hydration (`hydrateRoot`).
- **React Server Components (RSC):** Components execute ONLY on the server and do NOT send any JavaScript bundle to the client! Their output is streamed as a specialized JSON payload (RSC Payload).

**Key Differences:**
- RSCs cannot use state (`useState`), effects (`useEffect`), or browser APIs.
- RSCs can query databases directly (`const users = await db.query()`) without API routes.
- Client components (`'use client'`) handle interactive UI elements.
---
Q: Explain React `useRef` vs `useState` and how `useRef` avoids triggering re-renders.
A:
- **`useState`:** Triggers a component re-render whenever the state setter is invoked.
- **`useRef`:** Returns a mutable ref object (`{ current: initialValue }`) that persists across renders WITHOUT triggering a component re-render when mutated.

**Use Cases for `useRef`:**
1. Direct DOM node manipulation (`inputRef.current.focus()`).
2. Storing mutable values independent of render cycle (timers, previous state snapshots, WebSocket connections).

```typescript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
}
```
---
Q: How do custom React Hooks promote code reusability? Give a real-world production example.
A: Custom Hooks encapsulate component state logic and side-effects into reusable functions. Custom hooks must start with `use` and can call other hooks (`useState`, `useEffect`).

**Production Example: Custom `useDebounce` Hook**

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in Component
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) fetchResults(debouncedSearch);
  }, [debouncedSearch]);
}
```
---
Q: Explain React Concurrency Features (`useTransition`, `useDeferredValue`).
A: React 18 introduced Concurrency, allowing renders to be interrupted.

- **`useTransition`:** Marks state updates as non-urgent transitions. High-priority updates (typing in input) take precedence over low-priority transition renders (filtering 10,000 list items).
- **`useDeferredValue`:** Defer updating a non-critical UI value until urgent updates finish (similar to debounce without delay timeouts).

```typescript
const [isPending, startTransition] = useTransition();
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  setQuery(e.target.value); // Urgent UI update (input field updates immediately)
  
  startTransition(() => {
    setResults(heavySearch(e.target.value)); // Non-urgent update
  });
};
```
---
Q: How do Error Boundaries work in React and how do you catch errors in async code?
A: **Error Boundaries** are React components that catch JavaScript errors anywhere in their child component tree, log errors, and render a fallback UI.

Currently, Error Boundaries MUST be Class components (`componentDidCatch` or `getDerivedStateFromError`).

*Note:* Error boundaries do NOT catch errors inside async callbacks (`setTimeout`, `fetch`, event handlers). To catch async errors, pass them into state or use `useErrorBoundary` hook libraries.

```tsx
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logErrorToMonitoringService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}
```
