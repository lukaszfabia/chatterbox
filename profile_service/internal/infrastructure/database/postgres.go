package database

import (
	"log"
	"profile_service/internal/config"
	"profile_service/pkg"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	DB *gorm.DB
}

func Connect() (*Database, error) {
	dsn := pkg.BuildDBConnStr()
	db, err := gorm.Open(postgres.Open(dsn), config.GetGormConfig())

	if err != nil {
		return nil, FailedToConnect()
	}

	return &Database{DB: db}, nil
}

func (d *Database) Close() error {
	log.Println("Disconnected from database")

	if dbInstance, err := d.DB.DB(); err != nil {
		log.Println(err)
		return FailedToCloseConnection()
	} else {
		_ = dbInstance.Close()
	}

	return nil
}

func (d *Database) Sync() error {
	if err := d.DB.AutoMigrate(config.Tables...); err != nil {
		return FailedMigration()
	}

	return nil
}
