// package aggregates provides functions and utilities for handling events
// and performing aggregate-related operations within the system.
package aggregates

import (
	"fmt"
	"notification_serivce/internal/domain/events"
)

// UnsupportedEvent is a helper function that creates an error when an unsupported event
// is encountered during event handling or processing.
//
// Parameters:
//   - e: The event that was found to be unsupported.
//
// Returns:
//   - An error with a message stating that the event is unsupported.
func UnsupportedEvent(e events.Event) error {
	return fmt.Errorf("unsupported event %v", e)
}
