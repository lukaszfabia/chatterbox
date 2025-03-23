package rabbitmq

import (
	"fmt"
	"log"
	"profile_service/internal/domain"
	"reflect"
)

type Dispatcher struct {
	handlers map[string]func(event domain.Event)
}

func NewDispatcher() *Dispatcher {
	return &Dispatcher{
		handlers: make(map[string]func(event domain.Event)),
	}
}

func (d *Dispatcher) RegisterHandler(event domain.Event, handler func(event domain.Event)) {
	d.handlers[fmt.Sprint(reflect.TypeOf(event).Elem())] = handler
}

func (d *Dispatcher) HandleEvent(event domain.Event) {
	eventType := fmt.Sprint(reflect.TypeOf(event).Elem())

	if handler, exists := d.handlers[eventType]; exists {
		handler(event)
	} else {
		log.Printf("No handler found for event type: %s", eventType)
	}
}
