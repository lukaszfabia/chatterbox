[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![rabbitmq](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white)]()
[![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)]()
[![docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)]()
[![swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)]()

# Profile Service API - Chatterbox

Profile Service stores user basic information. Talks with `Auth Service`, `Notification Service`, `Chat Service`. Uses port **:8002**

## Documentation
Run command below to start docs server. 

```bash
godoc -http=:6060
```

Change `PORT` on real port that you want to use. For example we use :6060 port to display docs.

> [!TIP]
> Press <kbd>Ctrl</kbd> + <kbd>F</kbd> + <kbd>X</kbd> and search *profile_service* to see documentation.

> [!TIP]
> http://localhost:6060/pkg/profile_service/internal/domain/models/

## Architecure

`Simplified CQRS` with `Event-driven`.

## Responsibility

- Managing profiles.

- Hanlding files.

## Event kinds

- Incoming events

    - `UserCreatedEvent` from **Auth Service**

    - `UserUpdatedEvent` from **Auth Service**
    - `UserDeletedEvent` from **Auth Service**

- Outcoming events

    - `EmailNotificationEvent` to **Notification Service**

    - `MemberUpdatedInfoEvent` to **Notification Service**