// package events defines handlers for processing different types of events within the notification service.
// The EmailNotificationEventHandler handles the "EmailNotificationEvent" type and performs actions like
// creating notifications and notifying users via email.
package events

import (
	"encoding/json"
	"log"
	aggregates "notification_serivce/internal/domain/aggretates"
	"notification_serivce/internal/domain/events"
	"notification_serivce/internal/infrastructure/notifier"
)

// EmailNotificationEventHandler is an event handler responsible for processing email notification events.
// It listens to "EmailNotificationEvent" events and creates a corresponding notification in the system,
// then sends a notification to the user via email.
type EmailNotificationEventHandler struct {
	aggregate aggregates.NotificationAggregate
	notifier  notifier.Notifier
}

// NewEmailNotificationEventHandler creates a new instance of EmailNotificationEventHandler.
// This function initializes the handler with the provided notification aggregate and notifier.
//
// Parameters:
//   - aggregate: The notification aggregate used to create notifications.
//   - notifier: The notifier that will be used to notify the user via email.
//
// Returns:
//   - A pointer to the EmailNotificationEventHandler.
func NewEmailNotificationEventHandler(aggregate aggregates.NotificationAggregate, notifier notifier.Notifier) EventHandler {
	return &EmailNotificationEventHandler{
		aggregate: aggregate,
		notifier:  notifier,
	}
}

// Handle processes the incoming email notification event. It unmarshals the event data from the byte slice,
// creates a notification based on the event, and sends an email notification to the user.
//
// Parameters:
//   - body: The event data as a byte slice to be processed. The body is expected to represent an
//     EmailNotificationEvent.
//
// Returns:
//   - An error if there was an issue processing the event; nil if successful.
func (g *EmailNotificationEventHandler) Handle(body []byte) error {
	log.Println("Handling EmailNotificationEvent...")
	var event events.EmailNotificationEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	noti, err := g.aggregate.CreateNotification(event)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	if err := g.notifier.NotifyUser(*noti, &event.Email); err != nil {
		log.Println(err.Error())
	}

	return nil
}
