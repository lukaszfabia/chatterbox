package repositories

import (
	"log"
	"profile_service/internal/infrastructure/database"
)

type Repository interface {
	ProfileRepository() ProfileRepository
}

type repositoryImpl struct {
	db database.Database

	profileRepo ProfileRepository
}

func (r *repositoryImpl) ProfileRepository() ProfileRepository {
	return r.profileRepo
}

func New() Repository {
	db, err := database.Connect()

	if err != nil {
		panic("Failed to connect with db")
	}
	log.Println("Successfully connected to PostgreSQL database!")

	err = db.Sync()
	if err != nil {
		log.Println(err.Error())
	}

	profileRepo := NewProfileRepository(db)

	return &repositoryImpl{
		db:          *db,
		profileRepo: profileRepo,
	}
}
