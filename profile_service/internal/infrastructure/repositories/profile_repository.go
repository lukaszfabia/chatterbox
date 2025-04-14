// Package repositories defines the implementation of the ProfileRepository,
// which interacts with the database to manage profile data, including retrieval, saving, and querying by various keys.
package repositories

import (
	"context"
	"log"
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/repositories"
	"profile_service/internal/infrastructure/database"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// key type is used to define custom keys for querying user profiles by different fields
type key string

const (
	// name represents the key for the "username" field in the profile
	name key = "username"
	// emailAddress represents the key for the "email" field in the profile
	emailAddress key = "email"
	// uid represents the key for the "id" field in the profile
	uid key = "id"
)

// profileRepoImpl is the implementation of the ProfileRepository interface.
// It interacts with the NoSQL database to perform operations on user profiles.
type profileRepoImpl struct {
	database *database.Database
}

// GetUsers retrieves a list of user profiles from the database with pagination and sorting by username.
// It applies a filter to exclude deleted users (users who have a "deletedAt" field).
//
// Parameters:
//   - limit: the maximum number of profiles to retrieve.
//   - page: the page number for pagination, starting from 1.
//
// Returns:
//   - A slice of pointers to models.Profile representing the user profiles.
//   - An error if the query fails.
func (repo *profileRepoImpl) GetUsers(limit, page int) ([]*models.Profile, error) {
	log.Println("Getting users...")
	ctx := context.TODO()
	collection := repo.database.GetNoSql()

	filter := bson.M{
		"deletedAt": bson.M{"$exists": false},
	}

	opts := options.Find().
		SetSkip(int64((page - 1) * limit)).
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

// NewProfileRepository creates a new instance of the ProfileRepository implementation.
// It initializes the repository with a database connection.
//
// Parameters:
//   - database: a pointer to the Database instance for interacting with the NoSQL database.
//
// Returns:
//   - A ProfileRepository instance, which can be used to perform CRUD operations on user profiles.
func NewProfileRepository(database *database.Database) repositories.ProfileRepository {
	return &profileRepoImpl{
		database: database,
	}
}

// getUserByKey retrieves a user profile by a specific key (e.g., username, id, etc.) and value.
// It is used by methods like GetUserById and GetUserByUsername to fetch user data based on different identifiers.
//
// Parameters:
//   - k: the key used to filter the profile (e.g., "id" or "username").
//   - v: the value of the key used to filter the profile.
//
// Returns:
//   - A pointer to the user's Profile model.
//   - An error if the query fails.
func (repo *profileRepoImpl) getUserByKey(k key, v string) (*models.Profile, error) {
	log.Printf("Getting user with by %s -> %s", k, v)
	res := repo.database.GetNoSql().FindOne(context.TODO(), bson.M{string(k): v, "deletedAt": bson.M{"$exists": false}})

	var profile models.Profile
	err := res.Decode(&profile)
	if err != nil {
		return nil, err
	}

	return &profile, nil
}

// GetUserById retrieves a user profile by its ID from the database.
//
// Parameters:
//   - id: the ID of the user to retrieve.
//
// Returns:
//   - A pointer to the user's Profile model.
//   - An error if the query fails.
func (repo *profileRepoImpl) GetUserById(id string) (*models.Profile, error) {
	return repo.getUserByKey(uid, id)
}

// GetUserByUsername retrieves a user profile by its username from the database.
//
// Parameters:
//   - username: the username of the user to retrieve.
//
// Returns:
//   - A pointer to the user's Profile model.
//   - An error if the query fails.
func (repo *profileRepoImpl) GetUserByUsername(username string) (*models.Profile, error) {
	return repo.getUserByKey(name, username)
}

// SaveUser saves or updates a user profile in the database.
// It performs an upsert operation, meaning it will insert a new profile if it doesn't exist,
// or update the existing profile if it does.
//
// Parameters:
//   - profile: the profile to save or update in the database.
//
// Returns:
//   - A pointer to the saved/updated profile.
//   - An error if the save operation fails.
func (repo *profileRepoImpl) SaveUser(profile models.Profile) (*models.Profile, error) {
	log.Printf("Saving user for %s\n", profile.Username)
	filter := bson.M{string(uid): profile.ID}
	update := bson.M{"$set": profile}

	opts := options.UpdateOne().SetUpsert(true)

	_, err := repo.database.GetNoSql().UpdateOne(context.TODO(), filter, update, opts)
	if err != nil {
		return nil, FailedToSave(err)
	}

	return &profile, nil
}
