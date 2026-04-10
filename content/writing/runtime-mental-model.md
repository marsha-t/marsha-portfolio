---
title: "The JavaScript Runtime: Fixing the Mental Model"
summary: "Why doesn’t setTimeout interrupt your code? This article breaks the illusion: JavaScript runs synchronously, and async APIs don’t interrupt. Instead, they schedule."
date: "2026-04-06"
year: 2026
featured: true
image: "/sunrise-default.svg"
tech: 
  - JavaScript
links:
  - label: Medium
    url: http://medium.com
---

<p className="mt-4 text-sm text-neutral-500 italic">
  This article is part of a series on the JavaScript event loop.
  <a href="/writing/javascript-event-loop-landing" className="underline hover:text-neutral-700">
    View all articles →
  </a>
</p>

# The JavaScript Runtime: Fixing the Mental Model

<div id="scroll-trigger">

Most explanations of JavaScript's event loop start with:
> JavaScript is single-threaded.

This statement is technically true but doesn't explain certain behaviors in JavaScript you may have noticed:
- `setTimeout` doesn't interrupt loops after the timer has run out
- `setTimeout` doesn't block (like `sleep(1)` in C)
- A resolved `Promise` still runs after synchronous code
- `await` pauses a function but doesn't freeze the page
- Rendering sometimes wait

So we're left asking:
- Why didn’t my timeout fire?
- Why didn’t it interrupt my loop?
- Why does `await` pause _this_ but not _everything_?
- Why does nothing ever 'cut in'?

In this series, we'll build the understanding needed to make JavaScript stop feeling magical. 

Today's core claim is simple: 

> JavaScript executes synchronously inside a task, and nothing can interrupt that execution.

</div>

##  What Does "Synchronous" and "Asynchronous" Really Mean?
First, let's define 'synchronous' and 'asynchronous' precisely.

Synchronous execution refers to code that runs immediately, executing from top to bottom via the call stack. We will show that this cannot be interrupted in JavaScript. 

By contrast, asynchronous code refers to code whose result is not available immediately. Some work is initiated now, but its continuation runs later. In practice, this almost always involves a **callback** - a function that is scheduled to execute in the future. In JavaScript, asynchronous code includes not only `async`/`await` but also other mechanisms like `setTimeout`, `Promise`, and `requestAnimationFrame`. 

As this series will make clear, asynchronous mechanisms do not block nor interrupt the call stack. Instead, they arrange for something to run later via scheduling.

For now, let's test the claim directly:
> Can asynchronous callbacks interrupt synchronous execution?

## Running the Experiments

You can run all code snippets in this series by pasting them into the browser console.

While some examples work in Node.js, others rely on browser APIs (like rendering or `requestAnimationFrame`), so the browser is the most reliable environment.

## Baseline Case: Pure Synchronous Execution

Let's start with a simple `for` loop:

```javascript
console.log("sync start");

for (let i = 0; i < 1e9; i++) {}

console.log("sync end");
```

The code runs from top to bottom. The output is unsurprisingly:

``` plaintext
sync start
sync end
```

## Test 1: Can `setTimeout` Interrupt a Lo op?

Let's introduce an asynchronous mechanism with `setTimeout`:

``` javascript
console.log("sync start");

// Schedule asynchronous callback with setTimeout
setTimeout(() => {
  console.log("timeout fired");
}, 0);

for (let i = 0; i < 1e9; i++) {}

console.log("sync end");
```

If `setTimeout` could interrupt, we would see: 

```plaintext
sync start
timeout fired
sync end
```

But what actually happens is this:

```plaintext
sync start
sync end
timeout fired
```

The timer did not 'cut in': It waited until the loop finished running. 

## Test 2: Can Promises Interrupt?
Now let's try a `Promise`:

``` javascript
console.log("sync start");

// Schedule asynchronous callback with a Promise
Promise.resolve().then(() => {
  console.log("promise callback");
});

for (let i = 0; i < 1e9; i++) {}

console.log("sync end");
```

If Promises could interrupt execution, we would see: 

```plaintext
sync start
promise callback
sync end
```

But the observed behavior is:

```plaintext
sync start
sync end
promise callback
```

Even a resolved `Promise` does not interrupt synchronous execution. Once JavaScript starts running, it runs to completion. 

## Destroying the Wrong Mental Models

It's easy to imagine JavaScript like this:
> JavaScript is running, but timers or promises can interrupt it when they're ready

In other words, `setTimeout` fires when ready and `Promise` callbacks can cut in once resolved. 

This resembles signal handlers in C where a signal can interrupt a running program, jump to the handler function and then resume execution afterward. That is pre-emptive behavior where execution can be paused at arbitrary instruction boundaries and control temporarily transferred elsewhere. JavaScript does not behave this way.

We may also hold the mental model that: 
> Timers or promises run JavaScript on another thread.

In this model, JavaScript runs concurrently in multiple threads: The script is running on one thread; Timers run in a background thread; Promises resolve in another (or the same) background thread. If that were true, we would see interleaved console output.  

However, in both tests, there is no interruption nor interleaved output between `sync start` and `sync end` in the console. These tests force us to accept that JavaScript execution is not pre-emptive. When JavaScript starts executing a task, it continues until the call stack is empty. Only then can anything else run JavaScript. Asynchronous work waits and queues.

## But Where Does Asynchronous Work Wait?
JavaScript's behavior makes more sense when you realize that when you run JavaScript in the browser, you are not just running a language. You are running two cooperating systems: the JavaScript **Engine** and the JavaScript **Runtime Environment**. 

The engine (V8 in Chrome/Node, SpiderMonkey in Firefox, JavaScriptCore in Safari) parses and compiles code, manages memory and executes functions via the call stack. When we say "JavaScript runs", we are referring to the engine. It knows variables, functions and the call stack. It does **not** know timers, the DOM, HTTP requests nor rendering. 

Everything else is handled by the runtime (the browser or Node). For instance, the runtime provides web APIs (`setTimeout`, `fetch`, DOM events). Importantly, it also performs the asynchronous work _outside_ the engine and decides when JavaScript is allowed to run again. This is the missing link: 

> The engine executes. The runtime schedules. 

Let's revisit our first experiment: 

``` javascript
console.log("sync start");

setTimeout(() => {
  console.log("timeout fired");
}, 0);

for (let i = 0; i < 1e9; i++) {}

console.log("sync end");
```

While the loop is running, what is happening structurally?

``` plaintext
┌───────────────────────────────┐  ┌───────────────────────────────┐
│         CALL STACK            │  │         TASK QUEUE            │
├───────────────────────────────┤  ├───────────────────────────────┤
│ for loop                      │  │ timeout callback (waiting)    │
│ global script                 │  |                               | 
└───────────────────────────────┘  └───────────────────────────────┘
```

The `for` loop occupies the call stack. Even after the timer has expired, its callback doesn't interrupt the call stack. Instead, it waits in a queue managed by the runtime. The engine cannot run it (nor anything new) because the call stack is not empty. More broadly, the runtime schedules what the engine executes while the engine just executes whatever gets placed on the stack. 

## Introducing Tasks

When the runtime grants permission for the engine to execute JavaScript, that moment is an entry point into execution. This entry point or permission to run JavaScript is called a **task**. Examples include the initial script execution and the `setTimeout` callback. Once a task starts, JavaScript runs synchronously. Asynchronous mechanisms do not interrupt a task but instead schedules future tasks. 

No worries if this doesn't make complete sense yet. We will refine "task" in later articles. For now, this is enough.

## What This Sets Up

From this article, we have established:
- JavaScript runs synchronously inside a task
- Nothing can interrupt that execution
- Asynchronous mechanisms do not cut in - they schedule. 

But if asynchronous callbacks don't interrupt running code, how and when are they allowed to run? What exactly is a 'task'? Where are these queues? Who decides what runs next?

This is the subject of the next article. 