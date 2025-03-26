package main

import (
	"fmt"
	"log"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/events"
	"profile_service/internal/application/queries"
	"profile_service/internal/config"
	aggregates "profile_service/internal/domain/aggretates"
	e "profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/messaging"
	"profile_service/internal/infrastructure/messaging/rabbitmq"
	"profile_service/internal/infrastructure/repositories"
	"profile_service/internal/infrastructure/rest"
	"profile_service/internal/infrastructure/rest/handlers"
	"profile_service/pkg"
	"reflect"
)

func init() {
	pkg.LoadEnv()
}

func addEvents(aggregate *aggregates.ProfileAggregate, bus messaging.EventBus) (*events.Dispatcher, []string) {
	dispatcher := events.NewDispatcher()
	handlers := map[string]events.EventHandler{
		fmt.Sprint(reflect.TypeOf(e.UserCreatedEvent{}).Name()): events.NewUserCreatedEventHandler(*aggregate, bus),
	}

	queueNames := make([]string, 0, len(handlers))
	for eventName, handler := range handlers {
		dispatcher.Register(eventName, handler)
		queueNames = append(queueNames, eventName)
	}

	return dispatcher, queueNames
}

func main() {

	rabbit, err := rabbitmq.New(config.GetBrokerUrl())
	if err != nil {
		panic("Failed to connect with queue")
	}

	defer rabbit.Close()

	repo := repositories.New()
	aggregate := aggregates.NewProfileAggregate(repo.ProfileRepository())

	queryService := queries.NewProfileQueryService(repo.ProfileRepository())
	commandService := commands.NewProfileCommandService(*aggregate)

	dispatcher, queues := addEvents(aggregate, rabbit)

	// handlers
	router := handlers.NewRouter(commandService, queryService)
	server := rest.NewServer(router)

	done := make(chan bool, 1)

	go func() {
		server.StartAndListen()
	}()

	for _, queue := range queues {
		handler, exists := dispatcher.GetHandler(queue)
		if !exists {
			log.Printf("No handler registered for queue: %s", queue)
			continue
		}

		go func(q string, h func([]byte) error) {
			if err := rabbit.Consume(q, h); err != nil {
				log.Println(err.Error())
			}
		}(queue, handler)
	}

	go func() {
		server.GracefulShutdown(done)
	}()

	<-done
}
