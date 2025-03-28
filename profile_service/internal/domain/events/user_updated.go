package events

type UserUpdatedEvent struct {
	BaseEvent
	UserID   string  `json:"userID"`
	Email    *string `json:"email"`
	Username *string `json:"username"`
}

func (ue UserUpdatedEvent) Log() {
}
