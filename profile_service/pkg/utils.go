package pkg

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/joho/godotenv"
)

// Please load env vars before you call it!
//
// Returns:
//   - connection string to rabbitmq
func BuildRabbitConnStr() string {
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

func BuildDBConnStr() string {
	db := os.Getenv("POSTGRES_DB")
	user := os.Getenv("POSTGRES_USER")
	pass := os.Getenv("POSTGRES_PASSWORD")
	port := os.Getenv("POSTGRES_PORT")
	host := os.Getenv("POSTGRES_HOST")

	// connection string
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, pass, db, port)

	return dsn
}

func LoadEnv() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file provied")
	}
}

// Returns:
//   - random number from [20, 40)
func GetRandTime() int {
	seed := time.Now().UnixNano()

	generator := rand.New(rand.NewSource(seed))

	randNumber := generator.Intn(20)

	return randNumber + 20
}
