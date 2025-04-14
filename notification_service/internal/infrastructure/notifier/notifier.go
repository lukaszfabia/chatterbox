// package notifier defines the Notifier interface for sending notifications.
// It provides a contract for sending notifications to users through different channels.
package notifier

import "notification_serivce/internal/domain/models"

// Notifier is an interface that defines the method for sending notifications to users.
// It requires any implementing type to define the NotifyUser method which sends a notification.
type Notifier interface {
	// NotifyUser sends a notification to a user.
	// It accepts a notification object and an optional email address.
	// Returns an error if the notification could not be delivered.
	NotifyUser(notification models.Notification, email *string) error
}
