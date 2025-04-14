// package events defines the structure for handling events within the notification service.
// It provides the EventHandler interface that must be implemented by any component that handles events.
package events

// EventHandler defines the interface for handling events within the system.
// Implementers of this interface must define the logic to process the event data from the queue.
type EventHandler interface {
	// Handle processes the event body. The body is expected to be in the form of a byte slice.
	//
	// Parameters:
	//   - body: The event data as a byte slice to be processed by the handler.
	//
	// Returns:
	//   - An error if there was an issue processing the event; nil if successful.
	Handle(body []byte) error
}
