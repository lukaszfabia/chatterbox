package pkg

import (
	"log"
	"math/rand"
	"time"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	if err := godotenv.Load(".env"); err != nil {
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
