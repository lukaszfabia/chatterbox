package database

import (
	"context"
	"log"
	"os"
	"profile_service/internal/config"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	writeDB *gorm.DB
	readDB  *mongo.Collection
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

	if dbInstance, err := d.writeDB.DB(); err == nil {
		if closeErr := dbInstance.Close(); closeErr != nil {
			log.Println("Failed to close PostgreSQL connection:", closeErr)
			return FailedToCloseConnection(err)
		}
		log.Println("PostgreSQL connection closed successfully")
	} else {
		log.Println("Error closing PostgreSQL connection:", err)
	}

	if err := d.readDB.Database().Client().Disconnect(context.TODO()); err != nil {
		log.Println("Failed to close MongoDB connection:", err)
		return FailedToCloseConnection(err)
	}

	log.Println("MongoDB connection closed successfully")
	return nil
}

func (d *Database) Sync() error {
	if err := d.writeDB.AutoMigrate(config.Tables...); err != nil {
		return FailedMigration(err)
	}

	log.Println("Database synced successfully!")
	return nil
}

func newDBConnection(dbName, collection string) (*Database, error) {
	dsn := config.GetSqlUrl(dbName)
	db, err := gorm.Open(postgres.Open(dsn), config.GetGormConfig())
	if err != nil {
		return nil, err
	}

	client, err := mongo.Connect(config.GetNoSqlConfig())
	if err != nil {
		return nil, err
	}

	mongoDB := client.Database(dbName).Collection(collection)

	return &Database{
		writeDB: db,
		readDB:  mongoDB,
	}, nil
}

func (d *Database) GetNoSql() *mongo.Collection {
	return d.readDB
}

func (d *Database) GetSql() *gorm.DB {
	return d.writeDB
}
