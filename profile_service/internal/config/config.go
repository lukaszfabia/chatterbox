package config

import (
	"fmt"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func GetGormConfig() *gorm.Config {
	return &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}
}

func GetSqlUrl(db string) string {

	user := os.Getenv("POSTGRES_USER")
	pass := os.Getenv("POSTGRES_PASSWORD")
	port := os.Getenv("POSTGRES_PORT")
	host := os.Getenv("POSTGRES_HOST")

	// connection string
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, pass, db, port)

	return dsn
}

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

	uri := fmt.Sprintf("mongodb://%s:%s", host, port)

	return options.Client().ApplyURI(uri)
}
