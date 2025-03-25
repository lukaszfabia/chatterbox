package commands

import (
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/models"
)

type ProfileCommandService interface {
	UpdateProfile(commands.UpdateProfileCommand) (*models.Profile, error)
}

type profileCommandServiceImpl struct {
	aggregate aggregates.ProfileAggregate
}

func NewProfileCommandService(aggregate aggregates.ProfileAggregate) ProfileCommandService {
	return &profileCommandServiceImpl{aggregate: aggregate}
}
