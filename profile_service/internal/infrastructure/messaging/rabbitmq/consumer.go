package rabbitmq

import (
	"log"
)

func (r *RabbitMQ) Consume(queue string, handler func(body []byte) error) error {
	_, err := r.Channel.QueueDeclare(queue, true, false, false, false, nil)
	if err != nil {
		log.Printf("Failed to declare queue %s: %v", queue, err)
		return err
	}

	msgs, err := r.Channel.Consume(queue, "", true, false, false, false, nil)
	if err != nil {
		return err
	}

	go func() {
		for msg := range msgs {
			log.Printf("[x] Received message %s\n", msg.Body)
			err := handler(msg.Body)
			if err != nil {
				log.Printf("Error handling event from queue %s: %v", queue, err)
			}
		}
	}()

	log.Printf("Consuming from queue: %s", queue)
	return nil
}
