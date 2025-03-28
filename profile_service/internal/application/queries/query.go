package queries

import (
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/queries"
	"profile_service/internal/domain/repositories"
)

type ProfileQueryService interface {
	GetProfile(queries.GetProfileQuery) (*models.Profile, error)
	GetProfiles(queries.GetProfilesQuery) ([]*models.Profile, error)
}

type profileQueryServiceImpl struct {
	repo repositories.ProfileRepository
}

func NewProfileQueryService(repo repositories.ProfileRepository) ProfileQueryService {
	return &profileQueryServiceImpl{repo: repo}
}
