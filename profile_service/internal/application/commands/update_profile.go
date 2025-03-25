package commands

import (
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/models"
)

func (p *profileCommandServiceImpl) UpdateProfile(body commands.UpdateProfileCommand) (*models.Profile, error) {
	res, err := p.aggregate.UpdateProfile(body)
	if err != nil {
		return nil, err
	}

	return res, nil
}
