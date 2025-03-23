package application

import (
	"profile_service/internal/infrastructure/rabbitmq"
	"profile_service/internal/infrastructure/repository"
)

type EventHandler struct {
	conn *rabbitmq.RabbitMQConnection
	repo repository.ProfileRepository
	// dispatch *dispatcher.EventDispatcher
}

func NewEventHandler(conn *rabbitmq.RabbitMQConnection, repo repository.ProfileRepository) *EventHandler {
	return &EventHandler{
		conn: conn,
		repo: repo,
	}
}

func (e *EventHandler) StartListen() {
	go func() {
		// if err :=e.conn.Consume()
	}()
}
