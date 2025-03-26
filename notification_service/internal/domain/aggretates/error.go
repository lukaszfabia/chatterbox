package aggregates

import (
	"fmt"
	"notification_serivce/internal/domain/events"
)

func UnsupportedEvent(e events.Event) error {
	return fmt.Errorf("Unsupported event %v", e)
}
