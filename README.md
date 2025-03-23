# Chatterbox

Simple `chat web app` writted with microservices (**CQRS** pattern).


Every microservice has _personal_ database:

- [`Profile Service`](profile_service): PostgreSQL

- [`Auth Service`](auth_service): PostgreSQL

- [`Notification Service`](notification_service): MongoDB

- [`Chat Service`](chat_service): MongoDB

- [`Status Service`](status_service): Redis

TODO 

AuthService(logowanie, sso, rejestracja)
ChatSerivce(message handling) node.js
ProfileService(info o ludziach) spring 
NotificationService - powiadomienia
Serwis zw. z sledzeniem statusu ludzi (czy online) node.js

Plan prac 20.03 - 25.04

Wizja, przypadki użycia 

Ustalenie architektury aplikacji, technologii, inicjacja projektu, bez infrastruktury chmurowej

Praca nad serwisem uwierzytelniania użytkownika


