package events

type UserDeletedEvent struct {
	BaseEvent
	UserID string `json:"userID"`
	Email  string `json:"email"`
}

func (u UserDeletedEvent) Log() {

}
