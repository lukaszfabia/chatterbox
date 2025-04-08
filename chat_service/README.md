[![express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]()
[![mongodb](hhttps://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![rabbitmq](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white)]()
[![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)]()
[![swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)]()

# Chat Service API - Chatterbox

Most important service. Listents on **:8005**. Talks with `Notification Service`, `Profile Service` and yourself.

## Architecure

`Simplified CQRS` with `Event-driven`.

## Responsibility

- Handling creating chat and messages.

- Providing users conversations.

- **Real-time** communication.

## How do we send message?

To send a message, we need to call command `CreateMessageCommand`. Serivce saves message to database and then publishes new event `MessageCreatedEvent`. The other part of a system handles event and deciding how to deliver message. If user is online (is on chat subpage), we can deliver by websocket else system publishes new event `GotNewMessageEvent`. It helps to deliver notification to recevier of message.

## Event kinds

- Outcoming events

  - `GotNewMessageEvent` to **Notification Service**

- Incoming events

  - `MemberUpdatedInfoEvent` from **Profile Service**

- Handled in service range

  - `MessageCreatedEvent`
