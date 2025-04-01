package repositories

import (
	"log"
	"profile_service/internal/domain/repositories"
	"profile_service/internal/infrastructure/database"
)

type Repository interface {
	ProfileRepository() repositories.ProfileRepository
}

type repositoryImpl struct {
	db database.Database

	profileRepo repositories.ProfileRepository
}

func (r *repositoryImpl) ProfileRepository() repositories.ProfileRepository {
	return r.profileRepo
}

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
