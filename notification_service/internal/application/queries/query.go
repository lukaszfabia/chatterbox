package queries

import (
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/queries"
	"notification_serivce/internal/domain/repositories"
)

type NotificationQueryService interface {
	GetNotifications(userID string, q queries.GetNotificationsQuery) ([]models.Notification, error)
}

type notiQueryServiceImpl struct {
	repo repositories.NotificationRepository
}

func (n *notiQueryServiceImpl) GetNotifications(userID string, q queries.GetNotificationsQuery) ([]models.Notification, error) {
	return n.repo.GetAllNotifications(userID, q)
}

func NewNotiQueryService(repo repositories.NotificationRepository) NotificationQueryService {
	return &notiQueryServiceImpl{repo: repo}
}
