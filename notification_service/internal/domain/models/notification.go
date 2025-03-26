package models

import (
	"time"

	"github.com/google/uuid"
)

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

func NewEmailNotification(sub, info, userid string) Notification {
	return newNoti(sub, info, userid, auth)
}

func NewMessageNotification(sub, info, userid string) Notification {
	return newNoti(sub, info, userid, message)
}
