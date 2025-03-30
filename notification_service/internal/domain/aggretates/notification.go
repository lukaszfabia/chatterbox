package aggregates

import (
	"fmt"
	"log"
	"notification_serivce/internal/domain/events"
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/repositories"
	"notification_serivce/internal/infrastructure/email"
	"notification_serivce/internal/infrastructure/ws"
	"reflect"
)

type NotificationAggregate struct {
	repo     repositories.NotificationRepository
	wsServer *ws.WebSocketServer
}

func NewNotificationAggregate(repo repositories.NotificationRepository, wsServer *ws.WebSocketServer) *NotificationAggregate {
	return &NotificationAggregate{
		repo:     repo,
		wsServer: wsServer,
	}
}

func (n *NotificationAggregate) Send(event events.EmailNotificationEvent) error {
	noti := models.NewEmailNotification(event)

	eventType := reflect.TypeOf(event).Name()
	log.Printf("Processing event of type: %s", eventType)

	if _, err := n.repo.AddNotification(noti); err != nil {
		log.Printf("Failed to add notification for event %s: %v", eventType, err)
		return fmt.Errorf("failed to add notification: %w", err)
	}

	log.Printf("Created notification: %v", noti)

	email.SendEmail(noti, event.Email)

	return nil
}

func (n *NotificationAggregate) SendPush(event events.GotNewMessageEvent) error {
	notification := models.NewUserNotification(event)

	if _, err := n.repo.AddNotification(notification); err != nil {
		log.Println("Failed to create notification")
		return err
	}

	n.wsServer.SendNotification(notification)

	return nil
}
