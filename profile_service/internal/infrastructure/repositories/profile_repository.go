package repositories

import (
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/models/writemodels"
	"profile_service/internal/domain/repositories"
	"profile_service/internal/infrastructure/database"

	"github.com/google/uuid"
)

type profileRepoImpl struct {
	database *database.Database
}

func NewProfileRepository(database *database.Database) repositories.ProfileRepository {
	return &profileRepoImpl{
		database: database,
	}
}

func (repo *profileRepoImpl) GetUserById(id uuid.UUID) (*readmodels.Profile, error) {
	// TODO: implement
	return nil, nil
}

func (repo *profileRepoImpl) CreateUser(profile writemodels.Profile) (*readmodels.Profile, error) {
	// TODO: implement
	return nil, nil
}

func (repo *profileRepoImpl) GetUserByUsername(username string) (*readmodels.Profile, error) {
	// TODO: implement
	return nil, nil
}

func (repo *profileRepoImpl) UpdateUser(profile writemodels.Profile) (*readmodels.Profile, error) {
	// TODO: implement
	return nil, nil
}
