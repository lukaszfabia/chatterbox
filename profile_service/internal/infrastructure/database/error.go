package database

import "fmt"

// FailedToConnect formats and returns an error message indicating that the connection to the database failed.
// It takes the original error as a parameter and includes it in the formatted message.
func FailedToConnect(err error) error {
	return fmt.Errorf("failed to connect with database: %s", err.Error())
}

// FailedMigration formats and returns an error message indicating that the migration of models to the database failed.
// It takes the original error as a parameter and includes it in the formatted message.
func FailedMigration(err error) error {
	return fmt.Errorf("failed to migrate models to db: %s", err.Error())
}

// FailedToCloseConnection formats and returns an error message indicating that closing the database connection failed.
// It takes the original error as a parameter and includes it in the formatted message.
func FailedToCloseConnection(err error) error {
	return fmt.Errorf("failed to close connection: %s", err.Error())
}
