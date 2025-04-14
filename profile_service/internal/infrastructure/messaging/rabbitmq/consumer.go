package rabbitmq

import "log"

// Consume subscribes to a given RabbitMQ queue and processes incoming messages using the provided handler function.
// It declares the queue (if it doesn't already exist), starts consuming messages asynchronously,
// and passes each message's body to the handler function.
//
// Parameters:
//   - queue: the name of the queue to consume from.
//   - handler: a callback function that takes the message body as a byte slice and returns an error.
//
// If the handler returns an error for any message, the error is logged, but the consumer continues processing.
//
// Example usage:
//
//	rabbitMQ.Consume("user.created", func(body []byte) error {
//	    fmt.Printf("Got message: %s\n", string(body))
//	    return nil
//	})
//
// Returns an error if the queue cannot be declared or consumption fails to start.
func (r *RabbitMQ) Consume(queue string, handler func(body []byte) error) error {
	log.Printf("Starting consuming from %s\n", queue)

	_, err := r.Channel.QueueDeclare(queue, true, false, false, false, nil)
	if err != nil {
		log.Printf("Failed to declare queue %s: %v", queue, err)
		return FailedToDeclareQueue(err)
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
