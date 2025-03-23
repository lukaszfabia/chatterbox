package repository

import "fmt"

func UserNotFound() error {
	return fmt.Errorf("UserNotFound")
}
