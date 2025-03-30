package events

const (
	CREATED string = "CREATED"
	DELETED string = "DELETED"
)

type EmailNotificationEvent struct {
	UserID string `json:"userID"`
	Email  string `json:"email"`
	Type   string `json:"type"`
}

func (u EmailNotificationEvent) Log() {

}

func NewNotifyCreatedEvent(created UserCreatedEvent) EmailNotificationEvent {
	return EmailNotificationEvent{
		UserID: created.UserID,
		Email:  created.Email,
		Type:   CREATED,
	}
}

func NewNotifyDeletedEvent(deleted UserDeletedEvent) EmailNotificationEvent {
	return EmailNotificationEvent{
		UserID: deleted.UserID,
		Email:  deleted.Email,
		Type:   DELETED,
	}
}
