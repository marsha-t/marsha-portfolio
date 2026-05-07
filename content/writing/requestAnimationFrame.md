---
title: "requestAnimationFrame: The Missing Scheduling Layer"
summary: "If rendering only happens at certain moments, how do you run code at the right time? This article introduces requestAnimationFrame as the missing scheduling layer."
date: "2026-05-07"
year: 2026
featured: true
image: "/sunrise-default.svg"
tech: 
  - JavaScript
# links:
#   - label: Medium
#     url: https://medium.com/
#   - label: Dev.to
#     url: https://dev.to/marshateo/
---

<p className="mt-4 text-sm text-[var(--text-subtle)] italic">
  This article is part of a series on the JavaScript event loop.
  <a className="underline text-[var(--text-subtle)] hover:text-[var(--text-hover)]" href="/writing/javascript-event-loop-landing">
    View all articles
  </a>
</p>

# `requestAnimationFrame`: The Missing Scheduling Layer

<div id="scroll-trigger">

In the [last article](/writing/rendering), we established that:
> The browser will not render while a macrotask is running nor while microtasks are draining.

Instead, rendering only happens at stable boundaries. But this creates a new problem: If rendering only happens at specific boundaries, how do we run code **just before** a render? If we want smooth animation, frame-aligned updates, or visual state that reflects the latest input, we need something that runs once per frame right before the browser renders. 

That is the scheduling gap that `requestAnimationFrame` fills.

</div>

## Running the Experiments

These experiments rely on the browser’s rendering behaviour.

1. Create a simple HTML file with the following content:
   ```html
   <div id="box">Initial</div>
   ```
2. Open the file in your browser
3. You can run all code snippets in this series by pasting them into the browser console.

These examples will not work in Node.js because they depend on the DOM and browser rendering.

## The Problem Before `requestAnimationFrame`

Developers originally faced a challenge: 
> How do I animate smoothly without freezing the UI?

We may run a naive loop like this where we want `update()` to advance state and `render()`  to mutate the DOM or canvas:

``` javascript
let gameRunning = true;

function update() {
  console.log("update");
}

function render() {
  console.log("render");
  const box = document.getElementById("box");
  box.textContent = `Updated at ${new Date().toLocaleTimeString()}`;
}

while (gameRunning) {
  update();
  render();
}
```

This will freeze your browser. Be prepared to close the browser tab after running this. 
This code completely blocks rendering. Since the call stack never empties, the browser never regains control and no rendering can occur. The page never updates.  

So developers sliced work into smaller chunks to allow for breathing space for the browser to render:

``` javascript
function update() {
  console.log("update");
}

function render() {
  console.log("render");
  const box = document.getElementById("box");
  box.textContent = `Updated at ${new Date().toLocaleTimeString()}`;
}

function loop() {
  update();
  render();
  setTimeout(loop, 16); // Use setTimeout() to chunk work
}
loop()
```

While this doesn't freeze the browser, be prepared to refresh the browser tab after running this. 

Now, the page renders the updates (the time shown on the page updates) to the `box` content. Since most screens refresh at 60 Hz, 16 ms (1000 ms / 60 Hz) seemed like the right delay. This allowed the stack to clear between iterations so that the browser could render. 

But this was still guesswork.

But this approach was not without its problems. First, timers are minimum delays, not guarantees. The callback may run for 20ms, 30ms or later.  Also, if the callback took longer than 16ms, we would miss frames and accumulate jitter and drop frames. Consequently, the callback may run before or after the render.

Fundamentally, rendering is framed-based while timers are time-based, and therefore do not know when the browser is about to render. 

## Enter `requestAnimationFrame`

`requestAnimationFrame` solves exactly this problem:

``` javascript
function update() {
  console.log("update");
}

function render() {
  console.log("render");
  const box = document.getElementById("box");
  box.textContent = "Updated at " + new Date().toLocaleTimeString();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

This also doesn't freeze the browser but be prepared to refresh the browser tab after running this. 

As before, the page renders the updates on the page. However, unlike timers, this runs before rendering. This sounds great but where exactly does it fit in the event loop model? Let's find out. 

## Test 1: Does `requestAnimationFrame` Cut Ahead of Microtasks?

If `requestAnimationFrame` runs just before rendering, it must not violate our previous rules:

```javascript
Promise.resolve().then(() => {
  console.log("microtask");
});

requestAnimationFrame(() => {
  console.log("raf");
});
```

The output in the console would be:

```plaintext
microtask
raf
```

As established, the browser does not render while microtasks are pending. Microtasks still run first and `requestAnimationFrame` does not change that.

## Test 2: Is `requestAnimationFrame` Just Another Task?

If `requestAnimationFrame` were simply another macrotask, it would behave like `setTimeout` and follow te ordering of tasks:

```javascript
console.log("start");

setTimeout(() => {
  console.log("timeout");
}, 0);

requestAnimationFrame(() => {
  console.log("raf");
});

console.log("end");
```

In practice, you will often see the following in the console:

```plaintext
start
end
timeout
raf
```

However, you may also see:

```plaintext
start
end
raf
timeout
```

The ordering is not guaranteed. Even if your environment consistently shows one ordering, the key point is that the model does not enforce it. The browser is allowed to process another task first, or perform a render before continuing with tasks. Because of this, there is no fixed ordering between `setTimeout` and `requestAnimationFrame`.

This might seem surprising. If `requestAnimationFrame` were just another macrotask, we would expect it to follow a consistent ordering relative to `setTimeout`. But it doesn’t, suggesting that `requestAnimationFrame` is not part of the task queue at all. Instead, it runs during the browser’s rendering phase, which is scheduled separately from tasks.

## Test 3: Do Microtasks Inside `requestAnimationFrame` Run Before Paint?

What if `requestAnimationFrame` also created microtasks? 

```javascript
requestAnimationFrame(() => {
  const box = document.getElementById("box");

  box.textContent = "Frame start";

  Promise.resolve().then(() => {
    box.textContent = "Microtask update";
  });
});
```

The typical output is for the page to show "Microtask update"

When the `requestAnimationFrame` callback runs, the DOM updates and a microtask is queued. The `requestAnimationFrame` callback completes and microtasks drain. Only then can rendering occur.

Even inside `requestAnimationFrame`, microtasks must drain before rendering.

## What `requestAnimationFrame` Actually Guarantees

`requestAnimationFrame` guarantees that the callback runs before the browser's rendering. It runs at most once per frame and is aligned to the display's actual refresh rate, regardless of whether it is 60Hz or 120Hz. It pauses automatically in background tabs and skips frames when the browser is busy.

## The Complete Ordering

We can now state the model: 

1. Macrotask
2. Drain microtasks
3. `requestAnimationFrame` callbacks
4. Drain microtasks
5. Render

This is the complete scheduling turn. Rendering is not part of task queue but is gated by it. `requestAnimationFrame` is the only public API designed to hook into that pre-render phase. 

## What This Prepares Us For Next

Now that we understand this structure, what do we do with it?

In the final article of this series, we move from mechanism to consequence: 

What happens when a macrotask runs too long?
What happens when microtasks never stop?
Why does the UI freeze?
Why are some updates never visible?
Why do we sometimes need cleanup guards?

One we understand who gets to run and when, we can reason about performance, responsiveness and architectural trade-offs with precision. 

This is where we go next. 