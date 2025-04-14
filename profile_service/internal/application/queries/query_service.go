package queries

import (
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/queries"
	"profile_service/internal/domain/repositories"
)

// ProfileQueryService defines the methods for querying profile information.
type ProfileQueryService interface {
	// GetProfile retrieves a profile by the provided query.
	GetProfile(queries.GetProfileQuery) (*models.Profile, error)

	// GetProfiles retrieves a list of profiles based on the query parameters.
	GetProfiles(queries.GetProfilesQuery) ([]*models.Profile, error)
}

// profileQueryServiceImpl implements the ProfileQueryService interface.
type profileQueryServiceImpl struct {
	repo repositories.ProfileRepository
}

// NewProfileQueryService creates a new instance of ProfileQueryService with the provided repository.
func NewProfileQueryService(repo repositories.ProfileRepository) ProfileQueryService {
	return &profileQueryServiceImpl{repo: repo}
}
