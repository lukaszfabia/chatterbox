package events

const (
	CREATED string = "CREATED"
	DELETED string = "DELETED"
)

type EmailEvent interface {
	GetEmail() string
}

type EmailNotificationEvent struct {
	UserID string `json:"userID"`
	Email  string `json:"email"`
	Type   string `json:"type"`
}

func (e EmailNotificationEvent) Log() {
}
