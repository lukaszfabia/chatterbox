package events

import (
	"encoding/json"
	"fmt"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
)

type UserCreatedHandler struct {
	aggregate aggregates.ProfileAggregate
}

func (h *UserCreatedHandler) Handle(body []byte) error {
	var event events.UserCreatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	// err := h.aggregate.CreateProfile()

	err := fmt.Errorf("")

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
