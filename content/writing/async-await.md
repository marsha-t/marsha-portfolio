---
title: "async / await: Pausing a Function Without Pausing JavaScript"
summary: "Does await pause your program or just your function? This article shows how await actually works."
date: "2026-04-25"
year: 2026
featured: true
image: "/sunrise-default.svg"
tech: 
  - JavaScript
links:
  - label: Medium
    url: https://medium.com/@marshateo/async-await-pausing-a-function-without-pausing-javascript-5e3e2a68f1f2
  - label: Dev.to
    url: https://dev.to/marshateo/async-await-pausing-a-function-without-pausing-javascript-3c0e
---

<p className="mt-4 text-sm text-[var(--text-subtle)] italic">
  This article is part of a series on the JavaScript event loop.
  <a className="underline text-[var(--text-subtle)] hover:text-[var(--text-hover)]" href="/writing/javascript-event-loop-landing">
    View all articles
  </a>
</p>

# `async` / `await`: Pausing a Function Without Pausing JavaScript

<div id="scroll-trigger">

In the [last article](/writing/microtasks), we established a precise rule:
> Once a macrotask finishes, JavaScript drains all microtasks before selecting the next macrotask.

Microtasks like Promises are continuations that must complete before the runtime moves on to the next macrotask. `async`/`await` is often described as syntactic sugar over Promises. If that's the case, we should already understand how `await` works. 

Let’s see.

</div>

## The Possible Mental Models

Before we look at any code, consider this question: When JavaScript reaches `await`, what actually happens? 

It's surprisingly easy to carry one of the following mental models (I certainly did when I first started learning JavaScript). Which of these feel right?

a. `await` blocks the entire program before the value resolves, like `sleep()` in C or C++ </br>
b. `await` pauses the function and immediately yields to the event loop, creating a new macrotask </br>
c. `await` splits the function and schedules the remainder as a microtask 

Pause for a moment. Pick one and we'll test it. 

## Running the Experiments

You can run all code snippets in this series by pasting them into the browser console.

While some examples work in Node.js, others rely on browser APIs (like rendering or `requestAnimationFrame`), so the browser is the most reliable environment.

## Test for Mental Model A (`await` Blocks)

Let's see if `await` pauses the entire program:

```javascript
async function test() {
  console.log("Inside test");
  await Promise.resolve();
  console.log("After await");
}

console.log("Before test");
test();
console.log("After test");
```

If `await` blocked the program, we would expect:

``` plaintext
Before test
Inside test
After await
After test
```

Instead, we observe that `After test` runs before `After await`:

``` plaintext
Before test
Inside test
After test
After await
```

It appears that `await` does not block JavaScript. Execution continues after calling `test()`. So whatever `await` does, it does not stop everything.

## Test for Mental Model B (`await` Yields)

Perhaps `await` pauses the function and immediately hands control back to the runtime for it to choose another macrotask:

```javascript
async function test() {
  console.log("Inside test");
  await Promise.resolve();
  console.log("After await");
}

setTimeout(() => console.log("timeout"), 0);

console.log("Before test");
test();
console.log("After test");
```

If `await` yielded control to the runtime and created a macrotask boundary, the timer might run first:

``` plaintext
Before test
Inside test
After test
timeout
After await
```

But it never does. We instead observe:

``` plaintext
Before test
Inside test
After test
After await
timeout
```

The continuation after `await` always runs before the timer. This matches the rule from the last article:
> Microtasks are drained before any macrotask is selected.

`await` does not create a macrotask.

## Mental Model C: The Only Survivor

So far, the only model consistent with every test is:
> When execution reaches `await`, the function pauses and the rest of the function is queued as a microtask.

When JavaScript reaches `await value`, the engine conceptually performs something like:
1. Convert value into a promise if it isn’t one already.
2. Wrap the rest of the function in a continuation.
3. Schedule the continuation as a microtask.
4. Return immediately to the caller.

The function simply splits at this point. This happens even if the value is already resolved:

```javascript
async function test() {
  console.log("Inside test");
  await 42;
  console.log("After await");
}

console.log("Before test");
test();
console.log("After test");
```

We still observe:

``` plaintext
Before test
Inside test
After test
After await
```

Even though `42` is not a promise, the remainder of the function runs later. 

`await` will also split the function however many times it appears in the function. Consider:

```javascript
async function test() {
  console.log("Inside test");
  await Promise.resolve();
  console.log("After first await");
  await Promise.resolve();
  console.log("After second await");
}

console.log("Before test");
test();
console.log("After test");
setTimeout(() => console.log("timeout"), 0);
```

Observed:

```plaintext
Before test
Inside test
After test
After first await
After second await
timeout
```

Each `await` causes the function to split with each `await` creating a new continuation that runs as a microtask. Both continuations run before the timer since the runtime drains microtasks fully before scheduling the next macrotask. 

That split results in a pause in the current `async` function. There is no other pause - not in the call stack, the event loop nor the entire program. 

With `await`, control immediately returns to the caller. That’s why this works:

```javascript
async function loadData() {
  await fetch("/data");
  console.log("done");
}

console.log("start");
loadData();
console.log("continue");
```

Output:

``` plaintext
start
continue
done
```

The function pauses and the program continues.

## `async`/`await` As Syntactic Sugar Over Promises

You may have heard that `async`/`await` is syntactic sugar over promises. That’s true, but only if we are precise what the sugar expands into. At its core, `await` is equivalent to calling `.then()` but with one addition. 

When JavaScript reaches `await value`, it registers a continuation like `.then()` would but it also splits the current function at that point and schedules the remainder to run later as a microtask. 

With raw `.then()`, you manually place the continuation inside a callback. With `await`, the language automatically pauses the function, preserves its local variables and control flow and resumes it later in the microtask queue. It is a function split backed by the microtask system. 
> `await` is `.then()` plus structured function splitting and microtask resumption. 


## What About `async`?
So far, we’ve focused entirely on `await`. But every example also had `async`. If `await` is responsible for splitting the function, what does `async` actually do? Let’s see.

```javascript
async function test() {
  return 42;
}

async function main() {
  const p1 = test();
  console.log("Without await:", p1);

  const p2 = await test();
  console.log("With await:", p2);
}

main();
```

The output: 

``` plaintext
Without await: Promise { 42 }
With await: 42
```

The `main()` function runs synchronously until the first `await`. When `test()` is called without `await`, there is no pause and no microtask. The body of `test()` runs immediately. The only difference is that `test()` returns a `Promise`. 

`async` on its own does not introduce asynchronous work. Instead, it changes the return type of the function: `test()` returns a `Promise`, even if it completes synchronously.  

When `test()` is called with `await`, something different happens. The call to `test()` still runs immediately, and it still returns a `Promise`. But now `main()` pauses at the `await`. The remainder of `main()` is wrapped into a continuation and scheduled as a microtask. When that microtask runs, the `Promise` returned by `test()` is unwrapped and its resolved value becomes the value of the `await` expression. 

Without `await`, `p` is a `Promise`. With `await`, `p` is the resolved value of that `Promise`. 

## The Correct Mental Model

We can now separate the two keywords clearly:
- `async` changes what the function returns.
- `await` changes how the function executes.

If there is no `await`, an `async` function can run entirely synchronously. If there is an `await`, the function splits and resumes as a microtask continuation.

Once you see this, `async`/`await` stops being mysterious. It becomes a thin layer over the microtask system.

## What This Prepares Us For Next

We now understand:
- Macrotasks are chosen one at a time.
- Microtasks drain completely.
- `Promise` callbacks are continuations.
- `await` creates microtask continuations.

There is one more piece missing:
> When does rendering happen?

To answer that we need to look beyond JavaScript execution and into the browser's frame lifecycle. That is the next layer of the event loop, and that's where we go next. 