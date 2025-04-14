package commands

import (
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/models"
	"profile_service/internal/infrastructure/messaging"
)

// ProfileCommandService defines the methods for executing commands related to user profiles.
// This service interacts with the aggregate and handles commands for updating profiles.
type ProfileCommandService interface {
	// UpdateProfile updates the user's profile information based on the provided command.
	UpdateProfile(body commands.UpdateProfileCommand) (*models.Profile, error)
}

// profileCommandServiceImpl is the concrete implementation of ProfileCommandService.
// It uses a ProfileAggregate for domain logic and an EventBus for communication.
type profileCommandServiceImpl struct {
	aggregate aggregates.ProfileAggregate
	bus       messaging.EventBus
}

// NewProfileCommandService creates and returns a new instance of ProfileCommandService.
// It accepts the ProfileAggregate for domain logic and EventBus to publish events.
func NewProfileCommandService(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) ProfileCommandService {
	return &profileCommandServiceImpl{
		aggregate: aggregate,
		bus:       bus,
	}
}
