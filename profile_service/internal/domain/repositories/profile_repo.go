package repositories

import (
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/models/writemodels"

	"github.com/google/uuid"
)

type ProfileRepository interface {
	GetUserById(id uuid.UUID) (*readmodels.Profile, error)
	GetUserByUsername(username string) (*readmodels.Profile, error)

	CreateUser(profile writemodels.Profile) (*readmodels.Profile, error)
	UpdateUser(profile writemodels.Profile) (*readmodels.Profile, error)
}
