package events

import "log"

// Event interface that all event types must implement
type Event interface {
	Log() // All events must implement Log
}

// BaseEvent provides a default implementation of the Log method.
type BaseEvent struct {
}

// Log is a default implementation for logging base events
// You can extend this to include common properties for logging.
func (b *BaseEvent) Log() {
	log.Println("Logging base event...")
}
