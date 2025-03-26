package events

type GotNewMessageEvent struct {
	BaseEvent
	UserID string `json:"userID"`

	// username or email of the sender
	Sender string `json:"sender"`

	// snipped of the message
	Message string `json:"message"`
}

func (g GotNewMessageEvent) Log() {}
