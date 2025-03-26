package repositories

import "notification_serivce/internal/domain/models"

type NotificationRepository interface {
	GetAllNotifications(userID string) ([]models.Notification, error)
	DeleteNotification(id string) error
	AddNotification(noti models.Notification) (*models.Notification, error)
}
