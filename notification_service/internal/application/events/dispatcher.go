package events

import (
	"log"
)

type Dispatcher struct {
	handlers map[string]EventHandler
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
