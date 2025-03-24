package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
	"profile_service/internal/domain/models/writemodels"
)

type UserCreatedHandler struct {
	aggregate aggregates.ProfileAggregate
}

func (h *UserCreatedHandler) Handle(body []byte) error {
	var event events.UserCreatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	profile, errr := writemodels.NewProfileFromEvent(event)

	if errr != nil {
		log.Println(errr.Error())
	}

	_, err := h.aggregate.CreateProfile(*profile)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
