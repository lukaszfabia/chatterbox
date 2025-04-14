package main

import (
	"fmt"
	"log"
	_ "profile_service/docs"
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
	"reflect"

	_ "github.com/joho/godotenv/autoload"
)

// addEvents initializes and registers all event handlers with the event dispatcher.
//
// It binds specific domain event types (UserCreatedEvent, UserDeletedEvent, UserUpdatedEvent)
// to corresponding handler implementations and registers them in the dispatcher.
//
// Parameters:
//   - aggregate: ProfileAggregate to apply domain logic on events.
//   - bus: EventBus used to publish further events after handling.
//
// Returns:
//   - dispatcher: the initialized event dispatcher.
//   - queueNames: a list of event queue names to listen on.
func addEvents(aggregate *aggregates.ProfileAggregate, bus messaging.EventBus) (*events.Dispatcher, []string) {
	dispatcher := events.NewDispatcher()
	handlers := map[string]events.EventHandler{
		fmt.Sprint(reflect.TypeOf(e.UserCreatedEvent{}).Name()): events.NewUserCreatedEventHandler(*aggregate, bus),
		fmt.Sprint(reflect.TypeOf(e.UserDeletedEvent{}).Name()): events.NewUserDeletedEventHandler(*aggregate, bus),
		fmt.Sprint(reflect.TypeOf(e.UserUpdatedEvent{}).Name()): events.NewUserUpdatedEventHandler(*aggregate, bus),
	}

	queueNames := make([]string, 0, len(handlers))
	for eventName, handler := range handlers {
		dispatcher.Register(eventName, handler)
		queueNames = append(queueNames, eventName)
	}

	return dispatcher, queueNames
}

// @title Profile Service API
// @version 1.0
// @description Profile management service
// @host localhost:8002
// @BasePath /api/v1
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

// main is the entry point for the Profile Service.
//
// Responsibilities:
//   - Loads configuration (from env)
//   - Connects to RabbitMQ
//   - Instantiates repositories, aggregates, and services
//   - Registers event handlers
//   - Starts HTTP server
//   - Subscribes to message queues to consume domain events
func main() {

	conf, err := config.GetBrokerUrl()
	if err != nil {
		panic("Can't get config for broker!")
	}

	rabbit, err := rabbitmq.New(conf)
	if err != nil {
		panic("Failed to connect with queue")
	}

	defer rabbit.Close()

	repo := repositories.New()
	aggregate := aggregates.NewProfileAggregate(repo.ProfileRepository())

	queryService := queries.NewProfileQueryService(repo.ProfileRepository())
	commandService := commands.NewProfileCommandService(*aggregate, rabbit)

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
