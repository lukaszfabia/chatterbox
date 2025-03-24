package events

import (
	"encoding/json"
	"log"
	"profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/repositories"
)

type UserCreatedHandler struct {
	repo repositories.ProfileRepository
}

func (h *UserCreatedHandler) Handle(body []byte) error {
	var event events.UserCreatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	err := h.repo.CreateUser(uint(event.UserID), event.Username, event.Email)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
