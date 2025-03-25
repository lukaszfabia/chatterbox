package repositories

import (
	"context"
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/repositories"
	"profile_service/internal/infrastructure/database"

	"go.mongodb.org/mongo-driver/bson"
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

func (repo *profileRepoImpl) getUserByKey(k key, v any) (*models.Profile, error) {
	res := repo.database.GetNoSql().FindOne(context.TODO(), bson.M{string(k): v})

	var profile models.Profile
	err := res.Decode(&profile)
	if err != nil {
		return nil, err
	}

	return &profile, nil
}

func (repo *profileRepoImpl) GetUserById(id string) (*models.Profile, error) {
	return repo.getUserByKey(uid, id)
}

func (repo *profileRepoImpl) GetUserByUsername(username string) (*models.Profile, error) {
	return repo.getUserByKey(name, username)
}

func (repo *profileRepoImpl) SaveUser(profile models.Profile) (*models.Profile, error) {

	_, err := repo.database.GetNoSql().InsertOne(context.TODO(), profile)

	if err != nil {
		return nil, FailedToSave(err)
	}

	return &profile, nil
}
