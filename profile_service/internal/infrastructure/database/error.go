package database

import "fmt"

func FailedToConnect() error {
	return fmt.Errorf("failed to connect with PostgreSQL database")
}

func FailedMigration() error {
	return fmt.Errorf("failed to migrate models to db")
}

func FailedToCloseConnection() error {
	return fmt.Errorf("failed to close connection")
}
