// Package pkg provides utility functions for error handling in the application.
// These functions create formatted error messages for common error scenarios.
package pkg

import "fmt"

// UnsupportedAlgorithm creates an error indicating that the provided algorithm is unsupported.
//
// Parameters:
//   - err: the error that provides additional details about the unsupported algorithm.
//
// Returns:
//   - A formatted error indicating the unsupported algorithm.
func UnsupportedAlgorithm(err any) error {
	return fmt.Errorf("unsupported algorithm: %v", err)
}

// FailedToParseToken creates an error indicating that the provided token could not be parsed.
//
// Parameters:
//   - err: the error that provides details about the parsing failure.
//
// Returns:
//   - A formatted error indicating the failure to parse the token.
func FailedToParseToken(err error) error {
	return fmt.Errorf("failed to parse token: %s", err.Error())
}

// InvalidToken creates an error indicating that the provided token is invalid.
//
// Parameters:
//   - err: the error that provides details about the invalid token.
//
// Returns:
//   - A formatted error indicating the invalid token.
func InvalidToken(err error) error {
	return fmt.Errorf("invalid token: %s", err.Error())
}

// IvnalidJson creates an error indicating that the provided JSON is invalid.
//
// Parameters:
//   - err: the error that provides details about the invalid JSON.
//
// Returns:
//   - A formatted error indicating the invalid JSON.
func IvnalidJson(err error) error {
	return fmt.Errorf("invalid json: %s", err.Error())
}

// IvnalidFormData creates an error indicating that the provided multipart form data is invalid.
//
// Parameters:
//   - err: the error that provides details about the invalid form data.
//
// Returns:
//   - A formatted error indicating the invalid multipart form data.
func IvnalidFormData(err error) error {
	return fmt.Errorf("invalid multipart form data: %s", err.Error())
}

// FailedToParseForm creates an error indicating that there was a failure while parsing the multipart form data.
//
// Parameters:
//   - err: the error that provides details about the parsing failure.
//
// Returns:
//   - A formatted error indicating the failure to parse the form data.
func FailedToParseForm(err error) error {
	return fmt.Errorf("failed to parse multipart form data: %s", err.Error())
}
