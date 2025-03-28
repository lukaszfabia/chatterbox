package aggregates

import (
	"log"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/events"
	"profile_service/internal/domain/models"
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

func (a *ProfileAggregate) CreateProfile(event events.UserCreatedEvent) (*models.Profile, error) {
	log.Printf("Creating new profile for %s", event.Username)
	profile, err := models.NewProfile(event.Email, event.Username, event.UserID)

	if err != nil {
		return nil, err
	}

	savedProfile, err := a.repo.SaveUser(*profile)
	if err != nil {
		return nil, err
	}

	log.Println("Profile has been created!")

	return savedProfile, nil
}

func (a *ProfileAggregate) UpdateProfile(profile commands.UpdateProfileCommand) (*models.Profile, error) {
	log.Println("Starting updating profile...")
	toUpdate, err := a.repo.GetUserById(profile.UUID)

	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	log.Printf("Updating info for %s", toUpdate.Username)

	toUpdate.UpdateProfile(profile)

	savedProfile, err := a.repo.SaveUser(*toUpdate)

	if err != nil {
		return nil, err
	}

	return savedProfile, nil
}

func (a *ProfileAggregate) UpdateProfileAuthInfo(profile events.UserUpdatedEvent) (*models.Profile, error) {

	toUpdate, err := a.repo.GetUserById(profile.UserID)

	if err != nil {
		return nil, err
	}

	toUpdate.UpdateAuthInfo(profile)

	savedProfile, err := a.repo.SaveUser(*toUpdate)

	if err != nil {
		return nil, err
	}

	return savedProfile, nil
}

func (a *ProfileAggregate) MarkAsADeleted(userID string) error {

	toDelete, err := a.repo.GetUserById(userID)

	if err != nil {
		return err
	}

	toDelete.MarkDelete()

	log.Printf("Deleting user: %s", toDelete.Username)

	_, err = a.repo.SaveUser(*toDelete)
	return err
}
