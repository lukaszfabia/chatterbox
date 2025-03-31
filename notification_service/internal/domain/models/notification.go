package models

import (
	"fmt"
	"log"
	"notification_serivce/internal/domain/events"
	"time"

	"github.com/google/uuid"
)

const MAX int = 20

func trimMessage(msg string) string {
	if MAX > len(msg) {
		return msg
	}
	return fmt.Sprintf("%s...", msg[:MAX])
}

type Notification struct {
	ID          uuid.UUID `json:"id"`
	UserID      string    `json:"userID"`
	Sub         string    `json:"sub"`
	Info        string    `json:"info"`
	SentAt      time.Time `json:"sentAt"`
	IsDelivered bool      `json:"isDelivered"`
}

func NewUserNotification(event events.GotNewMessageEvent) Notification {
	return newGotMessageNotification(event)
}

func NewEmailNotification(event events.EmailNotificationEvent) Notification {
	return newEmailNotification(event)
}

func ExmapleNotification() Notification {
	return Notification{
		ID:     uuid.New(),
		UserID: "klshdfsdf",
		Info:   "Lorem ipsum",
		Sub:    "TEST",
		SentAt: time.Now(),
	}
}

func newGotMessageNotification(event events.GotNewMessageEvent) Notification {

	return Notification{
		ID:          uuid.New(),
		UserID:      event.UserID,
		SentAt:      time.Now(),
		Sub:         fmt.Sprintf("Got new message from %s", event.Sender),
		Info:        trimMessage(event.Message),
		IsDelivered: false,
	}
}

func newEmailNotification(event events.EmailNotificationEvent) Notification {
	n := Notification{
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
