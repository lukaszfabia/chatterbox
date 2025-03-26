package rabbitmq

import (
	"log"
)

func (r *RabbitMQ) Consume(queue string, handler func(body []byte) error) error {
	msgs, err := r.Channel.Consume(queue, "", true, false, false, false, nil)
	if err != nil {
		return err
	}

	go func() {
		for msg := range msgs {
			err := handler(msg.Body)
			if err != nil {
				log.Printf("Error handling event from queue %s: %v", queue, err)
			}
		}
	}()

	log.Printf("Consuming from queue: %s", queue)
	return nil
}
