package database

import (
	"log"
	"notification_serivce/internal/config"

	"github.com/go-redis/redis"
)

type Database struct {
	db *redis.Client
}

func Connect() (*Database, error) {
	dbs, err := newDBConnection()
	if err != nil {
		return nil, FailedToConnect(err)
	}

	return dbs, nil
}

func (d *Database) Close() error {
	log.Println("Closing connections...")

	if err := d.db.Close(); err != nil {
		log.Println("Failed to close connection with Redis")
	}

	log.Println("Redis connection closed successfully")
	return nil
}

func newDBConnection() (*Database, error) {
	client := config.GetRedisClient()
	ping := client.Ping()
	_, err := ping.Result()

	if err != nil {
		return nil, err
	}

	log.Println("Database pinged successfully!")

	return &Database{
		db: client,
	}, nil
}

func (d *Database) GetRedis() *redis.Client {
	return d.db
}
