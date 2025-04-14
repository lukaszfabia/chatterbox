package aggregates

import (
	"fmt"
	"log"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/events"
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/repositories"
)

type ProfileAggregate struct {
	repo repositories.ProfileRepository
}

// NewProfileAggregate creates a new instance of ProfileAggregate with the given repository.
func NewProfileAggregate(repo repositories.ProfileRepository) *ProfileAggregate {
	return &ProfileAggregate{
		repo: repo,
	}
}

// CreateProfile creates a new profile based on the UserCreatedEvent and stores it in the repository.
func (a *ProfileAggregate) CreateProfile(event events.UserCreatedEvent) (*models.Profile, error) {
	log.Printf("Creating new profile for user: %s", event.Username)

	profile, err := models.NewProfile(event.Email, event.Username, event.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to create new profile: %w", err)
	}

	// Save he new profile
	savedProfile, err := a.repo.SaveUser(*profile)
	if err != nil {
		return nil, fmt.Errorf("failed to save profile for user %s: %w", event.Username, err)
	}

	log.Println("Profile has been successfully created!")
	return savedProfile, nil
}

// UpdateProfile updates the profile with new information from UpdateProfileCommand.
func (a *ProfileAggregate) UpdateProfile(profile commands.UpdateProfileCommand) (*models.Profile, error) {
	log.Printf("Starting to update profile for user: %s", profile.UUID)

	toUpdate, err := a.repo.GetUserById(profile.UUID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user with ID %s: %w", profile.UUID, err)
	}

	log.Printf("Updating information for user: %s", toUpdate.Username)
	toUpdate.UpdateProfile(profile)

	savedProfile, err := a.repo.SaveUser(*toUpdate)
	if err != nil {
		return nil, fmt.Errorf("failed to save updated profile for user %s: %w", toUpdate.Username, err)
	}

	return savedProfile, nil
}

// UpdateProfileAuthInfo updates the authentication information (email, username) for a profile.
func (a *ProfileAggregate) UpdateProfileAuthInfo(profile events.UserUpdatedEvent) (*models.Profile, error) {
	log.Printf("Updating authentication info for user: %s", profile.UserID)

	toUpdate, err := a.repo.GetUserById(profile.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user with ID %s: %w", profile.UserID, err)
	}

	toUpdate.UpdateAuthInfo(profile)

	savedProfile, err := a.repo.SaveUser(*toUpdate)
	if err != nil {
		return nil, fmt.Errorf("failed to save updated auth info for user %s: %w", profile.UserID, err)
	}

	return savedProfile, nil
}

// MarkAsADeleted marks a profile as deleted by setting the deletedAt timestamp.
func (a *ProfileAggregate) MarkAsADeleted(userID string) error {
	log.Printf("Marking user %s as deleted", userID)

	toDelete, err := a.repo.GetUserById(userID)
	if err != nil {
		return fmt.Errorf("failed to fetch user with ID %s: %w", userID, err)
	}

	toDelete.MarkDelete()

	log.Printf("Deleting user: %s", toDelete.Username)

	_, err = a.repo.SaveUser(*toDelete)
	if err != nil {
		return fmt.Errorf("failed to save deleted user %s: %w", userID, err)
	}

	return nil
}
