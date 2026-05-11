---
title: "ft_transcendence — Real-Time Pong Platform"
summary: "A full-stack, microservices-based Pong platform featuring real-time gameplay, AI opponents, tournaments, and player analytics."
date: "2026-01-26"
year: 2026
timeframe: "Aug 2025 - Jan 2026"
featured: true
image: "/projects/transcendence/gameplay.png"
imagePosition: "object-cover object-[center_26%]"
tech:
  - Tailwind
  - TypeScript
  - Node.js
  - Fastify
  - Docker
  - SQLite
  - Prisma
  - Nginx
  - WebSockets
links:
  - label: GitHub
    url: https://github.com/marsha-t/ft_transcendence
team: 4
---
# ft_transcendence: A Real-Time Pong Platform
*Designing a real-time multiplayer game system with microservices, WebSockets, and full-stack tournament play*

<figure id="hero-image">

<img 
  src="/projects/transcendence/ai-game-point.gif"   
  alt="Real-time gameplay against an AI opponent"
  style="max-width: 700px; width: 100%; max-height: 700px; height: 100%"
/>

</figure>

## Overview

ft_transcendence is a full-stack web application centred around a real-time Pong game.

The platform supports local multiplayer, AI opponents, and tournament play, while also providing a complete user ecosystem including authentication, profiles, friends, and match analytics.

The system is built as a containerised microservices architecture with multiple backend services communicating through HTTP and WebSockets. All services run inside Docker and are served through an Nginx reverse proxy.

This project was developed as the capstone of the 42 curriculum, requiring the design and implementation of a complex system spanning real-time gameplay, user management, and distributed services.

## My Contributions

I focused on the game and tournament systems working across backend logic, real-time interactions, and frontend flow, while also contributing to analytics features.

- **Game Backend**  
  Implemented core game logic and state management, ensuring consistent gameplay behaviour and reliable event handling.
- **AI Opponent & Real-Time Communication**  
  Developed the AI opponent logic and implemented WebSocket-based communication to enable responsive, real-time gameplay.
- **Tournament System**  
  Designed and built the tournament feature end-to-end:
  - Developed backend logic for match progression and result tracking  
  - Structured tournament data models and persistence  
  - Built the frontend flow for creating, joining, and progressing through tournaments  
- **Analytics & Dashboard Service**  
  Built the dashboard service and aggregated player statistics across multiple services to power user insights and leaderboards, visualised using Plotly.

## Architecture

<figure>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl block dark:hidden">
    <img src="/projects/transcendence/transcendence-architecture-light.svg" style="max-width: 800px; width: 100%; max-height: 700px; height: 100%"/>
  </div>
  <div className="bg-[var(--bg-secondary)] p-4 rounded-xl hidden dark:block">
    <img src="/projects/transcendence/transcendence-architecture-dark.svg" style="max-width: 800px; width: 100%; max-height: 700px; height: 100%"/>
  </div>
  <figcaption>
    Microservices architecture with isolated services for gameplay, user management, and analytics.
  </figcaption>
</figure>

The system is designed as a containerised microservices architecture, where each service is responsible for a specific domain.

Core services include:
- **auth-service** — authentication and account management  
- **profile-service** — player profiles and avatars  
- **friends-service** — social features  
- **game-tournament-service** — gameplay engine and tournaments  
- **dashboard-service** — analytics aggregation  
- **frontend** — SPA served via Nginx  

The entire platform runs through Docker Compose allowing all services to be started with a single command. All services run inside Docker containers and are exposed through an Nginx reverse proxy.

All services use Prisma ORM with SQLite databases for type-safe queries and migrations. Data is separated by domain:
- user-related services share a common database  
- gameplay and tournaments operate on a dedicated game database  
- the dashboard service aggregates data across both  

This separation allowed services to evolve independently while maintaining clear boundaries between gameplay, user management, and analytics.

## Local Multiplayer Gameplay

For local multiplayer, the game loop runs entirely on the frontend, handling rendering, input, and state updates in real time. The backend is used for persisting match results, recording gameplay events and updating player statistics. 

This separation keeps gameplay highly responsive while still integrating with the broader system for analytics and history.

## AI Gameplay
<figure>
<img src="/projects/transcendence/ai-game-point.gif"   style="max-width: 700px; width: 100%; max-height: 700px; height: 100%"
/>

<figcaption>
AI opponent integrated into the game loop using WebSockets, enabling real-time input-driven gameplay
</figcaption>
</figure>

The AI opponent is implemented on the backend and interacts with the game through WebSockets, while the game loop remains on the frontend. To ensure consistency, the AI uses the same input model as a human player (e.g. simulated key actions), allowing it to operate within the existing gameplay system.

A key challenge was balancing the AI’s behaviour. Rather than optimising for perfect play, I intentionally designed the AI to be imperfect and beatable, introducing controlled reaction delays and non-optimal movement patterns. This shifted the problem from pure optimisation to behaviour design, where the goal was not to maximise performance, but to create a balanced and engaging opponent.

## Tournament System

<figure>
<img src="/projects/transcendence/tournament-7.png"   style="max-width: 700px; width: 100%; max-height: 700px; height: 100%"
/>

<figcaption>
Tournament bracket generated for 7 players with automatic seeding and progression across rounds
</figcaption>
</figure>

The platform supports single-elimination tournaments designed to handle flexible player participation. The system automatically:
- registers players  
- generates tournament brackets with random seeding  
- schedules matches  
- advances winners through each round  

The tournament engine was built to support any number of players, dynamically generating brackets and managing match progression. All results are persisted and integrated into player history and analytics dashboards.

I implemented both the backend tournament logic and the frontend user flow, ensuring a seamless experience from tournament creation to final results.

## Data & Analytics

<figure>
<img src="/projects/transcendence/ai-game-stats.gif"   style="max-width: 700px; width: 100%;"
 />

<figcaption>
Interactive post-game analytics with score progression, tooltips and player-level insights
</figcaption>
</figure>

The platform records gameplay events such as scores, match outcomes, and tournament results. A dedicated dashboard service aggregates this data across multiple services to generate user-facing insights on game activity and performance. 

The system includes:
- a post-game dashboard showing match-level statistics  
- a user dashboard tracking long-term performance with a global leaderboard ranking players based on activity and win rate  

This required combining data across service boundaries, introducing additional complexity in data aggregation and consistency.

## Challenges 

**Coordinating frontend and backend state**  
The gameplay and tournament system required tight coordination between frontend flows and backend logic. Ensuring consistency between UI state and persisted data, while keeping the user experience smooth, required careful API design and state handling.

**Designing a balanced AI opponent**  
Beyond implementing real-time AI behaviour, a key challenge was ensuring the AI remained enjoyable to play against. This required intentionally constraining the AI’s performance—introducing reaction delays and non-optimal decisions—so that it felt responsive but still beatable for human players.

**Building a flexible tournament engine**  
Designing a tournament system that supports arbitrary numbers of players, dynamic bracket generation, and match progression required careful modelling of state and transitions across rounds.

## What I Learned

This project fundamentally changed how I think about building software.

I moved from focusing on individual components to understanding how systems interact — how data flows across services, how state is managed in real time, and how architectural decisions impact scalability and maintainability.

Key takeaways included:
- designing backend systems for real-time, stateful applications
- structuring a microservices architecture with clear boundaries
- building systems that are event-driven rather than request-driven
- coordinating development across multiple interconnected services  

It reinforced the importance of designing systems, not just features.
