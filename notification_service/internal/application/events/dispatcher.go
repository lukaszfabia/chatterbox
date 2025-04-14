// package events defines structures and handlers for processing various events within the notification service.
// The Dispatcher is responsible for dispatching events to the appropriate handlers based on the event queue name.
package events

import (
	"log"
)

// Dispatcher is responsible for managing and dispatching events to the correct handlers.
// It holds a map of handlers, each keyed by the event queue name. The dispatcher registers and invokes the
// appropriate event handlers to process events.
type Dispatcher struct {
	handlers map[string]EventHandler
}

// NewDispatcher creates and returns a new instance of the Dispatcher.
// It initializes the handler map to allow the registration of event handlers.
//
// Returns:
//   - A pointer to a newly created Dispatcher instance.
func NewDispatcher() *Dispatcher {
	return &Dispatcher{
		handlers: make(map[string]EventHandler),
	}
}

// Register adds a new event handler to the dispatcher for a specific queue name (event type).
// The handler will be called whenever an event is received for that queue.
//
// Parameters:
//   - queueName: The name of the event queue (event type) that this handler will process.
//   - handler: The EventHandler that will handle events for the given queue.
//
// Example:
//
//	dispatcher.Register("NewMessageQueue", NewEmailNotificationEventHandler(aggregate, notifier))
func (d *Dispatcher) Register(queueName string, handler EventHandler) {
	d.handlers[queueName] = handler
}

// HandleEvent processes an incoming event message by dispatching it to the correct handler based on the queue name.
// If no handler is found for the specified queue name, a log entry will be made.
//
// Parameters:
//   - queueName: The name of the event queue (event type) to handle.
//   - msg: The message (event data) to be processed by the handler.
//
// Returns:
//   - An error if there is an issue handling the event, or nil if the event was handled successfully.
//
// Example:
//
//	err := dispatcher.HandleEvent("NewMessageQueue", eventData)
func (d *Dispatcher) HandleEvent(queueName string, msg []byte) error {
	log.Printf("Handling event from '%s'\n", queueName)

	handler, exists := d.handlers[queueName]
	if !exists {
		log.Printf("No handler found for event type: %s", queueName)
		return nil
	}

	return handler.Handle(msg)
}
