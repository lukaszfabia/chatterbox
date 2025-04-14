// package rabbitmq provides utility functions for error handling related to
// the RabbitMQ message broker, particularly when declaring queues,
// marshaling events, or publishing events to queues.
package rabbitmq

import "fmt"

// FailedToDeclareQueue creates an error message when declaring a RabbitMQ queue fails.
//
// Parameters:
//   - err (error): The original error that occurred during the queue declaration.
//
// Returns:
//   - error: A formatted error message indicating that the queue declaration failed.
func FailedToDeclareQueue(err error) error {
	return fmt.Errorf("failed to declare queue: %s", err.Error())
}

// FailedToMarshalEvent creates an error message when marshalling an event into JSON fails.
//
// Parameters:
//   - err (error): The original error that occurred during the event marshalling.
//
// Returns:
//   - error: A formatted error message indicating that marshalling the event failed.
func FailedToMarshalEvent(err error) error {
	return fmt.Errorf("failed to marshal event: %s", err.Error())
}

// FailedToPulblish creates an error message when publishing an event to a RabbitMQ queue fails.
//
// Parameters:
//   - err (error): The original error that occurred during the event publishing.
//
// Returns:
//   - error: A formatted error message indicating that the event publishing failed.
func FailedToPulblish(err error) error {
	return fmt.Errorf("failed to publish event: %s", err.Error())
}
