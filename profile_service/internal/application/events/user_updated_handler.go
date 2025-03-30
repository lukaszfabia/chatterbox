package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
)

type UserUpdatedHandler struct {
	aggregate aggregates.ProfileAggregate
}

func NewUserUpdatedEventHandler(aggregate aggregates.ProfileAggregate) EventHandler {
	return &UserCreatedHandler{
		aggregate: aggregate,
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

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
