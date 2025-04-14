// package database provides utility functions for error handling during
// database operations, such as connecting, migrating, and closing connections.
package database

import "fmt"

// FailedToConnect returns an error indicating that the connection to the
// database failed. It includes the original error message.
//
// Parameters:
//   - err (error): The error encountered while attempting to connect to the
//     database.
//
// Returns:
//   - error: A formatted error message indicating the failure to connect to
//     the database.
func FailedToConnect(err error) error {
	return fmt.Errorf("failed to connect with database: %s", err.Error())
}

// FailedMigration returns an error indicating that the migration of models
// to the database failed. It includes the original error message.
//
// Parameters:
//   - err (error): The error encountered during the migration process.
//
// Returns:
//   - error: A formatted error message indicating the failure during the
//     migration process.
func FailedMigration(err error) error {
	return fmt.Errorf("failed to migrate models to db: %s", err.Error())
}

// FailedToCloseConnection returns an error indicating that the attempt to
// close the database connection failed. It includes the original error message.
//
// Parameters:
//   - err (error): The error encountered while attempting to close the
//     connection to the database.
//
// Returns:
//   - error: A formatted error message indicating the failure to close the
//     database connection.
func FailedToCloseConnection(err error) error {
	return fmt.Errorf("failed to close connection: %s", err.Error())
}
