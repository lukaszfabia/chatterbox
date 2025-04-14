package ws

import "fmt"

// SendLater handles the case when a user is offline and the notification will be sent later.
func SendLater() error {
	return fmt.Errorf("user is offline, notification will be delivered later")
}
