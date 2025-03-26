package repositories

import (
	"log"
	"notification_serivce/internal/infrastructure/database"
)

type Repository interface {
	NotificationRepository() NotificationRepository
}

type repositoryImpl struct {
	db database.Database

	notificationRepo NotificationRepository
}

func (r *repositoryImpl) NotificationRepository() NotificationRepository {
	return r.notificationRepo
}

func New() Repository {
	db, err := database.Connect()

	if err != nil {
		log.Println(err.Error())
		panic("Failed to connect with db")
	}
	log.Println("Successfully connected to MongoDB database!")

	notificationRepo := NewNotificationRepository(db)

	return &repositoryImpl{
		db:               *db,
		notificationRepo: notificationRepo,
	}
}
