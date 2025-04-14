package rabbitmq

import (
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

// RabbitMQ struct holds the connection and channel to RabbitMQ broker.
type RabbitMQ struct {
	Conn    *amqp.Connection // AMQP connection to RabbitMQ
	Channel *amqp.Channel    // AMQP channel for communication
}

// New creates and returns a new RabbitMQ instance. It establishes a connection
// to the RabbitMQ broker and opens a channel for communication.
//
// Parameters:
// - url: the RabbitMQ broker URL (e.g., "amqp://guest:guest@localhost:5672/")
//
// Returns:
// - A pointer to a RabbitMQ instance and an error (if any).
func New(url string) (*RabbitMQ, error) {
	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	log.Println("Successfully connected to RabbitMQ broker!")
	return &RabbitMQ{Conn: conn, Channel: ch}, nil
}

// Close closes both the AMQP connection and channel. It logs any errors encountered
// during the closure of the connection or channel.
//
// It is important to call this method when done with the RabbitMQ instance
// to release resources properly.
func (r *RabbitMQ) Close() {
	if err := r.Conn.Close(); err != nil {
		log.Println(err.Error())
	}

	if err := r.Channel.Close(); err != nil {
		log.Println(err.Error())
	}
}
