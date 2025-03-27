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

//

do auth service 

- sso z googlem 

- usuwanie konta -> wyzwolenie eventu z usunieciem do profile_serivce

- update danych email, username, password -> wyzwolenie eventu do profile service aktualizacja danych email, username 

do profile service 

- update danych typu bio, zdj 

- handling eventu z updatem danych 

- opcjonlanie dodanie eventu powiadomiomienia ze dane zmienone

- pobieranie profili 

- handling usuwania konta

do noti service 

- implementacja websocketa do nasluchiwania powiadomien

...

zacząć robic chat i status serivce ...

