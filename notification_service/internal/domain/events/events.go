package events

// Event is the interface that all events should implement.
// It requires a Log method that can be used for logging or handling the event.
type Event interface {
	// Log is a method that should log the event or handle any processing related to the event.
	Log()
}

// BaseEvent provides a basic implementation of the Event interface.
// It can be used as a base for other events that may need to implement the Log method.
type BaseEvent struct {
	// You can add common fields here that are shared by all events.
}

// Log is an empty method for BaseEvent, which can be overridden by derived events if needed.
// Derived events can implement custom logic in this method.
func (b *BaseEvent) Log() {
	// Default empty log method
}
