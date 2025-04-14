// package messaging defines the EventBus interface for managing message publishing, consuming, and closing event buses.
// It provides a contract for event-driven systems to interact with message queues and manage their lifecycle.
package messaging

// EventBus is an interface that defines methods for publishing, consuming, and closing events.
// It enables interaction with message queues to send and receive events asynchronously and manage connections.
type EventBus interface {
	// Publish sends an event to a specified queue.
	// The event is passed as an argument and can be of any type.
	// Returns an error if the event could not be published.
	Publish(queueName string, event any) error

	// Consume listens for messages from a specified queue.
	// When a message is received, it is passed to the provided handler function.
	// The handler function processes the message body, which is provided as a byte slice.
	// Returns an error if the message could not be consumed.
	Consume(queue string, handler func(body []byte)) error

	// Close shuts down the event bus, cleaning up any resources or connections.
	// It ensures that any active connections or listeners are properly closed.
	// Returns an error if closing the event bus fails.
	Close()
}
