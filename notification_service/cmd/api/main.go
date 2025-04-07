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
	"notification_serivce/internal/infrastructure/messaging/rabbitmq"
	"notification_serivce/internal/infrastructure/repositories"
	"notification_serivce/internal/infrastructure/rest"
	"notification_serivce/internal/infrastructure/rest/handlers"
	"notification_serivce/internal/infrastructure/ws"
	"notification_serivce/pkg"
	"reflect"
)

func init() {
	pkg.LoadEnv()
}

func addEvents(aggregate *aggregates.NotificationAggregate, dispatcher *events.Dispatcher) []string {
	handlers := map[string]events.EventHandler{
		fmt.Sprint(reflect.TypeOf(e.GotNewMessageEvent{}).Name()):     events.NewGotNewMessageEventHandler(*aggregate),
		fmt.Sprint(reflect.TypeOf(e.EmailNotificationEvent{}).Name()): events.NewEmailNotificationEventHandler(*aggregate),
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
	ws := ws.NewWebSocketServer()

	aggregate := aggregates.NewNotificationAggregate(repo.NotificationRepository(), ws)

	queryService := queries.NewNotiQueryService(repo.NotificationRepository())
	commandService := commands.NewNotificationCommandService(*aggregate)

	dispatcher := events.NewDispatcher()

	queues := addEvents(aggregate, dispatcher)

	// handlers
	router := handlers.NewRouter(commandService, queryService, ws)
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
