package rabbitmq

import (
	"log"
	"profile_service/internal/application/events"
)

func (r *RabbitMQ) Consume(queueName string, dispatcher *events.Dispatcher) error {
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

	for msg := range msgs {
		if err := dispatcher.HandleEvent(queueName, msg.Body); err != nil {
			log.Printf("Error handling event from queue %s: %v", queueName, err)
		}
	}
	return nil
}
