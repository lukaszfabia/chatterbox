package domain

import "time"

type NotificationType string

const (
	Message NotificationType = "message"
	System  NotificationType = "system"

	//add other
)

type Notification struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"createdAt"`

	UserID string           `json:"userId"`
	Type   NotificationType `json:"type"`
	Title  string           `json:"title"`
	Body   string           `json:"body"`

	// Timestamp with read time
	ReadAt time.Time `json:"readAt"`
}
