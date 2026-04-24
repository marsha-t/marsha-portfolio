---
title: "Webserv — HTTP Server in C++"
summary: "Custom HTTP/1.1 server written in C++ implementing request parsing, routing, CGI execution, and concurrent client handling using an event-driven architecture"
date: "2025-08-04"
year: 2025
timeframe: "May-Sep 2025"
featured: true
image: "/projects/webserv/hero-light.svg"
imageDark: "/projects/webserv/hero-dark.svg"
imagePosition: "object-center"
tech:
  - Systems Programming 
  - C++
  - HTTP
links:
  - label: GitHub
    url: https://github.com/marsha-t/webserv
team: 2

---
# Webserv — HTTP Server in C++
*Building a fully functional HTTP server from scratch using C++98 and POSIX sockets*

<div id="hero-image">
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img 
      src="/projects/webserv/hero-light.svg"
      alt="Webserv architecture diagram"
      class="rounded-lg mx-auto "
    />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img 
      src="/projects/webserv/hero-dark.svg"
      alt="Webserv architecture diagram"
      class="rounded-lg mx-auto "
    />
  </div>
</div>

## Overview

Webserv is a custom HTTP server built from scratch using C++98 and POSIX sockets. The project recreates core functionality of production web servers such as request parsing, routing, static file serving, and CGI execution.

Instead of relying on existing frameworks, the server manages low-level sockets directly, parses HTTP requests, routes them based on configuration rules, and generates responses such as static files or CGI output.

The server supports multiple simultaneous clients using non-blocking I/O and an event-driven architecture built around `select()`.

Building the server required implementing several core components:
* socket management
* HTTP request parsing
* routing and configuration
* CGI execution
* concurrent client handling

This project was developed as part of the 42 Common Core curriculum. 

## Problem
Web servers must handle many client connections simultaneously while remaining responsive.

A naive implementation using blocking sockets would stall whenever one client is slow or incomplete in sending data. This means a single slow connection could prevent other clients from being served.

The challenge was to design a server capable of:
* managing multiple client connections concurrently
* correctly parsing HTTP requests
* routing requests to the correct resource or script
* returning valid HTTP responses

## Constraints
The project was implemented under several constraints defined by the 42 curriculum:

- C++98 standard (no modern C++ features)
- POSIX sockets and system calls only
- no external HTTP libraries
- a single executable server handling all clients

## Solution
The server uses an event-driven architecture built around non-blocking sockets and the `select()` system call to manage multiple client connections concurrently.

Instead of spawning a thread or process for each client, the server runs a single event loop that monitors all connected sockets. When a socket becomes ready for reading or writing, the server processes that event and then returns to monitoring the rest.

This design allows the server to efficiently manage many concurrent connections and remain responsive even when some clients send data slowly.

## Architecture
<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img src="/projects/webserv/webserv-request-flow-light.svg" />
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img src="/projects/webserv/webserv-request-flow-dark.svg" />
  </div>
  <figcaption>
  Request lifecycle through the server.
  </figcaption>
</figure>

The server architecture revolves around a central event loop that manages socket activity and request processing. 

**Event Loop**  
The event loop continuously monitors socket readiness using `select()`. Each iteration:
1. waits for readable or writable sockets
2. processes ready sockets
3. performs one read or write operation
4. returns to monitoring connections

This approach prevents blocking operations and allows the server to scale to multiple clients.

**Request Parsing**  
HTTP messages can arrive in multiple network packets. The request parser accumulates incoming data until the full request can be parsed safely. This ensures the server correctly handles partial reads, request headers and request bodies. Incoming requests are parsed, routed to handlers, and transformed into HTTP responses.

**Configuration Parsing**  
Server behaviour is defined through configuration files that specify server ports, root directories, route mappings, allowed methods and error pages. These configuration rules determine how incoming requests are processed.

## Demo
Run the server:
```bash
./webserv config/default.conf
```

Example requests:
``` bash
curl http://localhost:8080
curl -X POST http://localhost:8080/upload
curl -X DELETE http://localhost:8080/file
```

Basic stress testing can be performed with tools such as:
```bash
siege -c 50 -r 10 http://localhost:8080
```

## My Contributions
- Designed the overall server architecture and request handling pipeline
- Developed the main event loop using `select()` to manage client connections
- Implemented the HTTP request parser and routing logic
- Built the configuration system
- Implemented the static file handler and HTTP response generation
- Wrote tests for the full system and verified server behaviour against the HTTP specification
- Reviewed, debugged, and stabilised CGI, upload, and redirect handlers

## What I Learned
Building a web server from scratch changed how I think about web applications.

Before this project, HTTP felt like something handled invisibly by frameworks and production servers such as Nginx. Implementing the protocol directly revealed how much work happens underneath a simple request–response interaction.

One of the biggest lessons was designing an event-driven system. Instead of spawning threads for each connection, the server multiplexes many sockets through a single event loop using `select()`. This required thinking carefully about socket states, partial reads and writes, and how requests progress through the system.

The project also pushed me to structure a larger C++ codebase. Components such as configuration parsing, request dispatching, handlers, and response generation needed clear boundaries so the system could remain maintainable as features were added.

Finally, debugging networked programs became a major part of the work. Many issues only appear with specific request patterns or malformed input, so testing and careful instrumentation were essential for verifying that the server behaved correctly.

Implementing the server end-to-end gave me a much clearer mental model of how production web servers work internally.
