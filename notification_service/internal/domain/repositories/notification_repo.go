package repositories

import (
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/queries"
)

type NotificationRepository interface {
	GetAllNotifications(userID string, q queries.GetNotificationsQuery) ([]*models.Notification, error)
	DeleteNotification(id string) error
	AddNotification(noti models.Notification) (*models.Notification, error)
}
