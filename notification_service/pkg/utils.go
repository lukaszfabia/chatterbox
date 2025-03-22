package pkg

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type ParamsUrl struct {
	user string
	pass string
	port string
	host string
}

// Please load env vars before you call it!
//
// Returns:
//   - connection string to rabbitmq
func BuildConnectionString() string {
	paramsUrl := ParamsUrl{
		user: os.Getenv("RABBITMQ_DEFAULT_USER"),
		pass: os.Getenv("RABBITMQ_DEFAULT_PASS"),
		host: os.Getenv("HOST"),
		port: os.Getenv("PORT"),
	}

	// connection string
	amqpURL := fmt.Sprintf(
		"amqp://%s:%s@%s:%s/",
		paramsUrl.user, paramsUrl.pass, paramsUrl.host, paramsUrl.port,
	)

	log.Printf("Built connection string: %s\n", amqpURL)

	return amqpURL
}

func LoadEnv() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file provied")
	}
}
