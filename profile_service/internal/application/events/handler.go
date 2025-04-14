package events

// EventHandler defines an interface for handling events in the system.
// Any event handler that wants to process events must implement this interface.
// The Handle method is responsible for processing the event and performing
// any necessary actions, such as updating a system or publishing a notification.

// Handle processes the event by accepting its body as a byte slice, unmarshalling the data,
// and performing the required actions for that event.
// The method returns an error if any issue arises during event handling; otherwise, it returns nil.
type EventHandler interface {
	Handle(body []byte) error // Handles an event by processing its body (in byte format).
}
