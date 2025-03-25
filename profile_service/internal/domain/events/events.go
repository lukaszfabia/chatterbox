package events

type Event interface {
	Log()
}

type BaseEvent struct {
}

func (b *BaseEvent) Log() {
}
