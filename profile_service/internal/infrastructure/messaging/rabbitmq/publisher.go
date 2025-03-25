package rabbitmq

import (
	"encoding/json"
	"profile_service/internal/domain/events"

	amqp "github.com/rabbitmq/amqp091-go"
)

func (r *RabbitMQ) Publish(queueName string, event events.Event) error {
	_, err := r.Channel.QueueDeclare(
		queueName,
		true,  // durable
		false, // autoDelete
		false, // exclusive
		false, // noWait
		nil,   // args
	)
	if err != nil {
		return FailedToDeclareQueue(err)
	}

	body, err := json.Marshal(event)
	if err != nil {
		return FailedToMarshalEvent(err)
	}

	err = r.Channel.Publish(
		"",
		queueName,
		false,
		false,
		amqp.Publishing{
			ContentType:  "application/json",
			Body:         body,
			DeliveryMode: amqp.Persistent,
		},
	)

	return FailedToPulblish(err)
}
