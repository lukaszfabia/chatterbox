package pkg

import (
	"fmt"
)

func UnsupportedAlgorithm(err any) error {
	return fmt.Errorf("unsupported algorithm: %v", err)
}

func FailedToParseToken(err error) error {
	return fmt.Errorf("failed to parse token: %s", err.Error())
}

func InvalidToken(err error) error {
	return fmt.Errorf("invalid token: %s", err.Error())
}

func IvnalidJson(err error) error {
	return fmt.Errorf("invalid json: %s", err.Error())
}

func IvnalidFormData(err error) error {
	return fmt.Errorf("invalid multipart form data: %s", err.Error())
}

func FailedToParseForm(err error) error {
	return fmt.Errorf("failed to parse multipart form data: %s", err.Error())
}
