package infrastructure

import (
	"bytes"
	"log"
	"notification_serivce/pkg"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQConnection struct {
	connection *amqp.Connection
	channel    *amqp.Channel
	QueueName  string
}

func (r *RabbitMQConnection) SetQueueName(name string) {
	r.QueueName = name
}

/*
	Connect to RabbitMQ

Params:
  - amqpURL: connection string to host

Returns:

  - connection instance (constructor)

  - error occured during connection
*/
func NewRabbitMQConnection(amqpURL, queueName string) (*RabbitMQConnection, error) {
	conn, err := amqp.Dial(amqpURL)
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
		QueueName:  queueName,
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
		r.QueueName, // name
		false,       // durable
		false,       // delete when unused
		false,       // exclusive
		false,       // no-wait
		nil,         // arguments
	)
	pkg.FailWithError(err, "Failed to declare a queue")

	log.Printf("Queue %s declared successfully", r.QueueName)
	return nil
}

func (r *RabbitMQConnection) GetChannel() *amqp.Channel {
	return r.channel
}

// Listening on channel
// Snipped from https://www.rabbitmq.com/tutorials/tutorial-two-go
func (r *RabbitMQConnection) Consume() {
	msgs, err := r.channel.Consume(
		r.QueueName, // queue
		"",          // consumer
		true,        // auto-ack
		false,       // exclusive
		false,       // no-local
		false,       // no-wait
		nil,         // args
	)

	pkg.FailWithError(err, "Failed to register a consumer")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)
			dotCount := bytes.Count(d.Body, []byte("."))
			t := time.Duration(dotCount)
			time.Sleep(t * time.Second)

			// send notifications here

			log.Printf("Done")
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
