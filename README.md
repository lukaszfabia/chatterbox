[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![rabbitmq](https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white)]()
[![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)]()
[![docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)]()
[![postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)]()
[![express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]()
[![redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)]()
[![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)]()
[![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)]()


# Chatterbox

Simple `chat web app` writted with microservices (simplified **CQRS** pattern and event-driven architecture). Microservices communicate with each other by RabbitMQ broker. 

## Getting started

Before we start copy `.env.sample` in the root of the project and fill blank keys. You also need to do it with other services.

```bash
cp .env.sample .env
```

> [!TIP]
> To generate .env's just use `init.sh`!

```bash
bash init.sh
```

or

```bash
sudo chmod +x init.sh
./init.sh
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

Check services to get know how does it works!

- [`Profile Service`](profile_service)

- [`Auth Service`](auth_service)

- [`Notification Service`](notification_service)

- [`Chat Service`](chat_service)

- [`Status Service`](status_service)

## Examples

### Edit Account  
![Edit Account](./docs/gifs/edit.gif)  
The user updates their account details, such as username and profile picture.

### Getting Notification  
![Getting Notification](./docs/gifs/getting_notification.gif)  
An example of receiving a real-time notification after an action is triggered in the system.

### Sample Flow  
![Sample flow](./docs/gifs/sample_flow.gif)  
A example user flow through several application screens – from home view through explorer for people to chat where sends message. 

### Continue With Google
![SSO](./docs/gifs/sso.gif)  
Demonstration of logging in via Single Sign-On for seamless access.

### Live Chatting  
![Chatting](./docs/gifs/live_chatting.gif)  
Real-time chat functionality between users, showing message sending and receiving.

### Profile and Notifications  
![Go to profile and check notifications](./docs/gifs/go_to_profile_check_notification.gif)  
The user navigates to their profile and checks their recent notifications.


### Go to Offline mode
![Loggin out](./docs/gifs/offline_mode.gif)  
The user logs out and finds his profile to check is online or offline.
