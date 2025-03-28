package events

type UserDeletedEvent struct {
	BaseEvent
	UserID string `json:"userID"`
}

func (u UserDeletedEvent) Log() {

}
