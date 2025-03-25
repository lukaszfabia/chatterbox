package main

import (
	"fmt"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/events"
	"profile_service/internal/application/queries"
	"profile_service/internal/config"
	aggregates "profile_service/internal/domain/aggretates"
	e "profile_service/internal/domain/events"
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

func main() {

	repo := repositories.New()
	aggregate := aggregates.NewProfileAggregate(repo.ProfileRepository())

	queryService := queries.NewProfileQueryService(repo.ProfileRepository())
	commandService := commands.NewProfileCommandService(*aggregate)

	dispatcher := events.NewDispatcher()

	event := events.NewUserCreatedHandler(*aggregate)
	dispatcher.Register(fmt.Sprint(reflect.TypeOf(e.UserCreatedEvent{}).Name()), event)

	// handlers
	router := handlers.NewRouter(commandService, queryService)
	server := rest.NewServer(router)

	done := make(chan bool, 1)

	go func() {
		server.StartAndListen()
	}()

	go func() {
		rabbit, err := rabbitmq.New(config.GetBrokerUrl())
		if err != nil {
			panic("Failed to connect with queue")
		}

		defer rabbit.Close()

		rabbit.Consume(fmt.Sprint(reflect.TypeOf(e.UserCreatedEvent{}).Name()), dispatcher)

	}()

	go func() {
		server.GracefulShutdown(done)
	}()

	<-done
}
