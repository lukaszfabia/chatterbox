package aggregates

import (
	"fmt"
	"log"
	"notification_serivce/internal/domain/events"
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/repositories"
	"notification_serivce/internal/infrastructure/email"
	"reflect"
)

type NotificationAggregate struct {
	repo repositories.NotificationRepository
}

func NewNotificationAggregate(repo repositories.NotificationRepository) *NotificationAggregate {
	return &NotificationAggregate{
		repo: repo,
	}
}

func (n *NotificationAggregate) Send(event events.Event) error {
	noti := models.NewUserNotification(event)

	eventType := reflect.TypeOf(event).Name()
	log.Printf("Processing event of type: %s", eventType)

	if _, err := n.repo.AddNotification(noti); err != nil {
		log.Printf("Failed to add notification for event %s: %v", eventType, err)
		return fmt.Errorf("failed to add notification: %w", err)
	}

	switch e := event.(type) {
	case events.UserAuthEvent:
		email.SendEmail(noti, e.Email)
	case events.UserCreatedEvent:
		email.SendEmail(noti, e.Email)

	default:
		log.Printf("No specific handler for event type %s", eventType)
	}

	return nil
}
