package commands

import (
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/models/readmodels"
)

func (p *profileCommandServiceImpl) UpdateProfile(body commands.UpdateProfileCommand) (*readmodels.Profile, error) {
	res, err := p.aggregate.UpdateProfile(body)
	if err != nil {
		return nil, err
	}

	return res, nil
}
