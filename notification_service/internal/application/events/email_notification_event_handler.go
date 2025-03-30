package events

import (
	"encoding/json"
	"log"
	aggregates "notification_serivce/internal/domain/aggretates"
	"notification_serivce/internal/domain/events"
)

type EmailNotificationEventHandler struct {
	aggregate aggregates.NotificationAggregate
}

func NewEmailNotificationEventHandler(aggregate aggregates.NotificationAggregate) EventHandler {
	return &EmailNotificationEventHandler{
		aggregate: aggregate,
	}
}

func (g *EmailNotificationEventHandler) Handle(body []byte) error {
	var event events.EmailNotificationEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	log.Println(event)

	err := g.aggregate.Send(event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
