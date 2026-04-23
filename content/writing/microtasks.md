---
title: "Microtasks: Why Promises Run First"
summary: "Why do Promises always run before setTimeout? This article reveals microtasks as mandatory continuations that must run before JavaScript moves on."
date: "2026-04-21"
year: 2026
featured: true
image: "/sunrise-default.svg"
tech: 
  - JavaScript
links:
  - label: Medium
    url: https://medium.com/@marshateo/microtasks-why-promises-run-first-37fd5642daca
  - label: Dev.to
    url: https://dev.to/marshateo/microtasks-why-promises-run-first-4ba1
---

<p className="mt-4 text-sm text-neutral-500 italic">
  This article is part of a series on the JavaScript event loop.
  <a href="/writing/javascript-event-loop-landing" className="underline hover:text-neutral-700">
    View all articles →
  </a>
</p>

# Microtasks: Why Promises Run First

<div id="scroll-trigger">

In the [last article](/writing/macrotasks), we established that:

> JavaScript execution cannot be interrupted.

Once a macrotask starts, nothing cuts in. Only after it completes does the runtime select the next macrotask from the queue. 

But consider this:

``` javascript
setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("sync done");
```

The output is always:

``` plaintext
sync done
promise
timeout
```

Both `setTimeout` and `Promise.then` are asynchronous and both schedule work to run later. If macrotasks are chosen one at a time, and nothing interrupts them, then promises should behave like timers. But that's not the case. The promise runs first, every time. Why?

If our macrotask model of JavaScript were complete, this ordering would not be guaranteed. Something else must exist. Specifically, there is another category of work in JavaScript: **microtasks**.

They do not interrupt the current macrotask. And yet they run before the runtime selects the next macrotask. Before we define them fully, we should understand why such a mechanism is needed. 

</div>

## The Tempting but Incomplete Explanation

Many explanations jump immediately to:

> “Promises use the microtask queue, which runs before the macrotask queue.”

That statement is technically correct. But it explains nothing. Why are there two queues? Why does one outrank the other?

If we stop here, microtasks feel arbitrary. Let's instead find out more.

## Running the Experiments

You can run all code snippets in this series by pasting them into the browser console.

While some examples work in Node.js, others rely on browser APIs (like rendering or `requestAnimationFrame`), so the browser is the most reliable environment.

## A Hypothesis: Promises Are Just Higher-Priority Tasks

A reasonable mental model is that microtasks are just higher-priority tasks. When we have timers and promises, timers go into one queue, promises go into another, and the promise queue is checked first.

Let's test this:

``` javascript
setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => {
  console.log("promise 1");
  Promise.resolve().then(() => {
    console.log("promise 2");
  });
});

console.log("sync done");
```

If promises are merely higher-priority tasks, we may expect:

```plaintext
sync done
promise 1
timeout
promise 2
```

After `sync done`, the runtime has at least two pending pieces of work: the timer callback and the first promise callback. Since promise callbacks have higher priority, the runtime chooses the promise first. Consequently, `promise 1` runs before `timeout`.

When `promise 1` runs, it schedules another promise callback: `promise 2`. At this point, the runtime could choose between the existing timer callback or the newly scheduled promise callback. If promise callbacks were just higher priority macrotasks, the runtime should be free to interleave them.

However, the actual output is:

```plaintext
sync done
promise 1
promise 2
timeout
```

`promise 2` runs immediately after `promise 1`, before the `timeout` is even considered. 

## The Rule That Must Exist

The only model consistent with this behavior is:

> Once microtask execution begins, all microtasks must run to completion before the runtime considers another macrotask.

Promise callbacks are not independent tasks competing with timers. They are unfinished work from the current turn of execution. They are continuations and continuations must complete before control is returned to the runtime. 

## Reframing Microtasks Properly

A microtask is not a faster callback nor is it a convenience queue. `Promise` callbacks are the most common example of microtasks, but this mechanism also underlie `async` functions and `MutationObserver` callbacks. Broadly, a microtask is:

> Work that must be completed before JavaScript yields control back to the runtime.

This is why:

- microtasks run after the current macrotask finishes,
- microtasks run before the runtime chooses another macrotask,
- the runtime drains the microtask queue completely,
- microtasks can schedule more microtasks,

They exist to preserve atomicity across asynchronous boundaries. 

## Why This Rule Must Exist

If microtasks were treated like ordinary macrotasks, promise chains could interleave with unrelated work. That would introduce subtle inconsistencies and expose partially completed state. 

Consider this:

``` javascript
let state = {
  loading: true,
  data: null
};

Promise.resolve().then(() => {
  state.data = "result";
  state.loading = false;
});
```

This callback represents a single logical transition where the data arrives and loading ends. From the programmer's perspective, these two assignments belong together. 

If the runtime were allowed to pause this callback midway or run unrelated macrotasks before it completes, external code could observe:

``` plaintext
{ loading: true, data: "result" }
```

This is a partially completed update (data has arrived but loading is still `true`). JavaScript avoids this by enforcing: 

> Once the current macrotask finishes, the runtime runs all microtasks run before selecting another macrotask.

This ensures that promises are continuations of the current turn of execution. And these continuations must complete before control returns to the runtime. That guarantee makes promise chains predictable:

```plaintext
Promise.resolve()
  .then(() => step1())
  .then(() => step2());
```

The first `.then()` callback is queued as a microtask. After the promise returned by `step1()` settles, the second callback is queued. A promise chain schedules its continuations incrementally, not all at once. 

Yet because the runtime must drain the microtask queue completely before selecting another macrotask, these incrementally scheduled callbacks still run back-to-back, without unrelated timers or events cutting in between them. The continuation may be deferred but it is never fragmented. 

## The Draining Behavior

Microtasks are not executed one-by-one with runtime checks between them. They are drained in a loop:

``` plaintext
while (microtask queue is not empty) {
  run next microtask
}
```

That is why nested promises run immediately. That is why infinite promise loops freeze the page. Consider:

``` javascript
function loop() {
  Promise.resolve().then(loop);
}

setTimeout(() => console.log("timeout fired"), 0);

loop();
```

If you run this, be prepared to close the page, since this experiment creates an infinite microtask loop.

The page would freeze and `timeout fired` is never logged since a new microtask is queued every time `loop` is called. The runtime is not allowed to proceed to another macrotask while microtasks remain. Microtasks are not candidates for task selection. They are executed automatically as part of finishing the current turn.

## The JavaScript Turn Model

We can now describe a single turn of JavaScript execution:

1. The runtime chooses a macrotask.
2. JavaScript executes synchronously.
3. Once the call stack is empty, the runtime drains the microtask queue.
4. Only then can the runtime consider another macrotask.

This is the event loop from JavaScript's perspective. In later articles, we will extend this model to include rendering and the browser's frame lifecycle. loop. 

## The Mental Model to Keep

When debugging async behavior, ask:

- Did we just finish a macrotask?
- Are there microtasks pending?
- Has the runtime been allowed to choose another macrotask yet?

If microtasks exist, the answer is always:

> No, the runtime must wait.

## What This Prepares Us For Next

If microtasks are mandatory continuations, then what exactly does `await` do?

Does it pause execution?
Does it create a new task?
Or does it quietly hook into this same microtask mechanism?

Understanding that requires looking at `async` functions more closely.

That is the subject of the next article.
