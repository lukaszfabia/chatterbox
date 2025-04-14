// Package rabbitmq provides an implementation of the EventBus interface using RabbitMQ as a message broker.
// It supports retry logic for establishing connections and managing AMQP channels.
package rabbitmq

import (
	"errors"
	"log"
	"profile_service/internal/infrastructure/messaging"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	// MAX_RETRY defines the maximum number of retry attempts to establish a connection with RabbitMQ.
	MAX_RETRY = 5

	// RETRY_DELAY defines the delay between retry attempts.
	RETRY_DELAY = 2 * time.Second
)

// RabbitMQ represents a connection to the RabbitMQ broker and an open channel.
type RabbitMQ struct {
	Conn    *amqp.Connection // AMQP connection to the broker
	Channel *amqp.Channel    // AMQP channel used for publishing/subscribing
}

// New creates a new instance of RabbitMQ that implements the messaging.EventBus interface.
// It attempts to establish a connection with the RabbitMQ broker at the provided URL.
// If the connection or channel creation fails, it will retry up to MAX_RETRY times with a delay of RETRY_DELAY.
//
// Parameters:
//   - url: AMQP URL to the RabbitMQ broker (e.g., amqp://guest:guest@localhost:5672/)
//
// Returns:
//   - messaging.EventBus: an instance of the EventBus based on RabbitMQ
//   - error: error if all retry attempts fail
func New(url string) (messaging.EventBus, error) {
	var conn *amqp.Connection
	var ch *amqp.Channel
	var err error

	for i := range MAX_RETRY {
		conn, err = amqp.Dial(url)
		if err == nil {
			ch, err = conn.Channel()
			if err == nil {
				log.Println("Successfully connected to RabbitMQ broker!")
				return &RabbitMQ{Conn: conn, Channel: ch}, nil
			}

			log.Printf("Failed to open channel (attempt %d/%d): %v", i+1, MAX_RETRY, err)
			conn.Close()
		} else {
			log.Printf("Failed to connect to RabbitMQ (attempt %d/%d): %v", i+1, MAX_RETRY, err)
		}

		time.Sleep(RETRY_DELAY)
	}

	return nil, errors.New("max retries exceeded: unable to connect to RabbitMQ")
}

// Close gracefully shuts down the RabbitMQ connection and channel.
// Any error during closing is logged but not returned.
func (r *RabbitMQ) Close() {
	if err := r.Channel.Close(); err != nil {
		log.Println("Error closing channel:", err)
	}

	if err := r.Conn.Close(); err != nil {
		log.Println("Error closing connection:", err)
	}
}
