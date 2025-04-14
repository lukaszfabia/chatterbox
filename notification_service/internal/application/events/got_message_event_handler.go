package events

import (
	"encoding/json"
	"log"
	aggregates "notification_serivce/internal/domain/aggretates"
	"notification_serivce/internal/domain/events"
	"notification_serivce/internal/infrastructure/notifier"
)

// GotNewMessageEventHandler is responsible for handling the GotNewMessageEvent.
// It creates a notification for the user who has received a new message
// and sends a notification via the notifier service.
type GotNewMessageEventHandler struct {
	aggregate aggregates.NotificationAggregate // Aggregate to manage notifications
	notifier  notifier.Notifier                // Notifier to send notifications to the user
}

// NewGotNewMessageEventHandler creates and returns a new instance of GotNewMessageEventHandler.
// It takes a NotificationAggregate and Notifier as dependencies for handling the event.
func NewGotNewMessageEventHandler(aggregate aggregates.NotificationAggregate, notifier notifier.Notifier) EventHandler {
	return &GotNewMessageEventHandler{
		aggregate: aggregate,
		notifier:  notifier,
	}
}

// Handle processes the GotNewMessageEvent and performs the following steps:
// 1. Unmarshals the event data from JSON.
// 2. Creates a notification using the aggregate.
// 3. Sends a notification to the user using the notifier service.
//
// Parameters:
// - body: The byte slice containing the event data (expected to be a JSON payload).
//
// Returns:
// - An error if any issues arise during event handling (parsing, creating notification, or sending notification).
func (g *GotNewMessageEventHandler) Handle(body []byte) error {
	log.Println("Handling GotNewMessageEvent...")
	var event events.GotNewMessageEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	noti, err := g.aggregate.CreateNotification(event)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	if err := g.notifier.NotifyUser(*noti, nil); err != nil {
		log.Println("User is offline")
	}

	return nil
}
