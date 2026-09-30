Q: Explain JavaScript Event Loop, Microtask Queue, and Macrotask Queue with an execution order example.
A: JavaScript is single-threaded. Async execution is managed via the **Event Loop**, which continuously monitors the Call Stack and task queues.

- **Call Stack:** Executes synchronous JS code line by line.
- **Microtask Queue:** Holds Promise `.then()` callbacks, `queueMicrotask`, `process.nextTick`, and MutationObserver. Microtasks have HIGHER priority and are drained COMPLETELY before moving to the next task.
- **Macrotask Queue (Task Queue):** Holds `setTimeout`, `setInterval`, `setImmediate`, and I/O events. Executed ONE per loop iteration after microtask queue is empty.

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');
  queueMicrotask(() => console.log('4'));
});

console.log('5');

// Output Order: 1, 5, 3, 4, 2
```
---
Q: What is a Closure in JavaScript and what are its practical production use cases?
A: A **Closure** is the combination of a function bundled together with references to its lexical environment. A inner function retains access to variables declared in its outer scope even after the outer function has executed.

**Production Use Cases:**
1. Data Privacy / Encapsulation (Private variables before ES class `#private` fields).
2. Function Currying & Partial Application.
3. Memoization & Caching functions.
4. Custom Event Handlers & State Persistence.

```javascript
function createCounter() {
  let count = 0; // Private scope variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.count); // undefined (Encapsulated)
```
---
Q: How does `this` binding work in JavaScript (Default, Implicit, Explicit, Arrow Functions)?
A: `this` refers to the object executing the current function, determined at RUNTIME (except arrow functions):

1. **Default Binding:** Global object (`window` or `globalThis`), or `undefined` in strict mode `'use strict'`.
2. **Implicit Binding:** Object calling the method (`obj.func()` -> `this` is `obj`).
3. **Explicit Binding:** Using `.call(thisArg, a, b)`, `.apply(thisArg, [a, b])`, or `.bind(thisArg)`.
4. **Arrow Functions:** Do NOT have their own `this`. They lexically capture `this` from the enclosing scope at creation.

```javascript
const user = {
  name: 'Sam',
  greetStandard: function() { console.log(this.name); },
  greetArrow: () => { console.log(this.name); }
};

user.greetStandard(); // 'Sam'
user.greetArrow(); // undefined (captures outer/global scope)
```
---
Q: What are WeakMap and WeakSet, and how do they differ from Map and Set regarding Garbage Collection?
A:
- **Map / Set:** Hold STRONG references to keys. Keys will NOT be garbage collected even if references elsewhere are deleted, causing memory leaks if not cleaned up manually.
- **WeakMap / WeakSet:** Hold WEAK references to keys. Keys MUST be objects. If there are no other strong references to a key object, V8 engine garbage collects it automatically.

**Real-world scenario:** Caching metadata for DOM nodes without preventing DOM nodes from being garbage-collected when removed from page.
---
Q: What is Prototype Inheritance and how does the Prototype Chain work?
A: Every JavaScript object has an internal `[[Prototype]]` property (accessible via `Object.getPrototypeOf(obj)` or `__proto__`). When accessing a property on an object:
1. JS engine checks the object itself.
2. If not found, it checks the object's Prototype.
3. It recursively moves up the chain until `Object.prototype` (whose prototype is `null`).

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a noise.`;
};

const dog = new Animal('Rex');
console.log(dog.speak()); // Found on Animal.prototype
```
---
Q: Explain `debounce` vs `throttle` functions with code implementation.
A: Both optimize high-frequency events (scroll, resize, search input).

- **Debounce:** Delays function execution until after `N` milliseconds have elapsed since the LAST time it was invoked. (Great for auto-complete search inputs).
- **Throttle:** Ensures function executes at most ONCE per `N` milliseconds window. (Great for window scroll / resize handlers).

```javascript
// Debounce Implementation
function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle Implementation
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```
---
Q: What is JavaScript Memory Management and how does V8 Garbage Collection (Mark-and-Sweep) work?
A: Memory is allocated in the **Stack** (primitive values & function execution frames) and **Heap** (objects, functions, closures).

V8 uses **Generational Garbage Collection**:
1. **Scavenger (Young Generation):** Fast collection for short-lived objects using Cheney's copying algorithm.
2. **Mark-and-Sweep (Old Generation):**
   - **Mark:** Walks object graph starting from roots (global window, stack variables) and marks reachable objects.
   - **Sweep:** Reclaims un-marked (unreachable) memory addresses.
   - **Compact:** Defragments heap space.
---
Q: What are JavaScript Generators and Iterators (`function*` and `yield`)?
A: Generators are special functions that can pause execution midway and resume later, maintaining state.
- Declared with `function*`.
- Use `yield` keyword to return intermediate values.
- Returns an Iterator object with `.next()` method emitting `{ value, done }`.

```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```
---
Q: Explain Shallow Copy vs Deep Copy in JavaScript and safe deep cloning techniques.
A:
- **Shallow Copy:** Copies primitive values, but object/array references still point to the same memory addresses (`Object.assign()`, Spread operator `{...obj}`).
- **Deep Copy:** Recursively duplicates all nested objects/arrays creating independent memory copies.

**Deep Clone Methods:**
1. **`structuredClone(obj)`:** Modern native Web API (Handles Maps, Sets, Date, RegExp, ArrayBuffers).
2. **`JSON.parse(JSON.stringify(obj))`:** Quick hack, BUT fails on `undefined`, functions, Symbols, circular references, and Date objects.

```javascript
const original = { a: 1, b: { c: 2 } };
const deepCloned = structuredClone(original);
deepCloned.b.c = 99;
console.log(original.b.c); // 2 (Original unchanged)
```
---
Q: What is Event Delegation and why is it important for web performance?
A: **Event Delegation** is a technique of attaching a single event listener to a parent element instead of attaching multiple listeners to individual child elements. It leverages **Event Bubbling** (events firing on child nodes bubble up through DOM ancestors).

**Benefits:**
- Drastically reduces memory usage (1 listener vs 1000 listeners).
- Dynamically handles newly added child DOM elements without re-attaching event listeners.

```javascript
document.getElementById('user-list').addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('button.delete-user')) {
    const userId = target.dataset.id;
    deleteUser(userId);
  }
});
```
