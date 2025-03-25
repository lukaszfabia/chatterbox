package queries

import (
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/queries"
	"profile_service/internal/domain/repositories"
)

type ProfileQueryService interface {
	GetProfile(queries.GetProfileQuery) (*readmodels.Profile, error)
}

type profileQueryServiceImpl struct {
	repo repositories.ProfileRepository
}

func NewProfileQueryService(repo repositories.ProfileRepository) ProfileQueryService {
	return &profileQueryServiceImpl{repo: repo}
}
