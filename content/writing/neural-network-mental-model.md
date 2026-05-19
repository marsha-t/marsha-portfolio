---
title: "Learning Neural Networks Through Mental Models"
summary: "Neural networks started making much more sense once I began viewing them through multiple mental models rather than isolated concepts. This article explores the different perspectives that helped deep learning feel less mysterious and more coherent."
date: "2026-05-19"
year: 2026
featured: false
image: "/sunrise-default.svg"
tech: 
  - Neural Networks
  - Machine Learning
# links:
#   - label: Medium
#     url: https://medium.com/@marshateo/
#   - label: Dev.to
#     url: https://dev.to/marshateo/
---
# Learning Neural Networks Through Mental Models

For a while, neural networks felt like disconnected concepts: weights, activations, layers, gradients, backpropagation. These combined to make something incredibly effective but it didn't fully click for me. It all felt strangely arbitrary. Why these pieces? Why this structure? 

Then I watched <a href="https://www.youtube.com/watch?v=CqOfi41LfDw&list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1&index=2" target="_blank" rel="noopener noreferrer">Josh Starmer's StatQuest video</a> on the key ideas underlying neural networks. He presented neural networks as systems that sculpt functions. This new lens helped my understanding immediately.

Then I got greedy and started looking for different explanations and mental models for neural networks. By the time I was done, I realise the different mental models explain different aspects of the same system. Together, they make neural networks feel much less mysterious. Learning to switch between these mental models fluidly was the breakthrough I needed. 

## The Mental Models

| Mental Model                     | Core Question                                                   | Main Insight                                                                           |
| -------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [Black Box](#neural-networks-as-black-boxes)                       | How can we use neural networks before fully understanding them? | Neural networks can still be useful even when their internal reasoning remains opaque. |
| [Function Approximation](#neural-networks-as-function-approximators)           | What is the network fundamentally doing?                        | A neural network is ultimately learning a function from inputs to outputs.             |
| [Function Sculpting](#neural-networks-as-function-sculptors)               | How do simple neurons create complex functions?                 | Complex decision boundaries emerge from many local nonlinear transformations.          |
| [Stack of Transformations](#neural-networks-as-stacks-of-transformations)         | Why are there multiple layers?                                  | Layers progressively reshape data through sequential transformations.                  |
| [Representation Learning](#neural-networks-as-representation-learners)          | What are hidden layers learning?                                | Neural networks automatically learn useful internal representations.                   |
| [Optimization System](#neural-networks-as-optimization-systems)              | Why does training behave the way it does?                       | Deep learning depends heavily on making optimization stable and effective.             |
| [Computational Graph](#neural-networks-as-computational-graphs)              | How is learning mechanically computed?                          | Learning emerges from local derivative computations linked by the chain rule.          |

## Neural Networks as Black Boxes

For many, this is the first mental model encountered. You feed data in, predictions come out. Somewhere in between, something complex is happening. Maybe you know that tons of parameters are interacting. Maybe you are aware that the inputs are being combined and recombined such that they no longer really represent what you initially put in. But we struggle to fully explain why a particular internal representation emerges or why certain behaviours appear during training. So we categorise these are black boxes. 

And for software developers, maybe we don't need to know. Modern tools offer powerful models at our fingertips that we can plug-and-play with. We import a framework, load pretrained weights, fine-tune a model and call an API. We can build useful systems while treating the network largely as an opaque component. We do not always need to fully understand the internals to use these systems effectively.

But eventually curiosity kicks in. That or we are forced to confront the model when training starts behaving strangely or debugging becomes necessary. Questions arise: Why do deeper networks work better? Why do activation functions matter? 

The remaining mental models are attempts to answer questions like these. 

## Neural Networks as Function Approximators

At its most abstract level, a neural network is one big function: 

$$f(x) = \text{some complicated mapping from inputs to outputs}$$

The job of training is to learn a function that maps inputs to desired outputs, whether that is mapping images to labels, sentences to translations or customer data to churn probabilities. This framing is useful because it strips away much of the apparent mystery surrounding neural networks. Underneath all the layers, activations and gradients, the network is fundamentally still solving the familiar pattern of finding a function that captures patterns in data. 

This mental model contextualises neural networks in the broader world of statistical and machine learning models. Linear regressions, logistic regressions, decision trees all learn a function. Neural networks simply learn far more flexible and expressive ones. A sufficiently large neural network can approximate highly complex nonlinear relationships that would be difficult to specify manually.

Function approximation explains what the network is learning.

But how do these complex functions emerge from simple neurons? The next section offers a more geometric intuition for how neural networks build these functions.

## Neural Networks as Function Sculptors

This is the mental model put forward by Josh Starmer in his <a href="https://www.youtube.com/watch?v=CqOfi41LfDw&list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1&index=2" target="_blank" rel="noopener noreferrer">StatQuest video</a>.

Each neuron works with a given activation function. The weights and biases slice, flip and stretch that same activation function into new shapes. As a result, each neuron applies a small nonlinear transformation to its input. These small transformations and shapes are stitched together across layers to create yet new shapes. A complex decision boundary emerges from many local transformations. 

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

With Softplus function, a neuron can introduce a smooth bend into the function surface. With ReLU, neurons create piecewise linear folds and cuts. Deep layers combine thousands or millions of these local transformations. This progressively reshapes the function surface and produces highly complex functions and nonlinear decision boundaries. 

Don't take my word for it. Watch the video. His animations (and the noises he makes while calculating) makeit worth your time. 

From this lens, a neural network can be viewed as sculpting a function surface in high-dimensional space. This mental model is really a geometric version of function approximation:
- Function approximation tells us _what_ the network does.
- Function sculpting helps us visualise _how_ it happens.

## Neural Networks as Stacks of Transformations

While the earlier mental models focused on the kinds of functions neural networks can express, this mental model focuses on how data is progressively transformed through the network.

Each layer progressively transforms the data before passing it on:

$$x \rightarrow h_1 \rightarrow h_2 \rightarrow \dots \rightarrow y$$

where:
- $(x)$ is the input
- $(h_1, h_2, \dots)$ are intermediate hidden representations
- $(y)$ is the final output

Rather than jumping directly from input to prediction, the network processes the data through multiple stages. For images, this is often described as:  

$$x \rightarrow pixels \rightarrow edges \rightarrow textures \rightarrow shapes \rightarrow objects$$ 

For language models: 

$$x \rightarrow tokens \rightarrow embeddings \rightarrow \text{contextual relationships} \rightarrow \text{semantic meaning}$$

Even for tasks like predicting customer churn, the same principle applies. The network is still progressively transforming raw features like age, transaction history and engagement metrics into signals that become increasingly useful for separating likely churners from non-churners.

This perspective helps explain why neural networks have depth at all. Each layer performs part of the transformation, allowing the network to build complex behaviour gradually through composition. Earlier layers produce simpler transformations that later layers can refine further.

Crucially, these transformations depend on nonlinear activation functions. Without nonlinearity, multiple stacked layers would collapse mathematically into a single linear transformation, no matter how deep the network became. 

The hidden layers are therefore not merely “extra computation”. They allow the network to repeatedly transform the data in ways that would be difficult to express in a single step.

This mental model is especially useful because it shifts the focus away from the final prediction and toward the intermediate transformations happening inside the network: Each layer reorganises the data into forms that become easier for later layers to work with. Depth matters because some transformations are easier to express gradually than all at once. 

The network is learning a sequence of increasingly useful transformations. But what exactly emerges from these transformations?

## Neural Networks as Representation Learners

The earlier transformation perspective focused on how data changes across layers. Representation learning shifts attention toward what kinds of internal structure emerge from those transformations.

Traditional machine learning often relied heavily on hand-engineered features. If you wanted to classify images, you might manually design edge detectors, texture measurements and geometric descriptors. For customer churn prediction, you might manually engineer number of logins in the past month, average spending changes, customer inactivity windows and engagement scores. A large part of traditional machine learning involved deciding which features might matter before the model even began learning.

Neural networks changed this. 

Instead of relying primarily on manually engineered features, hidden layers learn representations automatically. This is why neural networks are often described as systems for representation learning.

Importantly, this idea does not only apply to embedding models or large language models. Even relatively simple neural networks used for tasks like churn prediction are still learning internal structure from the data. The difference is mostly one of visibility and complexity.

A churn model may learn hidden behavioural patterns that help separate customers into different risk groups. A language model may learn highly structured semantic relationships across billions of words. Both are forms of representation learning.

From this perspective, the hidden layers are constructing internal representations of the data that capture useful structure, and are not merely intermediate calculations. This perspective becomes especially powerful when thinking about embeddings, latent spaces, transformers and large language models. 

For example, word embeddings place semantically similar words closer together in vector space.  The network is effectively learning geometry:
- similar concepts cluster together
- relationships become spatial
- structure emerges within the representation space

Neural networks do not just learn mappings from inputs to outputs. They also learn how to internally represent the problem itself.

## Neural Networks as Optimization Systems

The earlier mental models focused largely on representation:
- what kinds of functions neural networks can express
- how layers transform data
- what hidden layers may be learning

But how does the network actually find useful parameters among millions or even billions of possibilities? 

Unlike simpler models such as linear regression, neural networks generally do not have neat closed-form solutions. These parameters are learned iteratively through optimization. 

At first glance, optimization can seem like a secondary implementation detail — merely the mechanism through which weights get updated during training.

But this perspective turns out to be central to understanding modern deep learning. Neural networks were already highly expressive decades ago. The challenge was whether optimization can actually find a useful solution. Gradient-based optimization struggled to reliably train deep networks. 

Many important neural network behaviours are fundamentally optimization problems:
- unstable training
- exploding or vanishing gradients
- slow convergence
- sensitivity to learning rates
- overfitting
- training efficiency

A large amount of deep learning progress was actually about making highly expressive neural networks trainable, which makes this mental model so useful. This is why explanations of neural networks inevitably discuss gradient descent, learning rates, loss functions and activation functions. These ideas are about helping optimization behave well:
- activation functions like ReLU reducing vanishing gradients
- adaptive gradient descent methods like Adam optimization accelerating convergence
- learning rate schedules stabilizing training
- modern initialization methods improving gradient flow

These are all ideas that make highly expressive neural networks learnable through optimization. 

For me, this perspective also clarified why activation functions matter.

At first, I assumed activation functions were mainly important because they create different decision boundary shapes. That is partially true:
- ReLU tends to produce piecewise linear surfaces
- sigmoid and tanh create smoother transitions
- modern activations like GELU produce smoother adaptive behaviour

But this is not the main reason different activation functions are used. With enough neurons and layers, many activation functions can approximate similar functions anyway. The more important difference is how they affect optimization issues like vanishing gradients and training stability.

Activation functions are not just shaping functions. As with many concepts in neural networks, they are shaping learning itself.

## Neural Networks as Computational Graphs

The optimization perspective explains why gradients matter. But how are the gradients computed? 

Somehow the network computes useful gradients across millions or even billions of parameters and uses them to update itself. This leads to the computational graph perspective.

Without this perspective, backpropagation can feel like a memorized algorithm. With it, backpropagation becomes much less mysterious: it is simply repeated applications of the chain rule across a graph of computations.

Like several earlier mental models, this perspective also decomposes neural networks into smaller pieces. Here, the network becomes a composition of differentiable operations connected through data flow.

A neural network can be viewed as a computational graph:

- nodes represent operations or intermediate values
- edges represent data flow between computations

From this perspective, neural networks become compositions of many smaller operations:

$$f(x) =f_3(f_2(f_1(x)))$$

During the forward pass, data moves through the graph step by step:
- inputs are transformed
- activations are computed
- predictions are produced
- loss is calculated

Training then traverses this graph backward to compute gradients. 

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img src="/writing/neural-network-mental-model/computational-graph-light.svg" />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
      <img src="/writing/neural-network-mental-model/computational-graph-dark.svg" />
  </div>
  <figcaption>
    The computational graph perspective decomposes a neural network into smaller differentiable computations. During the forward pass, values flow through the graph to produce a prediction and compute the loss. During the backward pass, gradients flow back through the same graph using the chain rule.
  </figcaption>
</figure>

The key insight is that learning does not happen through one enormous global calculation. Each operation only needs to compute local derivatives with respect to its own inputs. The chain rule then links these local computations together, allowing gradients to propagate backward through the entire network.

This perspective also clarifies why differentiability matters so much in deep learning. Optimization depends on gradients, gradients depend on derivatives, and derivatives require differentiable computations.

More broadly, the computational graph perspective makes neural networks feel less like monolithic black boxes and more like structured systems of computation.

Underneath all the high-level intuition, a neural network is still fundamentally a large differentiable program.

# Conclusion

Neural networks became much easier to understand once I stopped searching for a single explanation.

Different mental models illuminate different aspects of the same system:

- geometry
- representation
- optimization
- computation

The real shift was learning to move between these perspectives fluidly.

Sometimes a neural network feels like:
- a function approximator
- a geometric sculptor
- a hierarchy of transformations
- an optimization system
- a computational graph

No single perspective fully explains neural networks. But together, these mental models make them feel far less mysterious.

And somehow, all of these are true at once.