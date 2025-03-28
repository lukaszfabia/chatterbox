package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/messaging"
	"reflect"
)

type UserUpdatedHandler struct {
	aggregate aggregates.ProfileAggregate
	bus       messaging.EventBus
}

func NewUserUpdatedEventHandler(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) EventHandler {
	return &UserCreatedHandler{
		aggregate: aggregate,
		bus:       bus,
	}
}

func (h *UserUpdatedHandler) Handle(body []byte) error {
	var event events.UserUpdatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	_, err := h.aggregate.UpdateProfileAuthInfo(event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	n := events.NewNotifyEvent(event.UserID, event)
	// publish noti
	err = h.bus.Publish(reflect.TypeOf(n).Name(), event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
