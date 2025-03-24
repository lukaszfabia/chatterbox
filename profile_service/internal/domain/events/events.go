package events

type Event interface {
	Log()
}

type BaseEvent struct {
	EventName string
}

func (b *BaseEvent) Log() {
}
