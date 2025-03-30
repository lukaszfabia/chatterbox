# Chatterbox

Simple `chat web app` writted with microservices (**CQRS** pattern).


Every microservice has _personal_ database:

For all
/api/v1

- [`Profile Service`](profile_service): PostgreSQL /profile

- [`Auth Service`](auth_service): PostgreSQL /auth

- [`Notification Service`](notification_service): MongoDB /notification

- [`Chat Service`](chat_service): MongoDB

- [`Status Service`](status_service): Redis /status 

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

//

do auth service 

- sso z googlem 

do noti service 

- implementacja websocketa do nasluchiwania powiadomien

...

zacząć robic chat i status serivce ...


CQRS, event driven 
status serivce - odpowiedzialnosc

reagowanie na zalogowanie sie i wylogowanie ze strony, czyli obsluga eventu logged in/out 
