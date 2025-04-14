package events

import (
	"log"
	"time"
)

// UserDeletedEvent represents an event where a user deletes their account or profile.
// It includes details about the user such as their ID and email.
type UserDeletedEvent struct {
	BaseEvent        // Embedding BaseEvent allows UserDeletedEvent to inherit its properties
	UserID    string `json:"userID"` // Unique identifier for the user
	Email     string `json:"email"`  // Email address of the deleted user
}

// Log is a method that logs the details of the UserDeletedEvent.
// It records the event details in a structured log message, including the user ID,
// the email of the deleted user, and the time of deletion.
func (u UserDeletedEvent) Log() {
	logMessage := "User deleted event - UserID: " + u.UserID + ", Email: " + u.Email + ", Time: " + time.Now().Format(time.RFC3339)

	log.Println(logMessage)
}
