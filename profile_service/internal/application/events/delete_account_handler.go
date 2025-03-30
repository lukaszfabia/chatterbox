package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/messaging"
	"reflect"
)

type UserDeletedHandler struct {
	aggregate aggregates.ProfileAggregate
	bus       messaging.EventBus
}

func NewUserDeletedEventHandler(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) EventHandler {
	return &UserDeletedHandler{
		aggregate: aggregate,
		bus:       bus,
	}
}

func (h *UserDeletedHandler) Handle(body []byte) error {
	var event events.UserDeletedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}
	log.Println(event.UserID)
	err := h.aggregate.MarkAsADeleted(event.UserID)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	n := events.NewNotifyDeletedEvent(event)

	// publish noti
	err = h.bus.Publish(reflect.TypeOf(n).Name(), event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
