// package events defines various event types in the system, including
// events related to user notifications, such as receiving new messages.
package events

// GotNewMessageEvent represents an event triggered when a user receives
// a new message. It contains information about the user, sender, and the
// message content.
type GotNewMessageEvent struct {
	// BaseEvent is an embedded struct that might hold common event attributes
	// shared among all event types (e.g., timestamp, event type).
	BaseEvent

	// UserID is the identifier of the user who received the message.
	UserID string `json:"userID"`

	// Sender represents the username or email address of the message sender.
	Sender string `json:"sender"`

	// Message is a snippet or preview of the content of the new message.
	Message string `json:"message"`
}

// Log is a method on GotNewMessageEvent. It is a placeholder for future
// logging functionality, allowing the event details to be logged or processed.
func (g GotNewMessageEvent) Log() {
	// Placeholder for future logging functionality.
}
