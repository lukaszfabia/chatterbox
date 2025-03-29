package events

type NotiType string

const (
	CREATED NotiType = "CREATED"
	UPDATED NotiType = "UPDATED"
	DELETED NotiType = "DELETED"
)

type NotifyEvent struct {
	UserID string   `json:"userID"`
	Type   NotiType `json:"type"`
}

func (e NotifyEvent) Log() {
}
