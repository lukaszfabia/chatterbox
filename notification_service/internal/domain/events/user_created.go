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

type UserAuthEvent struct {
	BaseEvent
	UserID string `json:"userID"`
	Email  string `json:"email"`
}

type GotNewMessageEvent struct {
	BaseEvent
	UserID string `json:"userID"`

	// username or email of the sender
	Sender string `json:"sender"`

	// snipped of the message
	Message string `json:"message"`
}

func (e UserCreatedEvent) Log() {
	log.Printf("%s with %s id has requested for create account\n", e.Username, e.UserID)
}
