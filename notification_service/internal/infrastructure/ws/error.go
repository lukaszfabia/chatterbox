package ws

import "fmt"

func SendLater() error {
	return fmt.Errorf("user is offline, notification will delivered later")
}
