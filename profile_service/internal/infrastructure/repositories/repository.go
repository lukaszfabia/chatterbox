// Package repositories defines the repository layer for the profile service,
// responsible for managing data access and interaction with the database.
package repositories

import (
	"log"
	"profile_service/internal/domain/repositories"
	"profile_service/internal/infrastructure/database"
)

// Repository interface defines the methods for accessing the profile repository.
// The implementation of this interface provides a way to interact with the database
// and manage profile-related data.
type Repository interface {
	// ProfileRepository returns the ProfileRepository instance, which provides
	// methods to interact with the profile data in the database.
	ProfileRepository() repositories.ProfileRepository
}

// repositoryImpl is the concrete implementation of the Repository interface.
// It holds a reference to the database and profile repository.
type repositoryImpl struct {
	db          database.Database
	profileRepo repositories.ProfileRepository
}

// ProfileRepository returns the ProfileRepository instance associated with this repository.
// It allows access to methods for managing profile data.
func (r *repositoryImpl) ProfileRepository() repositories.ProfileRepository {
	return r.profileRepo
}

// New creates a new instance of the Repository by connecting to the database
// and initializing the ProfileRepository.
//
// It attempts to establish a connection to the database and creates a new ProfileRepository
// instance once the connection is successful. If the connection fails, the process will panic.
//
// Returns:
//   - A pointer to an instance of Repository that holds the ProfileRepository and database connection.
func New() Repository {
	log.Println("Trying to connect with db...")
	db, err := database.Connect()

	if err != nil {
		log.Println(err.Error())
		panic("Failed to connect with db")
	}

	log.Println("Successfully connected to MongoDB database!")

	profileRepo := NewProfileRepository(db)

	return &repositoryImpl{
		db:          *db,
		profileRepo: profileRepo,
	}
}
