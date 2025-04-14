// package repositories provides utility functions for handling errors in the repository layer.
// These functions format error messages for specific cases like user not found or failure to save data.
package repositories

import "fmt"

// UserNotFound formats an error message indicating that a user was not found.
// It takes the original error and returns a new error with a custom message.
func UserNotFound(err error) error {
	return fmt.Errorf("user not found: %s", err.Error())
}

// FailedToSave formats an error message indicating that saving a user failed.
// It takes the original error and returns a new error with a custom message.
func FailedToSave(err error) error {
	return fmt.Errorf("failed to create user: %s", err.Error())
}
