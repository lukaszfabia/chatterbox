package config

import (
	"fmt"
	"os"

	"github.com/go-redis/redis"
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

func GetRedisClient() *redis.Client {
	host := os.Getenv("REDIS_HOST")
	port := os.Getenv("REDIS_PORT")
	pass := os.Getenv("REDIS_PASS")

	addr := fmt.Sprintf("%s:%s", host, port)

	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pass,
		DB:       0,
	})

	return rdb
}
