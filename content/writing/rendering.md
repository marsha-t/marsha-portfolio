---
title: "Rendering Is a Browser Decision, Not a JavaScript One"
summary: "You updated the DOM. So why didn’t the screen change? This article explains why rendering is not triggered by JavaScript, but gated by it."
date: "2026-04-30"
year: 2026
featured: true
image: "/sunrise-default.svg"
tech: 
  - JavaScript
# links:
#   - label: Medium
#     url: https://medium.com/@marshateo/
#   - label: Dev.to
    # url: https://dev.to/marshateo/
---

<p className="mt-4 text-sm text-[var(--text-subtle)] italic">
  This article is part of a series on the JavaScript event loop.
  <a className="underline text-[var(--text-subtle)] hover:text-[var(--text-hover)]" href="/writing/javascript-event-loop-landing">
    View all articles
  </a>
</p>

# Rendering Is a Browser Decision, Not a JavaScript One

<div id="scroll-trigger">

You change the DOM.

You expect the screen to update.

It doesn’t.

Why?

In the earlier articles, we established three constraints:

1. JavaScript runs to completion.
2. Tasks form scheduling boundaries.
3. Microtasks must fully drain before moving on.

Now we add a fourth:
> The browser will not render while a macrotask is running nor while microtasks are draining.

</div>

## Rendering Is a Browser Decision

Up to this point in the series, we’ve focused on two pieces of the system:

1. The JavaScript engine, which executes code and manages the call stack.
2. The runtime, which provides the event loop and scheduling rules.

But neither of these is responsible for rendering.

Beyond the JavaScript engine and the runtime, the browser also contains a rendering engine — the subsystem responsible for layout and painting.

The engine executes your code.
The runtime manages when that code runs.
The rendering engine decides when the result becomes visible.

For simplicity, this article will refer to that rendering engine simply as the browser.

## The Rendering Misconception

When I first started learning JavaScript, I carried several mental models that felt reasonable: 
- DOM updates render immediately
- If I change the UI, the user will see it right away.
- The browser renders continuously at 60fps.

These felt natural because the screen often updates quickly. But they're incomplete: Rendering does not happen whenever the DOM changes. Instead, rendering happens only when there is a 'safe opportunity',  after the current macrotask finishes and the microtask queue is empty. 

Rendering is not triggered by DOM mutation. It is gated by scheduling boundaries. Let’s test that.

## Running the Experiments

These experiments rely on the browser’s rendering behaviour.

1. Create a simple HTML file with the following content:
   ```html
   <div id="box">Initial</div>
   ```
2. Open the file in your browser
3. You can run all code snippets in this series by pasting them into the browser console.

These examples will not work in Node.js because they depend on the DOM and browser rendering.

## Test 1: DOM Updates Inside One Macrotask

What happens when we have multiple DOM updates within the same macrotask? We may write something like the following, using a placeholder before the final string is ready:

```javascript
const box = document.getElementById("box");

box.textContent = "Temporary string";

for (let i = 0; i < 1e9; i++) {}

box.textContent = "Final string of Test 1";
```

We might worry that `"Temporary string"` would briefly appear before `"Final string"` is ready. But that doesn't happen. Phew!

Both updates occur inside the same macrotask and the browser refuses to render mid-task. It waits until the entire macrotask is finished, checks that there is no microtask in the queue and finally considers rendering. 

The intermediate DOM states never show. 

## Test 2: Microtasks Also Delay Rendering

What if the second update happens in a microtask instead? Would  `"Temporary string"` appear briefly?

```javascript
const box = document.getElementById("box");

box.textContent = "Temporary string";

Promise.resolve().then(() => {
  box.textContent = "Final string of Test 2";
});
```

Again, we only see `"Final string of Test 2"`. 

The initial macrotask runs and sets `"Temporary string"`. After the call stack is empty, the microtask runs immediately after to update the DOM to `"Final string"`. Only now does the browser get an opportunity to render. 

Microtasks delay rendering just like synchronous code does. 

## Test 3: Breaking Into a New Task Allows Paint

Now consider a timer callback:

```javascript
const box = document.getElementById("box");

box.textContent = "Temporary string";

setTimeout(() => {
  box.textContent = "Final string of Test 3";
}, 1000);
```

This time we may see `"Temporary string"`, followed by `"Final string of Test 3"` a second later.

Unlike the previous tests, we have now introduced a task boundary. The browser finishes the initial macrotask, drains microtasks (there are none here) and gets an opportunity to render. If it chooses to render, `"Temporary string"` becomes visible. 

Later, when the runtime schedules the timer's macrotask, the DOM updates to `"Final string"` and the next render will reflect this. 

Rendering is allowed at task boundaries. This does not mean that rendering is guaranteed between macrotasks; only that it can only happen there. 

## Why Rendering Waits

If the browser could render in the middle of a macrotask or in the middle of microtask draining, it could display half-updated DOM, inconsistent layout and/or partially computed state. 

Thankfully, with this constraint, the browser renders only stable states, where a macrotask has finished and the microtask queue is empty. There would be no partial work in progress and hence rendering is atomic with respect to JavaScript execution. 

## The Correct Mental Model

With these tests, we've shown that the browser does not render whenever the DOM changes. Instead:
> The browser renders only after JavaScript finishes its turn.

Here, a "turn" means the current macrotask completes and the microtask queue has been fully drained. 

Rendering is allowed only at those boundaries. This does not mean the browser renders after every turn, only that it cannot render during one. The rendering decision is gated by the same scheduling rules we’ve been building throughout this series.

## What This Prepares Us For Next

If rendering only happens at specific boundaries, a new question emerges: How do we write code that runs at the right moment?

`setTimeout` creates a new macrotask but it does not align with the browser's frame timing. Microtasks delay rendering but they do not schedule it. If we want smooth animation and responsive updates, we need a way to run code just before the browser renders the next frame. 

This is what `requestAnimationFrame` is design for. In the next article, we'll look more closely at how the browser's rendering cycle works and how to schedule work in harmony with it. 
