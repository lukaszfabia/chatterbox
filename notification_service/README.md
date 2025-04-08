[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![rabbitmq](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white)]()
[![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)]()
[![docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)]()
[![swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)]()

# Notification Service API - Chatterbox

Profile Service stores user basic information. Talks with `Auth Service`, `Notification Service`, `Chat Service`.

## Architecure

`Simplified CQRS` with `Event-driven`.

## Responsibility

- Real time notifications via **websocket**

- Sending information emails 

## Event kinds

- Incoming events

    - `EmailNotificationEvent` to **Profile Service**

    - `GotNewMessageEvent` from **Chat Service**