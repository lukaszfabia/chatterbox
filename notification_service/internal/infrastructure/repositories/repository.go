// package repositories provides the implementation for accessing and interacting with data storage.
// It defines the repository interface and implementation for different models like Notification.
package repositories

import (
	"log"
	"notification_serivce/internal/infrastructure/database"
)

// Repository is the interface for accessing the different repositories in the application.
// It defines methods to get repositories for various models.
type Repository interface {
	// NotificationRepository returns the repository for managing notifications.
	NotificationRepository() NotificationRepository
}

// repositoryImpl is the concrete implementation of the Repository interface.
// It holds references to the database and repositories for different models.
type repositoryImpl struct {
	db database.Database

	// notificationRepo is the repository for managing notifications.
	notificationRepo NotificationRepository
}

// NotificationRepository returns the repository for managing notifications.
func (r *repositoryImpl) NotificationRepository() NotificationRepository {
	return r.notificationRepo
}

// New creates a new instance of Repository, connects to the database,
// and initializes the NotificationRepository.
//
// It connects to the MongoDB database and returns a repository implementation.
// In case of an error during database connection, it logs the error and panics.
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
