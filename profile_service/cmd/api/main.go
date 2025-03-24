package main

import (
	"profile_service/internal/application"
	"profile_service/internal/infrastructure/api"
	"profile_service/internal/infrastructure/rabbitmq"
	"profile_service/internal/infrastructure/repository"

	"github.com/gorilla/mux"
)

func main() {

	repo := repository.New()
	router := mux.NewRouter()

	server := api.NewServer(repo, router)

	done := make(chan bool, 1)

	go func() {
		server.StartAndListen()
	}()

	go func() {
		rabbit, err := rabbitmq.NewRabbitMQConnection()
		if err != nil {
			panic("Failed to connect with queue")
		}

		defer rabbit.Close()

		handler := application.NewEventHandler(rabbit, server.GetProfileRepo())

		handler.StartListen()

	}()

	go func() {
		server.GracefulShutdown(done)
	}()

	<-done
}
