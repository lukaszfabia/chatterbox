package config

import (
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// Please load env vars before you call it!
//
// Returns:
//   - connection string to rabbitmq
func GetBrokerUrl() string {
	user := os.Getenv("RABBITMQ_DEFAULT_USER")
	pass := os.Getenv("RABBITMQ_DEFAULT_PASS")
	host := os.Getenv("RABBITMQ_HOST")
	port := os.Getenv("RABBITMQ_PORT")

	// connection string
	amqpURL := fmt.Sprintf(
		"amqp://%s:%s@%s:%s/",
		user, pass, host, port,
	)

	return amqpURL
}

func GetNoSqlConfig() *options.ClientOptions {
	host := os.Getenv("MONGO_HOST")
	port := os.Getenv("MONGO_PORT")
	user := os.Getenv("MONGO_USER")
	pass := os.Getenv("MONGO_PASS")

	if host == "" || port == "" || user == "" || pass == "" {
		log.Fatal("MongoDB credentials are missing. Make sure MONGO_HOST, MONGO_PORT, MONGO_USER, and MONGO_PASS are set.")
	}

	uri := fmt.Sprintf("mongodb://%s:%s@%s:%s", user, pass, host, port)

	return options.Client().ApplyURI(uri)
}
