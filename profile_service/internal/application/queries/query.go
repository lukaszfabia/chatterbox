package queries

import (
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/repositories"

	"github.com/google/uuid"
)

type ProfileQueryService interface {
	GetProfile(id uuid.UUID) (*readmodels.Profile, error)
}

type profileQueryServiceImple struct {
	repo repositories.ProfileRepository
}

func NewProfileQueryService(repo repositories.ProfileRepository) ProfileQueryService {
	return &profileQueryServiceImple{repo: repo}
}
