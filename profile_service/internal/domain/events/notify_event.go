package events

import "log"

// Event type constants
const (
	CREATED string = "CREATED" // Event type for user creation
	DELETED string = "DELETED" // Event type for user deletion
)

// EmailNotificationEvent represents the event for sending email notifications about user actions.
// It includes the user ID, email, and the type of notification (creation or deletion).
type EmailNotificationEvent struct {
	UserID string `json:"userID"` // Unique user identifier
	Email  string `json:"email"`  // User's email address
	Type   string `json:"type"`   // Type of the event (CREATED or DELETED)
}

// Log outputs a log message for the email notification event.
func (u EmailNotificationEvent) Log() {
	log.Printf("Sending %s notification to user with email: %s\n", u.Type, u.Email)
}

// NewNotifyCreatedEvent creates a new EmailNotificationEvent for a user creation event.
// It takes a UserCreatedEvent as input and returns the corresponding EmailNotificationEvent.
func NewNotifyCreatedEvent(created UserCreatedEvent) EmailNotificationEvent {
	return EmailNotificationEvent{
		UserID: created.UserID,
		Email:  created.Email,
		Type:   CREATED,
	}
}

// NewNotifyDeletedEvent creates a new EmailNotificationEvent for a user deletion event.
// It takes a UserDeletedEvent as input and returns the corresponding EmailNotificationEvent.
func NewNotifyDeletedEvent(deleted UserDeletedEvent) EmailNotificationEvent {
	return EmailNotificationEvent{
		UserID: deleted.UserID,
		Email:  deleted.Email,
		Type:   DELETED,
	}
}
