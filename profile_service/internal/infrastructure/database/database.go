package database

import (
	"context"
	"log"
	"os"
	"profile_service/internal/config"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Database represents the MongoDB database connection and provides methods for interacting with the database.
type Database struct {
	// db is the MongoDB collection for the given database.
	db *mongo.Collection
}

// Connect establishes a connection to MongoDB using the database and collection
// names specified in the environment variables. It returns an instance of Database
// and an error, if any.
func Connect() (*Database, error) {
	dbs, err := newDBConnection(os.Getenv("DB_NAME"), "profiles")
	if err != nil {
		return nil, FailedToConnect(err)
	}

	return dbs, nil
}

// Close terminates the connection to MongoDB and logs the result.
// Returns an error if the connection cannot be closed properly.
func (d *Database) Close() error {
	log.Println("Closing connections...")

	if err := d.db.Database().Client().Disconnect(context.TODO()); err != nil {
		log.Println("Failed to close MongoDB connection:", err)
		return FailedToCloseConnection(err)
	}

	log.Println("MongoDB connection closed successfully")
	return nil
}

// newDBConnection creates a new MongoDB connection to the specified database and collection.
// It pings the database to ensure the connection is active before returning the Database instance.
func newDBConnection(dbName, collection string) (*Database, error) {
	conf, err := config.GetNoSqlConfig()

	if err != nil {
		log.Println("Failed to get config for nosql database")
		return nil, err
	}

	client, err := mongo.Connect(conf)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	if err := client.Ping(context.Background(), nil); err != nil {
		log.Println(err.Error())
		return nil, FailedToConnect(err)
	}

	log.Println("Database pinged successfully!")

	mongoDB := client.Database(dbName).Collection(collection)

	return &Database{
		db: mongoDB,
	}, nil
}

// GetNoSql returns the MongoDB collection associated with the current database instance.
func (d *Database) GetNoSql() *mongo.Collection {
	return d.db
}
