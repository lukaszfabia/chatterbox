package events

import "log"

type UserCreatedEvent struct {
	BaseEvent
	UserID   int    `json:"userID"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

func (e UserCreatedEvent) Log() {
	log.Printf("%s with %d id has requested for create account\n", e.Username, e.UserID)
}
