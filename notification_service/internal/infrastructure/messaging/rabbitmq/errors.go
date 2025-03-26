package rabbitmq

import "fmt"

func FailedToDeclareQueue(err error) error {
	return fmt.Errorf("failed to declare queue :%s", err.Error())
}

func FailedToMarshalEvent(err error) error {
	return fmt.Errorf("failed to marshal event :%s", err.Error())
}

func FailedToPulblish(err error) error {
	return fmt.Errorf("failed to publish event: %s", err.Error())
}
