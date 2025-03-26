package database

import "fmt"

func FailedToConnect(err error) error {
	return fmt.Errorf("failed to connect with database: %s", err.Error())
}

func FailedMigration(err error) error {
	return fmt.Errorf("failed to migrate models to db: %s", err.Error())
}

func FailedToCloseConnection(err error) error {
	return fmt.Errorf("failed to close connection: %s", err.Error())
}
