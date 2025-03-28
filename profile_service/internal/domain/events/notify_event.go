package events

type NotiType string

const (
	CREATED NotiType = "CREATED"
	UPDATED NotiType = "UPDATED"
	DELETED NotiType = "DELETED"
)

type NotifyEvent struct {
	UserID string   `json:"userID"`
	Email  string   `json:"email"`
	Type   NotiType `json:"type"`
}

func (u NotifyEvent) Log() {

}

var eventTypeMap = map[Event]NotiType{
	UserDeletedEvent{}: DELETED,
	UserCreatedEvent{}: CREATED,
	UserUpdatedEvent{}: UPDATED,
}

func NewNotifyEvent(uid string, event Event) *NotifyEvent {
	if eventType, ok := eventTypeMap[event]; ok {
		return &NotifyEvent{
			UserID: uid,
			Type:   eventType,
		}
	}
	return nil
}
