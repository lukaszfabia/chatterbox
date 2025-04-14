package rabbitmq

import (
	"encoding/json"
	"log"
	"profile_service/internal/domain/events"

	amqp "github.com/rabbitmq/amqp091-go"
)

// Publish publishes an event to the given RabbitMQ queue.
//
// It ensures the queue exists (declares it if needed), marshals the event to JSON,
// and sends it with persistent delivery mode.
//
// Returns an error if queue declaration, marshaling, or publishing fails.
func (r *RabbitMQ) Publish(queueName string, event events.Event) error {
	_, err := r.Channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return FailedToDeclareQueue(err)
	}

	body, err := json.Marshal(event)
	if err != nil {
		return FailedToMarshalEvent(err)
	}

	log.Printf("Publishing new %s -> %s", queueName, event)

	err = r.Channel.Publish(
		"",        // exchange
		queueName, // routing key
		false,     // mandatory
		false,     // immediate
		amqp.Publishing{
			ContentType:  "application/json",
			Body:         body,
			DeliveryMode: amqp.Persistent,
		},
	)

	if err != nil {
		return FailedToPulblish(err)
	}

	return nil
}
