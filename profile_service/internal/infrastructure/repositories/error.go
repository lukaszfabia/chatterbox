package repositories

import "fmt"

// UserNotFound formats and returns an error message indicating that a user was not found in the database.
// It takes the original error as a parameter and includes it in the formatted message.
func UserNotFound(err error) error {
	return fmt.Errorf("user not found: %s", err.Error())
}

// FailedToSave formats and returns an error message indicating that there was an error when trying to create a user.
// It takes the original error as a parameter and includes it in the formatted message.
func FailedToSave(err error) error {
	return fmt.Errorf("failed to create user: %s", err.Error())
}
