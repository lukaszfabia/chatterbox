package messaging

import "profile_service/internal/domain/events"

// EventBus represents the interface for a message bus that allows publishing and consuming events.
// It defines the methods for publishing events to a queue, consuming events from a queue, and closing the connection.
//
// Implementing this interface allows for decoupling the event-driven architecture of the system,
// enabling communication between various components or services in an asynchronous manner.
type EventBus interface {
	// Publish sends an event to the specified queue.
	// The event is marshaled into a suitable format (e.g., JSON) before being sent.
	// It returns an error if the event cannot be published due to any failures (queue declaration, marshaling, etc.).
	Publish(queueName string, event events.Event) error

	// Consume listens for messages from the specified queue and invokes the provided handler for each message.
	// The handler function processes the message's body (usually as a byte slice) and can return an error if the processing fails.
	// The method returns an error if it cannot declare the queue or start consuming messages.
	Consume(queueName string, handler func(body []byte) error) error

	// Close gracefully shuts down the EventBus connection and any open channels or resources.
	// It's important to call this method to ensure all resources are cleaned up properly.
	Close()
}
