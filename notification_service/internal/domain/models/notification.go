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
	return msg[:MAX]
}

type NotiType string

const (
	message NotiType = "message"
	auth    NotiType = "auth"
)

type Notification struct {
	ID     uuid.UUID `json:"id"`
	UserID string    `json:"userID"`
	Type   NotiType  `json:"type"`
	Sub    string    `json:"sub"`
	Info   string    `json:"info"`
	SentAt time.Time `json:"sentAt"`
}

func newNoti(sub, info, userid string, typo NotiType) Notification {
	return Notification{
		ID:     uuid.New(),
		UserID: userid,
		Type:   typo,
		Info:   info,
		Sub:    sub,
		SentAt: time.Now(),
	}
}

func NewUserNotification(event events.Event) Notification {
	switch e := event.(type) {
	case events.UserAuthEvent:
		userid := e.UserID
		sub := "Hello Again!"
		info := "Start chatting now!"
		return newNoti(sub, info, userid, message)

	case events.UserCreatedEvent:
		userid := e.UserID
		sub := fmt.Sprintf("Welcome %s!", e.Username)
		info := "Your account has been created successfully, you can login by your email or username."
		return newNoti(sub, info, userid, message)

	case events.GotNewMessageEvent:
		userid := e.UserID
		sub := fmt.Sprintf("Got new message from %s!", e.Sender)

		info := trimMessage(e.Message)

		return newNoti(sub, info, userid, message)

	default:
		log.Println("No match")
		return Notification{}
	}
}

func ExmapleNotification() Notification {
	return Notification{
		ID:     uuid.New(),
		UserID: "klshdfsdf",
		Type:   auth,
		Info:   "Lorem ipsum",
		Sub:    "TEST",
		SentAt: time.Now(),
	}
}
