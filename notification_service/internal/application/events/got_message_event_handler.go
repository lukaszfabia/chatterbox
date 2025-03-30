package events

import (
	"encoding/json"
	"log"
	aggregates "notification_serivce/internal/domain/aggretates"
	"notification_serivce/internal/domain/events"
)

type GotNewMessageEventHandler struct {
	aggregate aggregates.NotificationAggregate
}

func NewGotNewMessageEventHandler(aggregate aggregates.NotificationAggregate) EventHandler {
	return &GotNewMessageEventHandler{
		aggregate: aggregate,
	}
}

func (g *GotNewMessageEventHandler) Handle(body []byte) error {
	var event events.GotNewMessageEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	err := g.aggregate.SendPush(event)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
