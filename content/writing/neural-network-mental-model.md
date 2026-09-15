---
title: "Learning Neural Networks Through Mental Models"
summary: "How ideas like function approximation, representation learning, optimisation and computational graphs finally made deep learning feel coherent"
date: "2026-09-05"
year: 2026
featured: false
image: "/sunrise-default.svg"
tech: 
  - Neural Networks
  - Machine Learning
  - Artificial Intelligence
links:
  - label: Code Like A Girl · Medium
    url: https://medium.com/code-like-a-girl/learning-neural-networks-through-mental-models-987640973005
  - label: Dev.to
    url: https://dev.to/marshateo/learning-neural-networks-through-mental-models-2nm7
---
# Learning Neural Networks Through Mental Models

For a while, I understood neural networks mostly mechanically. Data entered the network, passed through layers, and eventually produced a prediction. Loss was calculated, gradients computed and weights updated. I could follow the sequence but the pieces still felt strangely arbitrary. Why this structure? Why did stacking layers make a network so powerful? Why were activation functions so important? I understood much of what the network was doing step by step, without feeling like I understood the network as a whole.

Then I watched <a href="https://www.youtube.com/watch?v=CqOfi41LfDw&list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1&index=2" target="_blank" rel="noopener noreferrer">Josh Starmer's StatQuest video</a> on the key ideas underlying neural networks. He presented neural networks as systems that sculpt functions. Instead of following data through layers, I could zoom out and picture what those transformations were collectively constructing. That shift helped immediately.

Then I got greedy and started looking for other ways to think about neural networks. By the time I was done, I realised that different mental models made different questions easier to answer. Some let me zoom out and collapse the network into one idea; others broke it into smaller transformations or computations. Some connected neural networks to ideas I already understood, while others made me reinterpret concepts I thought I understood already. 

Together, they made neural networks feel much less mysterious. Learning to switch between these mental models was the breakthrough I needed.

## Neural Networks as Stacks of Transformations

The mechanical understanding I started with was essentially viewing neural networks as a stack of transformations.

Each layer progressively transforms the data before passing it on:

$$\qquad x \rightarrow h_1 \rightarrow h_2 \rightarrow \dots \rightarrow y$$

where:
- $x$ is the input
- $h_1, h_2, \dots$ are intermediate hidden representations
- $y$ is the final output

This was probably my default mental model before I knew to call it one. It made the forward pass easy to follow: the input is transformed step by step until the network produces an output.

For an image model, for example, this is often described as a progression from simpler patterns to increasingly complex ones:  

$$\qquad pixels \rightarrow edges \rightarrow textures \rightarrow shapes \rightarrow objects$$

Even for tasks like predicting customer churn, the same principle applies. The network progressively transforms raw features like age, transaction history and engagement metrics into intermediate features that eventually produce a prediction.

This perspective helps explain why neural networks have depth at all. Each layer can transform the output of the previous layer, allowing complex computations to be built gradually through composition.

Crucially, these transformations depend on nonlinear activation functions. Without nonlinearity, multiple stacked layers would collapse mathematically into a single linear transformation, no matter how deep the network became. Depth becomes powerful because the network can repeatedly apply and compose nonlinear transformations. Some transformations are easier to express gradually than all at once. 

At the same time, this perspective kept my attention on the individual steps. I didn’t have a clear picture of what all those transformations were collectively doing. I needed to zoom out.

## Neural Networks as Function Approximators

Function approximation gave me that zoomed-out view.

I was already comfortable thinking about models like linear and logistic regression as functions. Given some inputs, these models learn a mapping that produces an output. A neural network can be understood in exactly the same way:

$$\qquad f(x) = \text{some complicated mapping from inputs to outputs}$$

This stripped away much of the apparent mystery surrounding neural networks. Underneath all that machinery, the network was still doing something familiar: learning a function that maps inputs to outputs, just like the other models I already understood. The difference was that neural networks could learn far more flexible and expressive functions.

Function approximation helped me see what all those transformations were collectively constructing.

But how do these complex functions emerge from simple neurons? 

## Neural Networks as Function Sculptors

I already understood abstractly that stacking layers with nonlinear activation functions allowed neural networks to model increasingly complex relationships. But I couldn’t visualise it.

In Josh Starmer's <a href="https://www.youtube.com/watch?v=CqOfi41LfDw&list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1&index=2" target="_blank" rel="noopener noreferrer">explanation</a>, each neuron works with a given activation function. The weights and biases slice, flip and stretch that same activation function into new shapes. As a result, each neuron applies a small nonlinear transformation to its input. These small transformations and shapes are stitched together across layers to create yet new shapes. A complex function emerges from many local transformations. 

For a single input, we can write a neuron's transformation as:

$$\qquad h(x)=\sigma(wx+b)$$

The activation function $\sigma$ provides the basic shape, while the weight $w$ and bias $b$ change how that shape is positioned and oriented relative to the input:
- Changing the magnitude of the weight stretches or compresses the function.
- Changing its sign can flip its orientation.
- Changing the bias shifts where the activation occurs.

Each neuron can therefore produce a different variation of the same basic activation function. The network can then combine these variations to construct something much more complex.

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img src="/writing/neural-network-mental-model/function-sculptor-light.svg" />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
      <img src="/writing/neural-network-mental-model/function-sculptor-dark.svg" />
  </div>
  <figcaption>
    Rather than learning one giant function directly, neural networks build complex behaviour by combining many smaller nonlinear transformations
  </figcaption>
</figure>

With Softplus, a neuron can contribute smooth bends at different locations and scales. With ReLU, neurons contribute piecewise linear changes, with different neurons introducing change at different points. Deep networks combine huge numbers of these simple transformations, progressively sculpting a much more complex function.

Don't take my word for it. Watch the video. His animations (and the noises he makes while calculating) make it worth your time. 

What clicked for me was that the network didn’t need any individual neuron to represent a complicated function. Each neuron could contribute something simple. Complexity emerged from composing and combining many of those simple transformations.

Function approximation had helped me zoom out and see the network as one flexible function. Function sculpting let me zoom in just enough to see how that flexibility could be constructed.

## Neural Networks as Representation Learners

One thing that distinguishes neural networks from many of the models I was used to working with is that they can also learn how to represent the input itself.

In my previous experience with econometrics and causal inference, deciding how to represent a problem happened largely before fitting the model. I thought carefully about which variables to include, what they measured, and how they should be transformed. The model then learned from the representation I had given it. More broadly, traditional machine learning often involved substantial feature engineering: a classical image classifier might be given manually designed edge or texture features, while a churn model might use a constructed engagement index based on the number of logins in the past month, changes in spending, and periods of inactivity. A large part of traditional machine learning involved deciding which features might matter before the model even began learning.

With neural networks, deciding how to represent the problem doesn’t happen entirely before training. The network also learns useful ways of representing the data. The hidden states in the stack of transformations aren’t just intermediate _values_ (outputs of one transformation that became the inputs to the next). Instead, each $h$ is also a new intermediate _representation_ of the original input:

$$\qquad x \rightarrow \underbrace{h_1 \rightarrow h_2 \rightarrow \dots}_{\text{learned representations}} \rightarrow y$$
 
These representations are still just vectors of numbers. We do not explicitly tell individual dimensions what concepts they should represent. Instead, training adjusts the network's weights so that the representations produced by its hidden layers become useful for the final task. Structure in those representations therefore emerges as part of learning the task itself. This is why neural networks are often described as systems for representation learning.

This applies even to relatively simple neural networks. For example, a churn model might start with separately observed variables such as login frequency, spending and time since last activity. A hidden representation can combine information across these variables into patterns that are more useful for predicting churn. This contrasts with explicitly constructing an “engagement” index before fitting the model: something capturing aspects of engagement may emerge within the network's hidden representation because it is useful for predicting churn. 

That does not necessarily mean that the network dedicates one hidden unit to a human-interpretable concept like “engagement.” The useful representation may instead be distributed across many dimensions.

In a larger language model, the learned representations can encode more complex semantic relationships. The scale and complexity differ, but both are forms of representation learning.

I had been thinking of learning primarily as learning a mapping from my representation of the problem to the target. Representation learning made me realise that the representation itself could be part of what was learned.

## Neural Networks as Optimisation Systems

The earlier mental models focused largely on what neural networks can represent:
- what kinds of functions they can express
- how layers transform data
- what hidden representations may emerge

But being able to represent a useful function doesn't mean the network can actually learn it.

Unlike simpler models such as linear regression, neural networks generally do not have neat closed-form solutions for their parameters. Instead, these parameters are learned iteratively through optimisation. 

At first glance, optimisation can seem like a secondary implementation detail, merely the mechanism through which weights get updated during training. But from the earlier perspectives, I had mostly been asking whether a network was capable of representing a useful function. Optimisation asks a different question: even if useful parameters exist, can training actually find them?

This turns out to be central to understanding modern deep learning. Neural networks were already highly expressive decades ago, but gradient-based optimisation struggled to reliably train deep networks: gradients may vanish or explode, training can become unstable, and convergence can be highly sensitive to choices such as the learning rate and initialisation.

A large amount of progress in deep learning can be viewed through this lens. Activation functions such as ReLU helped alleviate some gradient problems; initialisation schemes helped signals and gradients remain better behaved across layers; learning-rate schedules changed how aggressively optimisation proceeds during training; and optimisers such as Adam changed how parameter updates are calculated.

For me, this perspective also gave me another way to understand why activation functions matter:

- From the function-sculpting perspective, I had focused on the shapes different activation functions let the network construct. 
- From the optimisation perspective, I started asking what those activation functions do to gradients during training. Sigmoid and tanh can saturate, producing very small gradients in some regions, while ReLU often allows gradients to propagate more effectively. 

Activation functions shape the function the network learns. On top of that, by affecting gradient flow, they also shape how easily those functions can be learned.

This perspective also changed how I thought about architecture:
- From my stack-of-transformations perspective, residual connections seemed strange. If each layer was supposed to progressively transform the representation, why let an earlier representation bypass a block and add it back later?
- From an optimisation perspective, the question changes. Residual connections provide identity paths through deep networks, helping information and gradients flow and allowing blocks to learn changes to an existing representation. What had looked awkward from one mental model made much more sense from another.

This perspective helped explain why so much of deep learning is about more than designing expressive architectures. It is also about making those architectures trainable.

## Neural Networks as Computational Graphs

The optimisation perspective explains why gradients matter. But how are the gradients computed? 

Function approximation taught me to think of a neural network as one enormous function. But trying to imagine its derivatives gave me a headache. Differentiating an enormous, complicated function with millions of parameters sounded overwhelming.

The computational graph perspective reverses that. It breaks this gigantic function back into the small operations that produce it.

$$\qquad f(x) =f_3(f_2(f_1(x)))$$

This stack of transformations, $x \rightarrow h_1 \rightarrow h_2 \rightarrow \dots \rightarrow y$, is also a sequence of dependencies:
- During the forward pass, values move through the graph step by step: inputs are transformed; activations are computed; predictions are produced; and loss is calculated.
- During the backward pass, those same dependencies let us trace how each earlier computation contributed to the final loss.

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img src="/writing/neural-network-mental-model/computational-graph-light.svg" />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
      <img src="/writing/neural-network-mental-model/computational-graph-dark.svg" />
  </div>
  <figcaption>
    The computational graph perspective decomposes a neural network into smaller computations. During the forward pass, values flow through the graph to produce a prediction and compute the loss. During the backward pass, gradients flow back through the same graph using the chain rule.
  </figcaption>
</figure>

Consider this tiny sequence of operations:

$$\qquad a = wx$$

$$\qquad z = a + b$$

$$\qquad y = \sigma(z)$$

To understand how changing $w$ affects $y$, we do not need to treat the entire computation as one giant derivative. The chain rule lets us break the derivative into local pieces:

$$\qquad \frac{\partial y}{\partial w} = \frac{\partial y}{\partial z} \frac{\partial z}{\partial a} \frac{\partial a}{\partial w}$$

Gradients aren’t computed as one enormous derivative. Each operation only needs information about its own local derivative with respect to its own inputs. Backpropagation works backwards through the computational graph, stitching these local derivatives together according to the chain rule. The same principle scales from this tiny example to networks containing enormous numbers of operations and parameters.

Function approximation helped me see the network as one enormous function. The computational-graph perspective showed me how that enormous function could still be differentiated and trained through local computations.

# Conclusion

Neural networks became much easier to understand once I stopped searching for a single explanation.

What I initially thought of as the way a neural network worked, i.e., data moving through a stack of layers, was really just one useful perspective. This same system could be viewed at very different scales. I could zoom out and view the system as a single function, or zoom in and think about individual transformations and computations. I could think about what representations the network was learning, or switch questions entirely and ask whether optimisation could actually find them.

What surprised me most was that a mental model that made one question easier could make another harder to reason about:

- Thinking of a neural network as one enormous function connected it to more familiar machine learning models but made the idea of differentiating it overwhelming. Instead, breaking that same function into a computational graph made backpropagation much easier to understand.

- Residual connections were initially confusing when I viewed networks as stacks of transformations. However, from an optimisation perspective, their purpose made more sense.

No single perspective fully explains neural networks. Each lens makes certain aspects of the same system easier to understand. The real shift was learning which mental model to reach for when something stopped making sense.

## The Mental Models

| Mental Model | Question | Main Insight |
|---|---|---|
| [Stack of Transformations](#neural-networks-as-stacks-of-transformations) | Why are there multiple layers? | Layers progressively reshape data into new representations. |
| [Function Approximation](#neural-networks-as-function-approximators) | What is the network fundamentally doing? | A neural network is ultimately learning a function from inputs to outputs. |
| [Function Sculpting](#neural-networks-as-function-sculptors) | How do simple neurons create complex functions? | Complex functions emerge from many simple nonlinear transformations. |
| [Representation Learning](#neural-networks-as-representation-learners) | What are hidden layers learning? | Neural networks learn useful internal representations of the input. |
| [Optimisation System](#neural-networks-as-optimisation-systems) | Why do so many design choices concern training? | Expressiveness isn’t enough; optimisation has to find useful parameters. |
| [Computational Graph](#neural-networks-as-computational-graphs) | How are gradients actually computed? | Derivative calculations can be decomposed into local derivatives stitched together by the chain rule. |
