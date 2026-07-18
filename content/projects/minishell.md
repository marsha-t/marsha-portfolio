---
title: "Minishell - Unix Shell in C"
summary: "Custom Unix shell in C built around a hybrid AST-like execution tree for parsing, pipelines, redirections, and conditional execution"
date: "2024-07-24"
year: 2024
timeframe: "May-Jul 2024"
featured: true
image: "/projects/minishell/hero-light.svg"
imageDark: "/projects/minishell/hero-dark.svg"
imagePosition: "object-center"
tech:
  - Shell
  - C
  - Unix
  - Parsing
links:
  - label: GitHub
    url: https://github.com/marsha-t/minishell
team: 2

---
# Minishell - Unix Shell in C
*Building a Unix shell from scratch with parsing, process execution, pipes, redirections, and interactive behaviour*


<figure id="hero-image">
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/minishell/hero-light.svg"
      alt="Minishell hybrid execution tree diagram"
      class="rounded-lg mx-auto"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/minishell/hero-dark.svg"
      alt="Minishell hybrid execution tree diagram"
      class="rounded-lg mx-auto"
    />
  </div>
</figure>

## Overview

Minishell is a Unix shell written in C. It recreates a focused subset of Bash, including command execution, pipelines, redirections, environment expansion, built-ins, and interactive signal handling.

The project turns raw terminal input into running processes. Each command line is validated, tokenised, parsed into an execution structure, expanded, connected to the correct file descriptors, and executed either as a built-in or external program.

Unlike using an existing parser or shell library, Minishell required designing the command representation, process model, and cleanup strategy directly in C. 

The project was developed as part of the 42 Common Core curriculum, under constraints that required manual memory management and a limited allowed-function set.

## Problem

A shell has to interpret terse command-line input while preserving the execution rules users expect from Bash.

The challenge was to support:
* quoting and environment expansion
* redirections and here-documents
* pipelines that run concurrently
* built-ins that sometimes need to mutate shell state
* logical operators such as `&&` and `||`
* parenthesised expressions that affect execution order
* interactive signals and exit-status propagation

## Constraints

The project was implemented under 42 curriculum constraints:

- C language
- limited allowed-function set
- manual memory management
- no parser generators or shell libraries
- behaviour checked against Bash for the supported feature set

## Solution

Minishell uses a staged command-processing flow. Input is checked for syntax errors, tokenised, converted into an intermediate node list, expanded, and then
executed.

The main design challenge was choosing a representation that could handle both conditional execution and pipelines without making the executor overly tangled. The final design uses a hybrid execution tree: logical operators are stored as binary branches, while pipeline stages are connected as ordered chains.

## Design Process

The most important design decision in Minishell was how to represent commands
after parsing.

At first, I tried to force every operator into a single tree shape. That worked
for logical operators, because `&&` and `||` are conditional branches: the shell
evaluates the left side first, then decides whether the right side should run.

Pipelines did not fit that shape as naturally. A pipeline is an ordered group of
commands that must be connected with file descriptors and launched together. The notes below show the representation I moved toward: logical operators as tree branches, and pipelines as linked chains of AST nodes.

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl">
    <div className="grid grid-cols-2 gap-4">
      <img
        src="/projects/minishell/ast-notes-1.jpg"
        className="w-full rounded-lg"
        alt="Handwritten notes showing simple pipeline chains under logical OR"
      />
      <img
        src="/projects/minishell/ast-notes-2.jpg"
        className="w-full rounded-lg"
        alt="Handwritten notes showing grouped logical expressions inside pipeline chains"
      />
    </div>
  </div>

  <figcaption>
    Working notes from the point where I realised pipelines should behave like linked lists inside the tree.
  </figcaption>
</figure>

## Hybrid Execution Tree

The final implementation kept that distinction. Minishell uses a hybrid
AST-like execution tree: logical operators are binary nodes connected through
`left` and `right`, while pipeline stages are linked through each node's `pipe`
pointer.

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img src="/projects/minishell/ast-light.svg" 
      alt="Hybrid execution tree showing logical operators as branches and pipeline stages as pipe-linked nodes"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img src="/projects/minishell/ast-dark.svg" 
      alt="Hybrid execution tree showing logical operators as branches and pipeline stages as pipe-linked nodes"
    />
  </div>
  <figcaption>
      Hybrid execution tree for a command combining pipes and logical operators.
  </figcaption>
</figure>

A command such as:

```bash
cat < input.txt | grep error | sort | uniq -c && echo "errors found" || echo "no errors"
```

combines a four-stage pipeline with conditional execution. The pipeline's exit
status determines whether `echo "errors found"` runs, and the result of the
`&&` expression determines whether `echo "no errors"` runs.

In the actual structure, the pipeline is not represented as a dedicated `PIPE`
subtree. Instead, `cat` acts as the pipeline head and each stage points to the
next through its `pipe` pointer.

This made the executor intentionally hybrid: logical expressions are evaluated
recursively, while pipelines are executed iteratively from the first command to
the last.

## Architecture

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img src="/projects/minishell/pipeline-light.svg" 
      alt="Minishell command-processing pipeline from Readline input through parsing, expansion, execution, and cleanup"
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img src="/projects/minishell/pipeline-dark.svg" 
      alt="Minishell command-processing pipeline from Readline input through parsing, expansion, execution, and cleanup"
    />
  </div>
  <figcaption>
  Command lifecycle from terminal input to process execution.
  </figcaption>
</figure>

The shell is organised as a staged command-processing flow, from syntax
validation and tokenisation through execution-tree construction, expansion, descriptor setup, execution, and cleanup.

**Parsing and Expansion**  
The parser converts tokens into command nodes, redirection lists, logical branches, and pipeline chains. Expansion happens after parsing so quote removal, environment variables, wildcard matching, and `$?` can be handled with command context.

**Pipeline Execution**  
For `A | B | C`, the executor walks the `pipe` chain, creates the required pipes,
forks each stage, wires standard input and output with `dup2`, and waits only
after all stages have been launched. This lets producers and consumers run
concurrently instead of blocking on an unstarted stage.

**Logical Execution**  
Logical nodes are evaluated recursively. `&&` executes the right subtree only
when the left subtree succeeds; `||` executes it only when the left subtree
fails. Pipelines bind more tightly than logical operators.

**Built-ins and Shell State**  
Built-ins such as `cd`, `export`, `unset`, and `exit` may need to modify the
shell process itself, so Minishell handles them differently from external
commands. In pipelines, built-ins run in child processes so they can participate
in the pipeline without mutating the parent shell unexpectedly.


## Demo

Run the shell:

```bash
make
./minishell
```

Example commands:

```bash
echo "Hello, $USER"
echo '$USER'
cat < input.txt | grep error | sort | uniq -c
cat < input.txt | grep error | sort | uniq -c && echo "errors found" || echo "no errors"
```

## My Contributions

- Designed the hybrid execution-tree model, representing logical operators as binary branches and pipelines as linked chains
- Built quote-aware tokenisation, syntax validation, and AST construction
- Implemented expansion behaviour for environment variables, wildcards, quote removal, and `$?`
- Integrated redirections, built-ins, and command execution into the shell flow
- Implemented and debugged built-ins and environment behaviour, including `echo`, `pwd`, `export`, `unset`, `env`, assignments, and `SHLVL`
- Debugged pipeline execution, cleanup, memory ownership, and Norm compliance

## What I Learned

Minishell made parsing feel much more concrete. A shell command looks like a
single line of text, but it contains several layers of meaning: syntax,
expansion, redirection, process boundaries, and conditional execution.

The hardest part was learning that a clean-looking tree is not always the best
execution model. Pipelines and logical operators have different runtime
semantics, so the final representation had to reflect that instead of forcing
everything into one uniform shape.

The project also deepened my understanding of Unix process control. Implementing
pipes, redirections, built-ins, and exit statuses required careful ownership of
file descriptors and memory across parent and child processes.

Building Minishell gave me a clearer mental model of what an interactive shell is
actually doing between pressing Enter and seeing a command run.