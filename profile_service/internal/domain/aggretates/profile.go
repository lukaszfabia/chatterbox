package aggregates

import (
	"profile_service/internal/domain"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/events"
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/models/writemodels"
	"profile_service/internal/domain/repositories"
)

type ProfileAggregate struct {
	repo repositories.ProfileRepository
}

func NewProfileAggregate(repo repositories.ProfileRepository) *ProfileAggregate {
	return &ProfileAggregate{
		repo: repo,
	}
}

func (a *ProfileAggregate) CreateProfile(event events.UserCreatedEvent) (*readmodels.Profile, error) {

	profile, err := writemodels.NewProfileFromEvent(event)
	if err != nil {
		return nil, err
	}

	savedProfile, err := a.repo.SaveUser(*profile)
	if err != nil {
		return nil, err
	}

	return savedProfile, nil
}

func (a *ProfileAggregate) UpdateProfile(profile commands.UpdateProfileCommand) (*readmodels.Profile, error) {

	toUpdate, err := a.repo.GetUserById(profile.UUID)

	if err != nil {
		return nil, err
	}

	updated, err := domain.Update(toUpdate, profile)

	if err != nil {
		return nil, err
	}

	savedProfile, err := a.repo.SaveUser(*updated)

	if err != nil {
		return nil, err
	}

	return savedProfile, nil
}
