package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/messaging"
	"reflect"
)

// UserDeletedHandler is responsible for handling the UserDeletedEvent.
// It processes the event, updates the profile state (marks the user as deleted),
// and publishes a notification event.
type UserDeletedHandler struct {
	aggregate aggregates.ProfileAggregate // The aggregate responsible for managing profile states.
	bus       messaging.EventBus          // The event bus used to publish notifications.
}

// NewUserDeletedEventHandler creates a new instance of UserDeletedHandler.
// It accepts the aggregate and event bus to wire up the handler.
func NewUserDeletedEventHandler(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) EventHandler {
	return &UserDeletedHandler{
		aggregate: aggregate,
		bus:       bus,
	}
}

// Handle processes the incoming UserDeletedEvent.
// It deserializes the event from the message body, marks the user profile as deleted,
// and publishes a notification event to the event bus.
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

	err = h.bus.Publish(reflect.TypeOf(n).Name(), event)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
