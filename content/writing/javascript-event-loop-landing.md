---
title: "JavaScript Event Loop Series: Building the Event Loop Mental Model from Experiments"
summary: "JavaScript’s event loop often feels magical—until it breaks your expectations. This series builds a precise mental model of how JavaScript actually runs, from tasks and microtasks to rendering and real UI behavior."
date: "2026-04-06"
order: 1
year: 2026
featured: true
image: "/sunrise-default.svg"
tech: 
  - JavaScript
links:
  - label: Medium
    url: https://medium.com/@marshateo/javascript-event-loop-series-building-the-event-loop-mental-model-from-experiments-fc1accf31223?postPublishedType=repub
  - label: Dev.to
    url: https://dev.to/marshateo/javascript-event-loop-series-building-the-event-loop-mental-model-from-experiments-4d8i
---

# JavaScript Event Loop Series: Building the Event Loop Mental Model from Experiments

<div id="scroll-trigger">

I wrote this series because JavaScript has many "asynchronous" mechanisms (`await`, `setTimeout`, `Promise`, `requestAnimationFrame`) that look similar but behave very differently.

At first, I assumed they were interchangeable but that assumption quickly broke when I started debugging: 
* Why `setTimeout(..., 0)` doesn’t "run immediately"
* Why `await` pauses a function but doesn’t freeze the page
* Why DOM updates sometimes don’t show up when you expect
* Why some "async" code still blocks rendering

These behaviours only make sense with the right mental model. This series builds that model by experimenting with small code snippets. 

The core idea is simple:
> JavaScript runs to completion inside a task, and nothing interrupts it. 

From there, we layer in:

* **macrotasks** (what a task actually is),
* **microtasks** (why Promises run first), 
* **`async`/`await`** (pausing a function without pausing JavaScript), 
* **rendering** (why the screen doesn’t update mid-turn), 
* **`requestAnimationFrame`** (the missing pre-render scheduling layer), and finally, 
* what this means for **real UI code**. 

</div>

## Who this is for

This series is for you if you’ve ever felt that JavaScript async behavior is:

* predictable in practice, but unclear in theory  
* "working" … until it suddenly doesn’t  
* full of rules you remember, but don’t fully understand  

You don’t need prior knowledge of the event loop. The goal is to build a mental model you can use to reason about behavior — not just memorize it.

## How to read this series

Each article builds on the previous one. You *can* jump around, but the payoff is highest if you go in order.

* If you want the **core mental model quickly**: read Articles 1–3  
* If you care about **rendering and UI behavior**: Articles 5–7 connect the model to what you see on screen  
* If you just want answers: each article is self-contained, but the full model only emerges across the series

## The articles 

Here’s how the model unfolds:

**1) Before the Event Loop: What Actually Runs JavaScript**

Why doesn’t `setTimeout` interrupt your code? This article breaks the illusion: JavaScript runs synchronously, and async APIs don’t interrupt. Instead, they schedule.

Read it [here](runtime-mental-model). 

**2) Macrotasks: What a Task Actually Is**

If nothing can interrupt JavaScript, when does anything else run? This article reframes tasks as entry points into execution, not chunks of work.

Read it [here](macrotasks). 

**3) Microtasks: Why Promises Run First**

Why do Promises always run before `setTimeout`? This article reveals microtasks as mandatory continuations that must run before JavaScript moves on.

Read it [here](microtasks). 

**4) `async` / `await`: Pausing Functions Without Pausing the World**

Does `await` pause your program or just your function? This article shows how `await` actually works.

_Coming soon_

**5) Rendering Is a Browser Decision, Not a JavaScript One**

You updated the DOM. So why didn’t the screen change? This article explains why rendering is not triggered by JavaScript, but gated by it.

_Coming soon_

**6) `requestAnimationFrame`: The Missing Scheduling Layer**

If rendering only happens at certain moments, how do you run code at the right time? This article introduces `requestAnimationFrame` as the missing scheduling layer.

_Coming soon_

**7) What the Event Loop Means for Real UI Code**

Why do UIs freeze, skip updates, or feel laggy? This article connects the event loop to real-world UI behavior and shows how to work with the browser, not against it.

_Coming soon_

## The mental model

This is the model everything in this series builds toward:

1. The browser (runtime) starts a macrotask  
2. JavaScript runs synchronously until the call stack is empty  
3. The runtime drains all microtasks  
4. The browser runs any `requestAnimationFrame` callbacks  
5. Microtasks drain again (if any were queued during `requestAnimationFrame`)  
6. Only then can rendering happen  


## Continue the Conversation

If you want to discuss edge cases, counterexamples, or how this interacts with real applications, I’m always happy to chat.
