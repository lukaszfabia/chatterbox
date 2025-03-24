package events

import (
	"log"
)

type UserCreatedEvent struct {
	BaseEvent
	UserID   string `json:"userID"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

func (e UserCreatedEvent) Log() {
	log.Printf("%s with %s id has requested for create account\n", e.Username, e.UserID)
}
