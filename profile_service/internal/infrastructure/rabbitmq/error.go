package rabbitmq

import "fmt"

func NoMatchingEvent() error {
	return fmt.Errorf("no matching event")
}

func FailedToParseEvent() error {
	return fmt.Errorf("failed to parse event")
}
