package messaging

import "profile_service/internal/domain/events"

type EventBus interface {
	Publish(queueName string, event events.Event) error
	Consume(queueName string, handler func(body []byte) error) error
	Close()
}
