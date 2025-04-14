package repositories

import (
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/queries"
)

// NotificationRepository defines the methods required for interacting with notifications
// in a repository (e.g., database, in-memory store).
type NotificationRepository interface {
	// GetAllNotifications retrieves all notifications for a specific user.
	//
	// Parameters:
	// - userID: The unique ID of the user for whom notifications are to be fetched.
	// - q: The query parameters to filter or paginate the notifications.
	//
	// Returns:
	// - A slice of Notification models and an error (if any).
	GetAllNotifications(userID string, q queries.GetNotificationsQuery) ([]models.Notification, error)

	// DeleteNotification removes a notification from the repository by its ID.
	//
	// Parameters:
	// - id: The unique ID of the notification to delete.
	//
	// Returns:
	// - An error (if any) indicating failure to delete the notification.
	DeleteNotification(id string) error

	// AddNotification inserts a new notification into the repository.
	//
	// Parameters:
	// - noti: The Notification model to be added.
	//
	// Returns:
	// - A pointer to the newly created Notification and an error (if any).
	AddNotification(noti models.Notification) (*models.Notification, error)
}
