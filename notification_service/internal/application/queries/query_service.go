// package queries defines the query-related services and methods for handling
// notification data in the notification service, allowing retrieval of notifications
// based on user and query parameters.
package queries

import (
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/queries"
	"notification_serivce/internal/domain/repositories"
)

// NotificationQueryService defines the interface for querying notifications.
// It allows retrieval of notifications for a specific user with pagination and other filters.
type NotificationQueryService interface {
	// GetNotifications retrieves a paginated list of notifications for a given user.
	//
	// Parameters:
	//   - userID: The ID of the user whose notifications are to be fetched.
	//   - q: The query containing pagination and filtering information.
	//
	// Returns:
	//   - A slice of models.Notification and an error.
	//   - If an error occurs, it returns the error.
	GetNotifications(userID string, q queries.GetNotificationsQuery) ([]models.Notification, error)
}

// notiQueryServiceImpl is the implementation of the NotificationQueryService interface.
// It interacts with the repository to fetch notifications.
type notiQueryServiceImpl struct {
	repo repositories.NotificationRepository
}

// NewNotiQueryService creates and returns a new instance of NotificationQueryService.
// It takes a repository as a dependency to interact with the underlying database.
func NewNotiQueryService(repo repositories.NotificationRepository) NotificationQueryService {
	return &notiQueryServiceImpl{repo: repo}
}
