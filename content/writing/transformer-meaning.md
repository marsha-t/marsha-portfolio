---
title: "Where Does 'Meaning' Come From in a Transformer?"
summary: "Why does a CLS token come to represent an image? What makes a query a query, or a positional embedding positional? This article explores how architecture, objectives, and training give learned Transformer components their roles."
date: "2026-09-08"
year: 2026
featured: false
image: "/sunrise-default.svg"
tech: 
  - Neural Networks
  - Machine Learning
  - Transformers
# links:
#   - label: Medium
#     url: https://medium.com/@marshateo/
#   - label: Dev.to
#     url: https://dev.to/marshateo/
---

# Where Does “Meaning” Come From in a Transformer?

<div id="scroll-trigger">

_How I learned to think about CLS tokens, positional embeddings, queries, keys and values_

I've been learning about Vision Transformers, and it's been a ride. It's probably the densest architecture I've studied so far, and it seems loaded with components that border on the miraculous.
- There's the CLS token. We stick it in front of the patch embeddings, and somehow it comes to represent the image for classification. Very convenient.
- Then there are queries, keys and values. Every token produces all three, and together they determine which other tokens to pay attention to and what information to retrieve from them.
- And before any of that, we add positional embeddings to the patch embeddings, and now the model can account for where patches came from in the original image. Great!

The explanations always started with what these components represented. CLS represented the image. Queries looked for relevant information, keys identified what was available, and values carried the information itself. Positional embeddings represented where each patch came from. 

I understood the roles each component was supposed to play. But where did all this meaning come from? 
- What made the CLS token a representation of the image in the first place? 
- What made one projection a query and another a key, when they were constructed in almost exactly the same way? 
- Where was "position" actually encoded in a positional embedding?

The answer seemed to be: training. Backpropagation.

Okay. Backpropagation is amazing, but it isn't magic. It still didn't make sense to me why these parameters would represent the things they said they would.

Then something embarrassingly simple clicked: I had the explanatory direction backwards.

- A CLS token isn't first an image representation that we then decide to use for classification. We decide to use its final state for classification, and that creates pressure for it to become useful for classification.
- A query isn't first imbued with some property of "query-ness" and then placed into the attention equation. We put the output of one learned projection in the query position of that equation, and training specializes that projection for the role we've given it.
- And a learned positional embedding doesn't begin with "position" encoded somewhere inside its random numbers. We consistently use the parameter at a particular position, and training shapes its values according to what is useful when it is used there. 

The names describe the jobs we've given these parameters, not something inherent in their initial values.

</div>

## What Makes CLS an Image Representation?

The name makes this question surprisingly easy to overlook. It's called the _classification token_. Diagrams label it `[CLS]`. In a Vision Transformer used for image classification, its final CLS state is fed to the classifier and explanations tell us that it 'represents the image'. After seeing enough diagrams, I started to feel as though being an image-level representation is somehow a property of the token itself.

But CLS doesn't start that way. In the beginning of time, it is initialised randomly. There's nothing inherently image-like about it. how does this arbitrary vector end up representing the image?

The answer is obvious once stated, but it changed how I think about these architectures: We use its final state for classification, so training has reason to make that state informative about the image.

I had been reasoning in the direction of the forward pass: CLS gathers information from the image,  becomes an image representation, and then we use that representation for classification.

But I found it more useful to reason backward from the loss. At the end of a Vision Transformer used for classification, we do roughly this:

$z_{\text{CLS}} \rightarrow \text{classifier} \rightarrow \text{prediction} \rightarrow \text{loss}$

The classifier only gets the final CLS representation. That means if the CLS representation is useless for say, distinguishing a dog from a cat, the network has a problem. Then the familiar sequence follows: A poor prediction produces a high loss; backpropagation follows; parameters involved get changed. Over many training examples, this puts pressure on the network to make the final CLS representation useful for the classification task. 

And “useful” doesn't have to be a rich, general-purpose representation of ‘the image.’ It doesn't necessarily mean that CLS develops a neat, human-readable summary of the image—two ears, four legs, big eyes, and so on. It simply encodes features that help the classifier distinguish the classes it is being trained on. As classification improves, we describe CLS as an “image representation,” but more precisely, it is a representation shaped around whatever information about the image is useful for classification.

So it isn't that: $\text{CLS represents the image} \rightarrow \text{therefore we classify using CLS}$

It is closer to: $\text{we classify using CLS} \rightarrow \text{training makes CLS useful for classification}$

But making classification depend on CLS isn't enough. Information about the image also needs a way to reach it. By letting CLS participate in self-attention alongside the patch tokens, the architecture gives it a pathway to gather and consolidate information from them.

The architecture has not told CLS what an image is. Instead, it has done two simpler things: made successful classification depend on the final state of CLS, and given CLS access to information that could help it succeed. Training does the rest: the loss provides the pressure; backpropagation communicates that pressure through the network; the parameters controlling how CLS interacts with the patches are gradually adjusted. The architecture assigns the role. Training learns the content.

## Where Is the Position in a Positional Embedding?

Once I noticed this, I realized I had been making essentially the same mistake with learned positional embeddings. When I first came across them, I kept wondering where the position was actually encoded. What about the embedding for position 1 made it mean ‘position 1’?”

Then came the explanation that they were initialised randomly, just like any other learned parameter. At initialisation, those numbers contain nothing inherently position-related. So what eventually makes one of those arbitrary vectors the embedding for position 1?”

Nothing in the vector itself initially says ‘position 1.’ It becomes the position-1 embedding because we consistently add that same learned vector to the token occupying position 1. That repeated association gives the parameter its role. Training then shapes its values according to what is useful for a parameter that is always used there. The parameter doesn't eventually come to mean 'position 1'. Rather, its learned effects become useful given that it is always injected at position 1.

The architecture created the association; training shaped the values around it:

- **Architecture**: This is the parameter that will always be used at position 1.
- **Training**: Given that role, what values would actually be useful?

## What Makes a Query a Query?

The equations for queries, keys and values look remarkably similar:

$$Q=XW_Q,\quad K=XW_K,\quad V=XW_V$$

We take the same token representations $X$ and pass them through three learned linear projections. When I first encountered this, I kept wondering: what actually makes one of these a query and another a key? How does $W_Q$ know that it is supposed to learn "queries", while $W_K$ learns "keys"?

Looking only at these projection equations didn't answer the question. They're just different learnable matrices, initialized independently and trained through gradient descent. 

The difference only becomes visible when we look at what happens to their outputs next. You can't tell why $Q$ is a query by looking at $Q=XW_Q$; you have to follow $Q$ in the attention computation:

$$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Although $Q$, $K$, and $V$ are produced in essentially the same way, their outputs occupy different places in the attention computation. $Q$ and $K$ jointly determine the attention scores, but occupy different sides of the relationship: a token's query is compared against the keys of the tokens it might attend to. $V$ has a more obviously different role: once the attention weights have been calculated, those weights are used to combine the value vectors.

That's what makes $Q$ the query here: not anything inherent in the numbers produced by $W_Q$, but the fact that we consistently use its output in the query position of this computation.

As a result, changing each projection can have different consequences:

- If changing $W_Q$ would improve which other tokens a token attends to, training can adjust $W_Q$.
- If changing $W_K$ would improve which tokens receive attention from other tokens, training can adjust $W_K$.
- If changing $W_V$ would improve the information that gets passed along under those attention weights, training can adjust $W_V$.

The loss reflects those different consequences; backpropagation computes the corresponding gradients; the optimizer adjusts the parameters. Over training, the three matrices specialize.

I had been thinking:

$$\text{This is a query} \rightarrow \text{therefore we use it as a query}$$

But the more useful explanatory direction is:

$$\text{We use this projection as the query} \rightarrow \text{training makes it useful in that role}$$

The same applies to keys and values.

## Maybe the Names Are Part of the Problem

I think some of my confusion came from the names being too good: _Classification token_, _Positional embedding_, _Query_, _Key_, and _Value_. In the simpler models I'd studied, I hadn't encountered names that seemed to carry quite so much meaning.

These names are useful shorthand, but they can make it sound as though the concept described by the name is somehow an inherent property of the numbers:
- A CLS vector sounds like a vector that intrinsically contains classification-related information.
- A positional embedding sounds like a vector that intrinsically contains a position.
- A query sounds like something that intrinsically asks a question.

The names describe the roles we have arranged for these components to play, not some intrinsic meaning carried by the numbers themselves. The distinction feels obvious once stated. Unfortunately, it wasn't obvious to me while learning the architecture.

## How This Changed the Way I Learn Architectures

I also realized that part of my difficulty came from how I respond when I don't understand something. My instinct is to stop there and keep digging until the confusion is resolved. If I've just been introduced to a positional embedding and I don't understand where the ‘position’ comes from, moving on feels like building on top of something I don't understand. 

But sometimes I had been trying to answer questions before I'd even seen the part of the architecture that made them answerable. You can't fully understand why $Q$ is a query from $Q=XW_Q$ alone; you have to follow $Q$ into the attention computation. Sometimes understanding an earlier component requires seeing more of the computation and how it connects to the loss, not staring harder at the component itself.

So when I come across a new learned component in an architecture, my first question is no longer just, 'What does this represent?' A better first question is: 'What is this used for?'. Of course, that is now followed by: 

- Where does it enter the computation?
- What can influence it?
- What can it influence?
- Where does its output eventually go?
- Which loss depends on that output?
- What information would make it useful for minimizing that loss?
- Does the architecture provide a pathway for that information to reach it?

So instead of accepting that 'CLS represents the image' as the explanation, I now ask "What about this architecture and objective allows and encourages a useful image representation to emerge at CLS?"

None of this is a new result about Transformers. It's closer to a correction in how I had been thinking about them. I had been looking for meaning inside the components themselves, when I should also have been looking at the larger system around them: where the architecture puts them, what information can reach them, what they can affect, and what the objective rewards.

If you've ever looked at a Transformer diagram and had the uncomfortable feeling that terms like _CLS token_ or _positional embedding_ explained what something was doing without quite explaining why those particular numbers should ever come to mean that, this might be the missing distinction:

- The name describes the role we gave it.
- The architecture determines how it can participate.
- The objective gives it something to become useful for.
- Training determines what it actually learns.
