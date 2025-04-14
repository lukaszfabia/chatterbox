package models

import (
	"fmt"
	"log"
	"notification_serivce/internal/domain/events"
	"time"

	"github.com/google/uuid"
)

// MAX defines the maximum length for the notification message content before trimming.
const MAX int = 20

// trimMessage truncates a notification message to a maximum length (MAX) and appends "..." if it's too long.
func trimMessage(msg string) string {
	if MAX > len(msg) {
		return msg
	}
	return fmt.Sprintf("%s...", msg[:MAX])
}

// Notification represents a notification that is sent to a user.
type Notification struct {
	ID          uuid.UUID `json:"id"`          // Unique identifier for the notification
	UserID      string    `json:"userID"`      // The ID of the user receiving the notification
	Sub         string    `json:"sub"`         // Subject of the notification
	Info        string    `json:"info"`        // Information/content of the notification
	SentAt      time.Time `json:"sentAt"`      // Timestamp when the notification was sent
	IsDelivered bool      `json:"isDelivered"` // Flag indicating whether the notification has been delivered
}

// NewUserNotification creates a new notification when a user receives a new message.
// It takes a GotNewMessageEvent and returns a Notification instance.
func NewUserNotification(event events.GotNewMessageEvent) *Notification {
	return newGotMessageNotification(event)
}

// NewEmailNotification creates a new notification for email-related events (e.g., account creation or deletion).
// It takes an EmailNotificationEvent and returns a Notification instance.
func NewEmailNotification(event events.EmailNotificationEvent) *Notification {
	return newEmailNotification(event)
}

// ExampleNotification returns a sample Notification for testing or example purposes.
func ExmapleNotification() Notification {
	return Notification{
		ID:     uuid.New(),
		UserID: "klshdfsdf",
		Info:   "Lorem ipsum",
		Sub:    "TEST",
		SentAt: time.Now(),
	}
}

// newGotMessageNotification creates a notification for a new message event.
// It takes a GotNewMessageEvent and returns a Notification instance with relevant details.
func newGotMessageNotification(event events.GotNewMessageEvent) *Notification {
	return &Notification{
		ID:          uuid.New(),
		UserID:      event.UserID,
		SentAt:      time.Now(),
		Sub:         fmt.Sprintf("Got new message from %s", event.Sender),
		Info:        trimMessage(event.Message),
		IsDelivered: false,
	}
}

// newEmailNotification creates a notification based on email-related events like account creation or deletion.
// It takes an EmailNotificationEvent and returns a Notification instance with relevant details.
func newEmailNotification(event events.EmailNotificationEvent) *Notification {
	n := &Notification{
		ID:     uuid.New(),
		UserID: event.UserID,
		SentAt: time.Now(),
	}

	switch event.Type {
	case events.DELETED:
		n.Sub = "Deleted Account"
		n.Info = "We will miss you, but remember you can always get back your account."
	case events.CREATED:
		n.Sub = "Welcome to Chatterbox"
		n.Info = "🎉 We're excited to have you on board. Start connecting with friends and exploring new conversations now!\n\nHappy chatting!"
	default:
		log.Printf("unknown notification type: %v", event.Type)
		n.Sub = "Notification"
		n.Info = "You have a new notification"
	}

	log.Printf("created notification for user %s, type: %s", event.UserID, event.Type)
	return n
}
