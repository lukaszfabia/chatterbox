# Chatterbox

Simple `chat web app` writted with microservices (simplified **CQRS** pattern and event-driven architecture).


## Getting started 

Before we start copy `.env.sample` in the root of the project and fill blank keys. You also need to do it with other services.

```bash
cp .env.sample .env
```

Just make sure you have installed `Docker`, `docker-compose`. 

```bash
docker-compose up -d
```

## Features

- Real time communication if both of users are **online**

- Simple notification system. Provides sending emails and getting real time notifications when user is online.

- System to track online status.

- Simple account managment.



## Services

- [`Profile Service`](profile_service)

- [`Auth Service`](auth_service)

- [`Notification Service`](notification_service)

- [`Chat Service`](chat_service)

- [`Status Service`](status_service)
