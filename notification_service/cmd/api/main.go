package main

import (
	"fmt"
	"log"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/events"
	"notification_serivce/internal/application/queries"
	"notification_serivce/internal/config"
	aggregates "notification_serivce/internal/domain/aggretates"
	e "notification_serivce/internal/domain/events"
	"notification_serivce/internal/infrastructure/email"
	"notification_serivce/internal/infrastructure/messaging/rabbitmq"
	"notification_serivce/internal/infrastructure/notifier"
	"notification_serivce/internal/infrastructure/repositories"
	"notification_serivce/internal/infrastructure/rest"
	"notification_serivce/internal/infrastructure/rest/handlers"
	"notification_serivce/internal/infrastructure/ws"
	"reflect"

	_ "github.com/joho/godotenv/autoload"
)

// addEvents registers event handlers for different event types and returns the queue names for consuming.
func addEvents(aggregate *aggregates.NotificationAggregate, dispatcher *events.Dispatcher, emailNotifier, wsNotifier notifier.Notifier) []string {

	handlers := map[string]events.EventHandler{
		fmt.Sprint(reflect.TypeOf(e.GotNewMessageEvent{}).Name()):     events.NewGotNewMessageEventHandler(*aggregate, wsNotifier),
		fmt.Sprint(reflect.TypeOf(e.EmailNotificationEvent{}).Name()): events.NewEmailNotificationEventHandler(*aggregate, emailNotifier),
	}

	queueNames := make([]string, 0, len(handlers))
	for eventName, handler := range handlers {
		dispatcher.Register(eventName, handler)
		queueNames = append(queueNames, eventName)
	}

	return queueNames
}

func main() {

	repo := repositories.New()
	webSocketServer := ws.NewWebSocketServer()

	wsNotifier := ws.NewWebSocketNotifier(webSocketServer)
	emailNotifier := email.NewEmailNotifier()

	aggregate := aggregates.NewNotificationAggregate(repo.NotificationRepository())

	queryService := queries.NewNotiQueryService(repo.NotificationRepository())
	commandService := commands.NewNotificationCommandService(*aggregate)

	dispatcher := events.NewDispatcher()

	queues := addEvents(aggregate, dispatcher, emailNotifier, wsNotifier)

	// handlers
	router := handlers.NewRouter(commandService, queryService, webSocketServer)
	server := rest.NewServer(router)

	done := make(chan bool, 1)

	go func() {
		server.StartAndListen()
	}()

	rabbit, err := rabbitmq.New(config.GetBrokerUrl())
	if err != nil {
		panic("Failed to connect with queue")
	}

	defer rabbit.Close()
	for _, queue := range queues {
		go func(q string) {
			if err := rabbit.Consume(q, dispatcher); err != nil {
				log.Println(err.Error())
			}
		}(queue)
	}

	go func() {
		server.GracefulShutdown(done)
	}()

	<-done
}
