package aggregates

import "notification_serivce/internal/domain/repositories"

type NotificationAggregate struct {
	repo repositories.NotificationRepository
}

func NewNotificationAggregate(repo repositories.NotificationRepository) *NotificationAggregate {
	return &NotificationAggregate{
		repo: repo,
	}
}
