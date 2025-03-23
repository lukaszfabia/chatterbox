package main

import (
	"profile_service/internal/application"
	"profile_service/internal/infrastructure/http"
	"profile_service/internal/infrastructure/rabbitmq"
)

func main() {

	server := http.NewServer()

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

		handler := application.NewEventHandler(rabbit, http.NewServer().GetProfileRepo())

		handler.StartListen()

	}()

	go func() {
		server.GracefulShutdown(done)
	}()

	<-done
}
