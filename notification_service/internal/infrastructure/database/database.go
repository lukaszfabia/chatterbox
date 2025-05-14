// package database provides utilities for establishing and managing a
// MongoDB database connection, as well as closing it when needed.
package database

import (
	"context"
	"log"
	"notification_serivce/internal/config"
	"os"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Database represents a MongoDB collection and is used to interact with the
// database in the application.
type Database struct {
	// db holds the reference to the MongoDB collection
	db *mongo.Collection
}

// Connect establishes a connection to the MongoDB database and returns a
// Database instance.
//
// Returns:
//   - (*Database, error): The database instance and any error encountered
//     during the connection process.
func Connect() (*Database, error) {
	dbs, err := newDBConnection(os.Getenv("DB_NAME"), "notifications_data")
	if err != nil {
		return nil, FailedToConnect(err)
	}

	return dbs, nil
}

// Close closes the connection to the MongoDB database.
//
// Returns:
//   - error: Any error encountered while closing the connection.
func (d *Database) Close() error {
	log.Println("Closing connections...")

	if err := d.db.Database().Client().Disconnect(context.TODO()); err != nil {
		log.Println("Failed to close MongoDB connection:", err)
		return FailedToCloseConnection(err)
	}

	log.Println("MongoDB connection closed successfully")
	return nil
}

// Sync syncs the database, currently a no-op.
//
// Returns:
//   - error: Always returns nil since no synchronization is implemented.
func (d *Database) Sync() error {
	return nil
}

// newDBConnection creates a new connection to the MongoDB database and
// returns a Database instance.
//
// Parameters:
//   - dbName (string): The name of the database to connect to.
//   - collection (string): The name of the collection to connect to.
//
// Returns:
//   - (*Database, error): The Database instance and any error encountered
//     during the connection process.
func newDBConnection(dbName, collection string) (*Database, error) {
	client, err := mongo.Connect(config.GetNoSqlConfig())
	if err != nil {
		return nil, err
	}

	if err := client.Ping(context.TODO(), nil); err != nil {
		return nil, FailedToConnect(err)
	}

	log.Println("Database pinged successfully!")

	mongoDB := client.Database(dbName).Collection(collection)

	return &Database{
		db: mongoDB,
	}, nil
}

// GetNoSql returns the MongoDB collection associated with the Database.
//
// Returns:
//   - *mongo.Collection: The MongoDB collection instance.
func (d *Database) GetNoSql() *mongo.Collection {
	return d.db
}
