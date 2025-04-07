package commands

import (
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/models"
	"profile_service/internal/infrastructure/messaging"
)

type ProfileCommandService interface {
	UpdateProfile(body commands.UpdateProfileCommand) (*models.Profile, error)
}

type profileCommandServiceImpl struct {
	aggregate aggregates.ProfileAggregate
	bus       messaging.EventBus
}

func NewProfileCommandService(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) ProfileCommandService {
	return &profileCommandServiceImpl{aggregate: aggregate, bus: bus}
}
