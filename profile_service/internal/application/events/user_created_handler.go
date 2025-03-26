package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/messaging"
	"reflect"
)

type UserCreatedHandler struct {
	aggregate aggregates.ProfileAggregate
	bus       messaging.EventBus
}

func NewUserCreatedEventHandler(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) EventHandler {
	return &UserCreatedHandler{
		aggregate: aggregate,
		bus:       bus,
	}
}

func (h *UserCreatedHandler) Handle(body []byte) error {
	var event events.UserCreatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	_, err := h.aggregate.CreateProfile(event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	err = h.bus.Publish(reflect.TypeOf(event).Name(), event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
