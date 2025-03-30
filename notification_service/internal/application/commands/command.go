package commands

import (
	aggregates "notification_serivce/internal/domain/aggretates"
)

type NotificationCommandService interface {
}

type notificationCommandServiceImpl struct {
	aggregate aggregates.NotificationAggregate
}

func NewNotificationCommandService(aggregate aggregates.NotificationAggregate) NotificationCommandService {
	return &notificationCommandServiceImpl{aggregate: aggregate}
}
