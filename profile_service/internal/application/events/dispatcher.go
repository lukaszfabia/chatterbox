package events

import (
	"log"
	"sync"
)

type Dispatcher struct {
	handlers map[string]EventHandler
	mu       sync.RWMutex
}

func NewDispatcher() *Dispatcher {
	return &Dispatcher{
		handlers: make(map[string]EventHandler),
	}
}

func (d *Dispatcher) Register(queueName string, handler EventHandler) {
	d.handlers[queueName] = handler
}

func (d *Dispatcher) HandleEvent(queueName string, msg []byte) error {
	log.Printf("Handling event from '%s'\n", queueName)

	handler, exists := d.handlers[queueName]
	if !exists {
		log.Printf("No handler found for event type: %s", queueName)
	}

	return handler.Handle(msg)
}

func (d *Dispatcher) GetHandler(eventName string) (func([]byte) error, bool) {
	d.mu.RLock()
	defer d.mu.RUnlock()
	handler, exists := d.handlers[eventName]
	return handler.Handle, exists
}
