[![express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]()
[![redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)]()
[![rabbitmq](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white)]()
[![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)]()
[![swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)]()

# Status Service API - Chatterbox

One of a five services implemented for `Chatterbox` app. Listens on **:8004**. Talks with `AuthService`, `ChatService` and yourself.

## Architecure

`Simplified CQRS` with `Event-driven`.

## Responsibility

- Hanlding user online

- Providing user status, by **rest** and **events**

## How does it works?

Starting with the most important feature – Handling user online state. The system defines a WebSocketService, which manages communication with the frontend. When a user is logged in on the frontend, the service publishes a new event – UserStatusUpdatedEvent. Then, the same service, in another part of the system, consumes this information and saves the state.

Why Redis? The reason for choosing Redis is that we have many writes to the database and need an efficient way to store the temporary state.

### Event kinds

- Handled in service range

  - [UserStatusUpdatedEvent](/src/domain/events/user-status-updated.event.ts)

- Incoming events from `Auth Service`

  - [UserLoggedInEvent](/src/domain/events/user-logged-in-event.ts)

  - [UserLoggedOutEvent](/src/domain/events/user-logged-out-event.ts)
