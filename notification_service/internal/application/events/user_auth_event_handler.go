package events

import (
	"encoding/json"
	"log"
	aggregates "notification_serivce/internal/domain/aggretates"
	"notification_serivce/internal/domain/events"
)

type UserAuthEventHandler struct {
	aggregate aggregates.NotificationAggregate
}

func NewUserAuthEventHandler(aggregate aggregates.NotificationAggregate) EventHandler {
	return &UserAuthEventHandler{
		aggregate: aggregate,
	}
}

func (g *UserAuthEventHandler) Handle(body []byte) error {
	var event events.UserAuthEvent
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
