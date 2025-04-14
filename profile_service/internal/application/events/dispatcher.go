package events

import (
	"log"
	"sync"
)

// Dispatcher is responsible for managing event handlers and dispatching events to them.
// It allows you to register event handlers for specific event types and then handle events by dispatching them to the corresponding handler.
// It uses a sync.RWMutex to ensure thread-safe access to the handlers map.
type Dispatcher struct {
	handlers map[string]EventHandler // A map of event names to their corresponding event handlers.
	mu       sync.RWMutex            // A read-write lock to ensure safe concurrent access to the handlers map.
}

// NewDispatcher creates and returns a new Dispatcher instance with an empty handlers map.
func NewDispatcher() *Dispatcher {
	return &Dispatcher{
		handlers: make(map[string]EventHandler),
	}
}

// Register adds an event handler for a specific event type, identified by queueName.
// The handler is associated with the given queueName so that the dispatcher can invoke it when an event of that type is received.
func (d *Dispatcher) Register(queueName string, handler EventHandler) {
	d.handlers[queueName] = handler
}

// HandleEvent dispatches the event to the appropriate handler based on the event's queueName.
// It looks up the handler in the handlers map and invokes the Handle method on it.
// If no handler is registered for the event type, it logs a message and does not proceed with handling the event.
func (d *Dispatcher) HandleEvent(queueName string, msg []byte) error {
	log.Printf("Handling event from '%s'\n", queueName)

	handler, exists := d.handlers[queueName]
	if !exists {
		log.Printf("No handler found for event type: %s", queueName)
		return nil
	}

	return handler.Handle(msg)
}

// GetHandler retrieves a registered event handler based on the event's name.
// It returns the handler's `Handle` method and a boolean indicating if the handler exists.
func (d *Dispatcher) GetHandler(eventName string) (func([]byte) error, bool) {
	d.mu.RLock()
	defer d.mu.RUnlock()

	handler, exists := d.handlers[eventName]
	return handler.Handle, exists
}
