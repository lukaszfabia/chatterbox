package rabbitmq

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"profile_service/internal/config"
	"profile_service/internal/domain"
	"profile_service/pkg"
	"reflect"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQConnection struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

/*
	Connect to RabbitMQ

Params:
  - amqpURL: connection string to host

Returns:

  - connection instance (constructor)

  - error occured during connection
*/
func NewRabbitMQConnection() (*RabbitMQConnection, error) {
	conn, err := amqp.Dial(pkg.BuildRabbitConnStr())
	if err != nil {
		pkg.FailWithError(err, "Failed to connect with RabbitMQ")
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		pkg.FailWithError(err, "Failed to connect with channel")
		return nil, err
	}

	return &RabbitMQConnection{
		connection: conn,
		channel:    ch,
	}, nil
}

// Closes connection between rabbit and app, use it with defer
func (r *RabbitMQConnection) Close() {
	if err := r.channel.Close(); err != nil {
		pkg.FailWithError(err, "Failed to close channel")
	}
	if err := r.connection.Close(); err != nil {
		pkg.FailWithError(err, "Failed to close connection")
	}
}

/*
# Declares queue on channel

# Please provide `queueName` the same as event name

Snipped from https://www.rabbitmq.com/tutorials/tutorial-one-go
*/
func (r *RabbitMQConnection) DeclareQueue() error {
	_, err := r.channel.QueueDeclare(
		"CHANGEME", // name
		false,      // durable
		false,      // delete when unused
		false,      // exclusive
		false,      // no-wait
		nil,        // arguments
	)
	pkg.FailWithError(err, "Failed to declare a queue")

	// log.Printf("Queue %s declared successfully", r.QueueName)
	return nil
}

// Listening on channel
// Snipped from https://www.rabbitmq.com/tutorials/tutorial-two-go
func (r *RabbitMQConnection) Consume(dispatcher *Dispatcher) {
	msgs, err := r.channel.Consume(
		"CHANGEME", // name
		"",         // consumer
		true,       // auto-ack
		false,      // exclusive
		false,      // no-local
		false,      // no-wait
		nil,        // args
	)

	pkg.FailWithError(err, "Failed to register a consumer")

	for d := range msgs {
		event, err := r.findType(d)
		if err != nil {
			log.Println(err.Error())
		}

		// handle event

		dispatcher.HandleEvent(*event)
	}

}

func (r *RabbitMQConnection) Publish(event domain.Event) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	body, err := json.Marshal(event)
	if err != nil {
		return err
	}

	err = r.channel.PublishWithContext(ctx,
		"",         // exchange
		"CHANGEME", // name
		false,      // mandatory
		false,      // immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			ContentType:  "application/json",
			Body:         body,
		},
	)

	if err != nil {
		return err
	}
	return nil
}

func (r *RabbitMQConnection) findType(d amqp.Delivery) (*domain.Event, error) {
	events := config.RegisteredEvents()

	if _, ok := events[d.Type]; !ok {
		return nil, NoMatchingEvent()
	}

	eventInst := reflect.New(reflect.TypeOf(d.Type).Elem()).Interface()

	if err := json.Unmarshal(d.Body, eventInst); err != nil {
		log.Println(err.Error())
		return nil, FailedToParseEvent()
	}

	event, ok := eventInst.(domain.Event)
	if !ok {
		return nil, errors.New("failed to cast event to domain.Event")
	}

	return &event, nil
}
