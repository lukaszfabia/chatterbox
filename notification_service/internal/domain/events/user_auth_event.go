package events

type UserAuthEvent struct {
	BaseEvent
	UserID string `json:"userID"`
	Email  string `json:"email"`
}

func (u UserAuthEvent) Log() {}
