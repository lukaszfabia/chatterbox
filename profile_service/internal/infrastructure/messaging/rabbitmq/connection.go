package rabbitmq

import (
	"log"
	"profile_service/internal/infrastructure/messaging"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQ struct {
	Conn    *amqp.Connection
	Channel *amqp.Channel
}

func New(url string) (messaging.EventBus, error) {
	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	log.Println("Successfully connected to RabbitMQ broker!")
	return &RabbitMQ{Conn: conn, Channel: ch}, nil
}

func (r *RabbitMQ) Close() {
	if err := r.Conn.Close(); err != nil {
		log.Println(err.Error())
	}

	if err := r.Channel.Close(); err != nil {
		log.Println(err.Error())
	}
}
