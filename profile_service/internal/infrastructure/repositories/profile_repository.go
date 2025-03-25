package repositories

import (
	"context"
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/models/writemodels"
	"profile_service/internal/domain/repositories"
	"profile_service/internal/infrastructure/database"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"gorm.io/gorm"
)

type key string

const (
	name         key = "username"
	emailAddress key = "email"
	uid          key = "id"
)

type profileRepoImpl struct {
	database *database.Database
}

func NewProfileRepository(database *database.Database) repositories.ProfileRepository {
	return &profileRepoImpl{
		database: database,
	}
}

func (repo *profileRepoImpl) getUserByKey(k key, v any) (*readmodels.Profile, error) {
	res := repo.database.GetNoSql().FindOne(context.TODO(), bson.M{string(k): v})

	var profile readmodels.Profile
	err := res.Decode(&profile)
	if err != nil {
		return nil, err
	}

	return &profile, nil
}

func (repo *profileRepoImpl) GetUserById(id uuid.UUID) (*readmodels.Profile, error) {
	return repo.getUserByKey(uid, id)
}

func (repo *profileRepoImpl) GetUserByUsername(username string) (*readmodels.Profile, error) {
	return repo.getUserByKey(name, username)
}

func (repo *profileRepoImpl) SaveUser(profile writemodels.Profile) (*readmodels.Profile, error) {
	repo.database.GetSql().Transaction(func(tx *gorm.DB) error {
		err := tx.Create(profile).Error

		if err != nil {
			tx.Rollback()
		}

		tx.Commit()
		return nil
	})

	p := writemodels.NewReadOnlyProfile(profile)

	return &p, nil
}
