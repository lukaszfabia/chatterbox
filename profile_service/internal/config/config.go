package config

import (
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// GetBrokerUrl constructs the connection URL for RabbitMQ
// Returns:
//   - connection string to RabbitMQ
//   - error if required environment variables are missing or invalid
func GetBrokerUrl() (string, error) {
	// user := os.Getenv("RABBITMQ_DEFAULT_USER")
	// pass := os.Getenv("RABBITMQ_DEFAULT_PASS")
	// host := os.Getenv("RABBITMQ_HOST")
	// port := os.Getenv("RABBITMQ_PORT")

	// if user == "" || pass == "" || host == "" || port == "" {
	// 	return "", errors.New("missing required RabbitMQ environment variables: RABBITMQ_DEFAULT_USER, RABBITMQ_DEFAULT_PASS, RABBITMQ_HOST, RABBITMQ_PORT")
	// }

	url := os.Getenv("RABBITMQ_URL")
	if len(url) < 1 {
		return "", fmt.Errorf("no rabbitmq url provided")
	}

	// amqpURL := fmt.Sprintf("amqp://%s:%s@%s:%s/", user, pass, host, port)

	return url, nil
}

// GetNoSqlConfig returns the MongoDB connection configuration
// Returns:
//   - MongoDB connection options
//   - error if any required environment variables are missing or invalid
func GetNoSqlConfig() (*options.ClientOptions, error) {
	// host := os.Getenv("MONGO_HOST")
	// port := os.Getenv("MONGO_PORT")
	// user := os.Getenv("MONGO_USER")
	// pass := os.Getenv("MONGO_PASS")

	// if host == "" || port == "" || user == "" || pass == "" {
	// 	return nil, errors.New("missing required MongoDB environment variables: MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASS")
	// }

	// uri := fmt.Sprintf("mongodb://%s:%s@%s:%s", user, pass, host, port)
	uri := os.Getenv("MONGO_URI")

	return options.Client().ApplyURI(uri), nil
}
