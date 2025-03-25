package database

import (
	"context"
	"log"
	"os"
	"profile_service/internal/config"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Database struct {
	db *mongo.Collection
}

func Connect() (*Database, error) {
	dbs, err := newDBConnection(os.Getenv("DB_NAME"), os.Getenv("MONGO_COLLECTION"))
	if err != nil {
		return nil, FailedToConnect(err)
	}

	return dbs, nil
}

func (d *Database) Close() error {
	log.Println("Closing connections...")

	if err := d.db.Database().Client().Disconnect(context.TODO()); err != nil {
		log.Println("Failed to close MongoDB connection:", err)
		return FailedToCloseConnection(err)
	}

	log.Println("MongoDB connection closed successfully")
	return nil
}

func (d *Database) Sync() error {
	return nil
}

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

func (d *Database) GetNoSql() *mongo.Collection {
	return d.db
}
