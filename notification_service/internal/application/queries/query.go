package queries

import (
	"notification_serivce/internal/domain/repositories"
)

type NotificationQueryService interface {
}

type profileQueryServiceImpl struct {
	repo repositories.NotificationRepository
}

func NewProfileQueryService(repo repositories.NotificationRepository) NotificationQueryService {
	return &profileQueryServiceImpl{repo: repo}
}
