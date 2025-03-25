package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
)

type UserCreatedHandler struct {
	aggregate aggregates.ProfileAggregate
}

func NewUserCreatedHandler(aggregate aggregates.ProfileAggregate) EventHandler {
	return &UserCreatedHandler{
		aggregate: aggregate,
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

	return nil
}
