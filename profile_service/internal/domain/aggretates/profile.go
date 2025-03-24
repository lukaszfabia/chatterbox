package aggregates

import (
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/models/writemodels"
	"profile_service/internal/domain/repositories"
	"time"
)

type ProfileAggregate struct {
	repo repositories.ProfileRepository
}

func NewProfileAggregate(repo repositories.ProfileRepository) *ProfileAggregate {
	return &ProfileAggregate{
		repo: repo,
	}
}

func (a *ProfileAggregate) CreateProfile(profile writemodels.Profile) (*readmodels.Profile, error) {
	profile.CreatedAt = time.Now()
	profile.UpdatedAt = time.Now()

	savedProfile, err := a.repo.CreateUser(profile)
	if err != nil {
		return nil, err
	}

	return savedProfile, nil
}
