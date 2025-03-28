package repositories

import (
	"context"
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/repositories"
	"profile_service/internal/infrastructure/database"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
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

func (repo *profileRepoImpl) GetUsers(limit int) ([]*models.Profile, error) {
	ctx := context.TODO()
	collection := repo.database.GetNoSql()

	filter := bson.M{
		"deletedAt": bson.M{"$exists": false},
	}

	opts := options.Find().
		SetLimit(int64(limit)).
		SetSort(bson.M{string(name): 1})

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []*models.Profile
	if err = cursor.All(ctx, &users); err != nil {
		return nil, err
	}

	return users, nil
}

func NewProfileRepository(database *database.Database) repositories.ProfileRepository {
	return &profileRepoImpl{
		database: database,
	}
}

func (repo *profileRepoImpl) getUserByKey(k key, v any) (*models.Profile, error) {
	res := repo.database.GetNoSql().FindOne(context.TODO(), bson.M{string(k): v, "deletedAt": bson.M{"$exists": false}})

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
	filter := bson.M{string(uid): profile.ID}
	update := bson.M{"$set": profile}

	opts := options.UpdateOne().SetUpsert(true)

	_, err := repo.database.GetNoSql().UpdateOne(context.TODO(), filter, update, opts)
	if err != nil {
		return nil, FailedToSave(err)
	}

	return &profile, nil
}
