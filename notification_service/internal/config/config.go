package config

import (
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// GetBrokerUrl returns the connection string to RabbitMQ.
// It reads the necessary environment variables to build the AMQP URL for connecting to the RabbitMQ broker.
//
// Environment variables used:
// - RABBITMQ_DEFAULT_USER
// - RABBITMQ_DEFAULT_PASS
// - RABBITMQ_HOST
// - RABBITMQ_PORT
//
// Returns:
// - AMQP URL string
func GetBrokerUrl() string {
	user := os.Getenv("RABBITMQ_DEFAULT_USER") // RabbitMQ user
	pass := os.Getenv("RABBITMQ_DEFAULT_PASS") // RabbitMQ password
	host := os.Getenv("RABBITMQ_HOST")         // RabbitMQ host
	port := os.Getenv("RABBITMQ_PORT")         // RabbitMQ port

	amqpURL := fmt.Sprintf(
		"amqp://%s:%s@%s:%s/",
		user, pass, host, port,
	)

	return amqpURL
}

// GetNoSqlConfig returns the MongoDB client options for connecting to a MongoDB instance.
//
// It reads the necessary environment variables to construct the MongoDB URI and returns the client options.
//
// Environment variables used:
// - MONGO_HOST
// - MONGO_PORT
// - MONGO_USER
// - MONGO_PASS
//
// Returns:
// - MongoDB client options to use when creating a connection
func GetNoSqlConfig() *options.ClientOptions {
	host := os.Getenv("MONGO_HOST") // MongoDB host
	port := os.Getenv("MONGO_PORT") // MongoDB port
	user := os.Getenv("MONGO_USER") // MongoDB user
	pass := os.Getenv("MONGO_PASS") // MongoDB password

	if host == "" || port == "" || user == "" || pass == "" {
		log.Fatal("MongoDB credentials are missing. Make sure MONGO_HOST, MONGO_PORT, MONGO_USER, and MONGO_PASS are set.")
	}

	uri := fmt.Sprintf("mongodb://%s:%s@%s:%s", user, pass, host, port)

	return options.Client().ApplyURI(uri)
}
