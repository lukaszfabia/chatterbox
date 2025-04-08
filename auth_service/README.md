[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)]()
[![postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
[![rabbitmq](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white)]()
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)]()
[![docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)]()
[![swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)]()

# Auth Service API - Chatterbox

Auth Service helps to authenthicate user on website. It behaves like firebase authentication service. Talks with `Profile Service` and `Status Service`.

## Architecure

`Simplified CQRS` with `Event-driven`.

## Responsibility

- Managing user.

- Generating JWT tokens.

- Handling **Continue With ...** (in future)

## Event kinds

- Outcoming events

    - `UserUpdatedEvent` to **Profile Service**

    - `UserDeletedEvent` to **Profile Service**
    - `UserCreatedEvent` to **Profile Service**
    - `UserLoggedInEvent` to **Status Service**
    - `UserLoggedOutEvent` to **Status Service**