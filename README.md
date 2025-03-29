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

do noti service 

- implementacja websocketa do nasluchiwania powiadomien

...

zacząć robic chat i status serivce ...


CQRS, event driven 
status serivce - odpowiedzialnosc

reagowanie na zalogowanie sie i wylogowanie ze strony, czyli obsluga eventu logged in/out 

// czyli to nam generuje dane 
wykorzystanie websocketa aby pograc w ping ponga - czyli frontend bedzie pingowac gdy 
user jest na stronie np. co 30s.
zmiana statusy moze odbywac sie tak, ze nasluchujemy na zmiany, jesli stan sie zmieni do mozna wyemitowac odpowieni event user-status-updated i teraz serwis nasluchuje na tej kolejce i konsumuje wydarzenie - zmienia stan w bazie bo inna czesc systemu poprosila o zmiane i to moze byc zapis do bazy 

// potrzeba resta zeby pobrac aktualny stan, zeby obcy mogl zobaczyc czy ktos jest online
get-user-status {
    // lista userid do sprawdzenia np. kiedy listujemy chat 
    userID : string[]
}

