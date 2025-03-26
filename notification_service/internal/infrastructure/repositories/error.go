package repositories

import "fmt"

func UserNotFound(err error) error {
	return fmt.Errorf("user not found: %s", err.Error())
}

func FailedToSave(err error) error {
	return fmt.Errorf("failed to create user: %s", err.Error())
}
