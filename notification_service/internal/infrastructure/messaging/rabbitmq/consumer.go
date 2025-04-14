// package rabbitmq provides functions to interact with RabbitMQ, including
// publishing and consuming events.
package rabbitmq

import (
	"log"
	"notification_serivce/internal/application/events"
)

// Consume consumes messages from a RabbitMQ queue and dispatches them to
// the appropriate handler via the events.Dispatcher.
//
// It declares the queue (if not already declared), starts consuming
// messages, and for each message received, the dispatcher handles the event.
//
// Parameters:
//   - queueName (string): The name of the RabbitMQ queue to consume from.
//   - dispatcher (*events.Dispatcher): The event dispatcher responsible for
//     handling the consumed events.
//
// Returns:
//   - error: An error if any occurs during the queue declaration or message
//     consumption, otherwise nil.
func (r *RabbitMQ) Consume(queueName string, dispatcher *events.Dispatcher) error {
	_, err := r.Channel.QueueDeclare(queueName, true, false, false, false, nil)
	if err != nil {
		log.Printf("Failed to declare queue %s: %v", queueName, err)
		return err
	}

	msgs, err := r.Channel.Consume(
		queueName,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	log.Printf("[x] Starting consuming %s\n", queueName)

	for msg := range msgs {
		if err := dispatcher.HandleEvent(queueName, msg.Body); err != nil {
			log.Printf("Error handling event from queue %s: %v", queueName, err)
		}
	}
	return nil
}
