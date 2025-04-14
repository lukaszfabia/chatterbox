package events

import (
	"log"
)

// UserCreatedEvent represents the event when a user creates an account.
// It contains details about the user, including their ID, email, and username.
type UserCreatedEvent struct {
	BaseEvent        // Embedding BaseEvent to inherit its properties
	UserID    string `json:"userID"`   // Unique identifier for the user
	Email     string `json:"email"`    // Email address of the user
	Username  string `json:"username"` // Username chosen by the user
}

// Log is a method that logs the details of the UserCreatedEvent.
// It outputs a log message containing the user's username and user ID,
// stating that a user has requested to create an account.
func (e UserCreatedEvent) Log() {
	log.Printf("User %s with ID %s has requested to create an account.\n", e.Username, e.UserID)
}
