package events

import (
	"encoding/json"
	"log"
	aggregates "notification_serivce/internal/domain/aggretates"
	"notification_serivce/internal/domain/events"
)

type UserCreatedEventHandler struct {
	aggregate aggregates.NotificationAggregate
}

func NewUserCreatedEventHandler(aggregate aggregates.NotificationAggregate) EventHandler {
	return &GotNewMessageEventHandler{
		aggregate: aggregate,
	}
}

func (g *UserCreatedEventHandler) Handle(body []byte) error {
	var event events.UserCreatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	err := g.aggregate.Send(event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
