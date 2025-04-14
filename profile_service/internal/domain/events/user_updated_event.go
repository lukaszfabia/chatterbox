package events

import (
	"log"
	"time"
)

// UserUpdatedEvent represents an event where a user updates their profile information,
// such as their email and username.
type UserUpdatedEvent struct {
	BaseEvent         // Embedding BaseEvent allows UserUpdatedEvent to inherit its properties
	UserID    string  `json:"userID"`   // Unique identifier for the user
	Email     *string `json:"email"`    // Updated email address (optional)
	Username  *string `json:"username"` // Updated username (optional)
}

// Log is a method that logs the details of the UserUpdatedEvent.
// It records the event details in a structured log message, including the user ID,
// and any updated email or username.
func (ue UserUpdatedEvent) Log() {
	logMessage := "User updated event - UserID: " + ue.UserID
	if ue.Email != nil {
		logMessage += ", Email: " + *ue.Email
	}
	if ue.Username != nil {
		logMessage += ", Username: " + *ue.Username
	}
	logMessage += ", Time: " + time.Now().Format(time.RFC3339)

	log.Println(logMessage)
}
