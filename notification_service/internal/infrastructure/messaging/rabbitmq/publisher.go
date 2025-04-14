// package rabbitmq defines the implementation of the RabbitMQ message bus,
// enabling the publication of events to queues in a RabbitMQ-based message broker.
package rabbitmq

import (
	"encoding/json"
	"notification_serivce/internal/domain/events"

	amqp "github.com/rabbitmq/amqp091-go"
)

// Publish sends an event to a specified queue in the RabbitMQ message broker.
// It declares the queue if it does not already exist and publishes the event to that queue.
// The event is serialized into JSON format before being sent.
//
// Parameters:
//   - queueName (string): The name of the queue to which the event will be sent.
//   - event (events.Event): The event to be published to the queue, which will be marshaled into JSON.
//
// Returns:
//   - error: An error if there is any issue declaring the queue, marshalling the event,
//     or publishing the event to the queue. If no error occurs, it returns nil.
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
