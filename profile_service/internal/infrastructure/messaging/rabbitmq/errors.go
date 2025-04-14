package rabbitmq

import "fmt"

// FailedToDeclareQueue returns a formatted error indicating that queue declaration has failed.
//
// This is useful for wrapping the original error with context specific to queue declaration failures.
func FailedToDeclareQueue(err error) error {
	return fmt.Errorf("failed to declare queue :%s", err.Error())
}

// FailedToMarshalEvent returns a formatted error indicating that event marshaling (e.g., to JSON) has failed.
//
// This is typically used when preparing data for publishing to a queue.
func FailedToMarshalEvent(err error) error {
	return fmt.Errorf("failed to marshal event :%s", err.Error())
}

// FailedToPulblish returns a formatted error indicating that publishing an event to the queue has failed.
//
// Use this to provide clearer context when a publish operation does not succeed.
func FailedToPulblish(err error) error {
	return fmt.Errorf("failed to publish event: %s", err.Error())
}
