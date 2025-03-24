package repositories

import (
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/infrastructure/database"

	"gorm.io/gorm"
)

type ProfileRepository interface {
	GetUserById(id uint) (*readmodels.Profile, error)
	CreateUser(userID uint, username, email string) error
}

type profileRepoImpl struct {
	db *gorm.DB
}

func NewProfileRepository(database *database.Database) ProfileRepository {
	return &profileRepoImpl{
		db: database.ReadModelDB,
	}
}

func (repo *profileRepoImpl) GetUserById(id uint) (*readmodels.Profile, error) {
	var profile readmodels.Profile
	err := repo.db.Model(&readmodels.Profile{}).First(&profile, id).Error

	if err != nil {
		return nil, UserNotFound(err)
	}

	return &profile, nil
}

func (repo *profileRepoImpl) CreateUser(userID uint, username, email string) error {
	// TODO: implement
	return nil
}
