package repository

import (
	"profile_service/internal/domain"
	"profile_service/internal/infrastructure/database"

	"gorm.io/gorm"
)

type ProfileRepository interface {
	GetUserById(id uint) (*domain.Profile, error)
}

type profileRepoImpl struct {
	db *gorm.DB
}

func NewProfileRepository(database *database.Database) ProfileRepository {
	return &profileRepoImpl{
		db: database.DB,
	}
}

func (repo *profileRepoImpl) GetUserById(id uint) (*domain.Profile, error) {
	var profile domain.Profile
	err := repo.db.Model(&domain.Profile{}).First(&profile, id).Error

	if err != nil {
		return nil, UserNotFound()
	}

	return &profile, nil
}
