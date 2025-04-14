package queries

import (
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/queries"
)

// GetNotifications is the implementation of the GetNotifications method.
// It fetches notifications for a user from the repository based on the query parameters.
func (n *notiQueryServiceImpl) GetNotifications(userID string, q queries.GetNotificationsQuery) ([]models.Notification, error) {
	return n.repo.GetAllNotifications(userID, q)
}
