package repositories

import "profile_service/internal/domain/models"

type ProfileRepository interface {
	GetUserById(id string) (*models.Profile, error)
	GetUserByUsername(username string) (*models.Profile, error)
	GetUsers(limit, page int) ([]*models.Profile, error)

	SaveUser(profile models.Profile) (*models.Profile, error)
}
