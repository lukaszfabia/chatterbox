package messaging

type EventBus interface {
	Publish(queueName string, event any) error
	Consume(queue string, handler func(body []byte)) error
}
