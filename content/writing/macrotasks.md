---
title: "Macrotasks: What a Task Actually Is"
summary: "If nothing can interrupt JavaScript, when does anything else run? This article reframes tasks as entry points into execution, not chunks of work."
date: "2026-04-15"
year: 2026
featured: true
image: "/sunrise-default.svg"
tech: 
  - JavaScript
links:
  - label: Medium
    url: https://medium.com/@marshateo/macrotasks-what-a-task-actually-is-e194ee84859f
  - label: Dev.to
    url: https://dev.to/marshateo/macrotasks-what-a-task-actually-is-4pbd
---

<p className="mt-4 text-sm text-[var(--text-subtle)] italic">
  This article is part of a series on the JavaScript event loop.
  <a className="underline text-[var(--text-subtle)] hover:text-[var(--text-hover)]" href="/writing/javascript-event-loop-landing">
    View all articles
  </a>
</p>

# Macrotasks: What a Task Actually Is

<div id="scroll-trigger">

In the [previous article](/writing/runtime-mental-model), we established that

> JavaScript executes synchronously inside a task, and nothing can interrupt that execution.

This explains why timers don't cut in, why promises wait and why loops block everything else. But if JavaScript runs 'inside a task', where does that task begin and end? Is the entire script one task? Is each function call its own task? 

This article exists to answer more precisely:
> What exactly is a task?

</div>

## The Wrong Mental Model of a Task

You would think that 'task' refers to a unit of work — something with a duration, a beginning, and an end - and imagine that in JavaScript, a 'task' refers to a big chunk of execution. Maybe each statement is its own task; Each function call creates a new task; Control-flow disruptions using `try`/`catch` create task boundaries where the runtime is allowed to pause the current execution to run something else. With this, synchronous code consists of smaller tasks, and  execution could be subdivided internally. 

Let's test that idea. 

## Running the Experiments

You can run all code snippets in this series by pasting them into the browser console.

While some examples work in Node.js, others rely on browser APIs (like rendering or `requestAnimationFrame`), so the browser is the most reliable environment.

## Test 1: The Initial Script Is One Task

In the [previous article](/writing/runtime-mental-model), we tested whether `setTimeout` could interrupt synchronous execution: 

``` javascript
console.log("sync start");

// Schedule asynchronous callback with setTimeout
setTimeout(() => {
  console.log("timeout fired");
}, 0);

for (let i = 0; i < 1e9; i++) {}

console.log("sync end");
```

What we always observed was:

``` plaintext
sync start
sync end
timeout fired
```

The entire global script executed as one uninterrupted block. The `setTimeout` callback ran later in a separate execution window. There are 2 tasks here: the initial script and the timeout callback. 

Even though the timer expired quickly, the callback did not execute immediately. Instead, when the timer expired, the callback became eligible to run and waited in the queue managed by the runtime. 

## Test 2: Internal Structure Does Not Create Task Boundaries

Could each function call be its own 'task' internally? If function calls created new tasks, the runtime could switch between them.

``` javascript
function a() {
  console.log("a");
  b();
}

function b() {
  console.log("b");
  c();
}

function c() {
  console.log("c");
}

setTimeout(() => console.log("timeout"), 0);

a();
```

If function calls created new tasks, we might expect the timeout to run between `a`, `b`, or `c`.

But the output is always:

``` plaintext
a
b
c
timeout
```

Even though the call stack grows and shrinks, JavaScript remains inside the same task the entire time. Function calls change the call stack but do not create new tasks because these changes to the internal call stack are invisible to the runtime. The runtime only observes whether the call stack is empty.

This is the case even in deep recursion cases:

```javascript
console.log("start")

setTimeout(() => console.log("timeout"), 0);

function recurse(n) {
  if (n === 0) return ;
  recurse(n - 1);
}

recurse(100);

console.log("end");
```

The runtime does not care how long the call stack is:

```plaintext
start
end
timeout
```

## Test 3: Exceptions Do Not Create Task Boundaries

Perhaps abrupt control flow — like exceptions — creates a task  boundary. Maybe now execution 'breaks' enough that the runtime gets a chance to run something else.

``` javascript
setTimeout(() => console.log("timeout"), 0);

try {
  console.log("before throw");
  throw new Error("boom");
} catch {
  console.log("caught error");
}

console.log("after catch");
```

The output is always:

``` plaintext
before throw
caught error
after catch
timeout
```

Even though execution jumps abruptly from `throw` to `catch`, it never leaves the current task. JavaScript remains in the same task until `after catch` and the runtime schedules the timer callback task. 

Now let's remove the `try`/`catch`:

``` javascript
setTimeout(() => console.log("timeout task"), 0);

function a() {
  console.log("a: enter");
  try {
    b();
  } finally {
    console.log("a: finally (ran during unwind)");
  }
  console.log("a: after b (never)");
}

function b() {
  console.log("b: enter");
  try {
    c();
  } finally {
    console.log("b: finally (ran during unwind)");
  }
}

function c() {
  console.log("c: throw");
  throw new Error("boom");
}

a();
console.log("global: after a (never)");
```

What happens?

``` plaintext
a: enter
b: enter
c: throw
b: finally (ran during unwind)
a: finally (ran during unwind)
Uncaught Error: boom
timeout task
```

Control never returns to `a: after b` or `global: after a` after the exception was thrown. The current task terminates immediately when the error escapes the call stack. As the stack unwinds, the `finally` blocks run. Only after the unwind is complete does the runtime regain control and select select the next task. An uncaught exception ends the current task. It does not subdivide it.

## Test 4: User Events Do Not Interrupt

Now let's introduce an external event: a user click. 

```javascript
document.addEventListener("click", () => {
  console.log("click handler ran");
});

console.log("start long task");

for (let i = 0; i < 1e9; i++) {}

console.log("end long task");
```

If you click the page while the loop is running, what happens?

The page will appear frozen for a few seconds (the loop typically takes a couple of seconds to complete on most machines). The click is detected instantly by the browser but the click handler does not run. Only after the loop finishes do you see:

``` plaintext
start long task
end long task
click handler ran
```

The click created a new task: the runtime (the browser) captured the click event and scheduled the task. That task waits for the engine to become idle. 

## Reframing Tasks Correctly: Permission, Not Duration

> A task describes why JavaScript is allowed to start running at all.

The runtime (the browser or Node.js) observes events outside the JavaScript engine. These events include timers expiring and user interactions. Each of these produces a request to run JavaScript. A task is that request. 

A task does not describe how long JavaScript runs. It describes an entry point into execution. For instance, the delay passed to `setTimeout` is a minimum delay, not a guaranteed execution time. When the timer expires, the callback becomes eligible to run. It does not execute immediately. It must still wait for the current task to finish and for the call stack to become empty. 

When the call stack is empty, the runtime chooses one task and hands control to the engine. The JavaScript engine then runs that task synchronously to completion. 

From the runtime’s point of view, the engine is either running or idle. An empty call stack is the only signal that matters. The runtime is free to wait, listen, and prepare callbacks — but it is not free to execute them whenever it likes. It must wait until JavaScript stops.

Tasks are a coordination mechanism between the runtime and the engine.

## Why These Are Called "Macrotasks"

The kind of task we have been discussing has a more precise name: **macrotask**. Examples include the initial script execution, a `setTimeout` callback and a user event handler. 

"Macro" does not mean large nor long-running. It distinguishes these tasks from another scheduling mechanisms we will introduce in the next article.

For now, a macrotask is: 
> a request from runtime that allows the engine to begin executing code. 

## The Runtime Model

At this point, we can describe the system precisely:
- The runtime collects requests to run JavaScript.
- Each request is a macrotask.
- When the call stack is empty, the runtime selects a macrotask.
- JavaScript runs synchronously to completion.
- Only then can another macrotask be considered.

From the runtime's perspective, the only thing that matters is whether the call stack is empty. 

This explains why task boundaries are coarse. Task boundaries do not occur between statements, function calls, loop iterations, recursive calls nor try/catch blocks. They occur at large structural entry points like an entire script, an entire event handler, or an entire timer callback. The runtime does not see internal structure; It only sees whether execution has finished.  

## Where We Go Next

At this point, we know that a macrotask runs to completion. But what happens when, inside a macrotask, the code schedules more work that logically belongs to the same operation?

Should it interrupt the current macrotask? (But we just established that this is not possible).

Should it wait behind the other tasks in the queue? (But this would delay it unpredictably.)

Neither is ideal. Instead, JavaScript has a mechanism that does not interrupt the current macrotask but runs **before** the runtime selects the next macrotask. This mechanism is **microtasks**.

This is where we go [next](/writing/microtasks). 