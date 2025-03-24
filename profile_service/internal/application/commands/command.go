package commands

import (
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/models/readmodels"
)

type ProfileCommandService interface {
	UpdateProfile() (*readmodels.Profile, error)
}

type profileCommandServiceImpl struct {
	aggregate aggregates.ProfileAggregate
}

func NewProfileQueryService(aggregate aggregates.ProfileAggregate) ProfileCommandService {
	return &profileCommandServiceImpl{aggregate: aggregate}
}
