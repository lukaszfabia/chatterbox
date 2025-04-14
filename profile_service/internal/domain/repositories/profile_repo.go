// Package repositories provides the interface and implementations for accessing profile data in the database.
package repositories

import "profile_service/internal/domain/models"

// ProfileRepository defines the methods for interacting with profile data in the storage layer.
type ProfileRepository interface {
	// GetUserById retrieves a user profile by its unique ID.
	//
	// Parameters:
	//   - id: the unique identifier of the user.
	//
	// Returns:
	//   - A pointer to the Profile object if the user is found.
	//   - An error if the user cannot be found or if there is a problem querying the database.
	GetUserById(id string) (*models.Profile, error)

	// GetUserByUsername retrieves a user profile by its username.
	//
	// Parameters:
	//   - username: the unique username of the user.
	//
	// Returns:
	//   - A pointer to the Profile object if the user is found.
	//   - An error if the user cannot be found or if there is a problem querying the database.
	GetUserByUsername(username string) (*models.Profile, error)

	// GetUsers retrieves a list of user profiles with pagination.
	//
	// Parameters:
	//   - limit: the maximum number of profiles to return.
	//   - page: the page number to retrieve for pagination.
	//
	// Returns:
	//   - A slice of Profile pointers containing the user profiles.
	//   - An error if there is a problem querying the database.
	GetUsers(limit, page int) ([]*models.Profile, error)

	// SaveUser persists a user profile to the database, either creating a new profile or updating an existing one.
	//
	// Parameters:
	//   - profile: the Profile object to save.
	//
	// Returns:
	//   - A pointer to the saved Profile object.
	//   - An error if there is a problem saving the profile.
	SaveUser(profile models.Profile) (*models.Profile, error)
}
