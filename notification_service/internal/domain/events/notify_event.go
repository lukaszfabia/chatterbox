// package events defines constants and interfaces related to events
// in the system, particularly focusing on email notifications.
package events

// Event types represented as constants.
const (
	// CREATED represents an event type for newly created entities.
	CREATED string = "CREATED"

	// DELETED represents an event type for deleted entities.
	DELETED string = "DELETED"
)

// EmailEvent is an interface that defines a method for retrieving the
// email associated with an event.
type EmailEvent interface {
	// GetEmail returns the email address associated with the event.
	GetEmail() string
}

// EmailNotificationEvent represents an event containing information
// about an email notification, including the user ID, email address,
// and the type of event (e.g., CREATED or DELETED).
type EmailNotificationEvent struct {
	// UserID is the identifier of the user associated with the event.
	UserID string `json:"userID"`

	// Email is the email address associated with the event.
	Email string `json:"email"`

	// Type is the type of event (e.g., CREATED or DELETED).
	Type string `json:"type"`
}

// Log is a method on EmailNotificationEvent that could potentially log
// the event or perform some action. Currently, it is empty and serves
// as a placeholder for future logging logic.
func (e EmailNotificationEvent) Log() {
	// Placeholder for future logging functionality.
}
