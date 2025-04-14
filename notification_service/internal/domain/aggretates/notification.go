package aggregates

import (
	"fmt"
	"log"
	"notification_serivce/internal/domain/events"
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/repositories"
	"reflect"
)

// NotificationAggregate is responsible for handling notifications in the system.
// It interacts with the repository to create, update, and manage notifications.
type NotificationAggregate struct {
	repo repositories.NotificationRepository // Repository to store notifications
}

// NewNotificationAggregate creates and returns a new instance of NotificationAggregate.
// It takes a repository as an argument for managing notifications.
func NewNotificationAggregate(repo repositories.NotificationRepository) *NotificationAggregate {
	return &NotificationAggregate{
		repo: repo,
	}
}

// CreateNotification processes an event and creates a corresponding notification.
// It handles different event types and generates the appropriate notification model.
//
// Parameters:
// - event: The event that triggered the creation of the notification. It can be of different types.
//
// Returns:
// - A pointer to the created Notification and an error (if any).
func (n *NotificationAggregate) CreateNotification(event events.Event) (*models.Notification, error) {
	var notification *models.Notification
	var eventType string

	switch e := event.(type) {
	case events.EmailNotificationEvent:
		notification = models.NewEmailNotification(e)
		eventType = reflect.TypeOf(e).Name()

	case events.GotNewMessageEvent:
		notification = models.NewUserNotification(e)
		eventType = reflect.TypeOf(e).Name()

	default:
		return nil, fmt.Errorf("unsupported event type: %T", event)
	}

	log.Printf("Processing event of type: %s", eventType)

	if _, err := n.repo.AddNotification(*notification); err != nil {
		log.Printf("Failed to add notification for event %s: %v", eventType, err)
		return nil, fmt.Errorf("failed to add notification: %w", err)
	}

	log.Printf("Created notification: %v", notification)
	return notification, nil
}
