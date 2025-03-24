package pkg

import (
	"fmt"
)

func UnsupportedAlgorithm(err any) error {
	return fmt.Errorf("unsupported algorithm: %v", err)
}

func FailedToParse(err error) error {
	return fmt.Errorf("failed to parse token: %s", err.Error())
}

func InvalidToken(err error) error {
	return fmt.Errorf("invalid token: %s", err.Error())
}
