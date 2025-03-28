package commands

import (
	"log"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/models"
)

func (p *profileCommandServiceImpl) UpdateProfile(body commands.UpdateProfileCommand) (*models.Profile, error) {

	res, err := p.aggregate.UpdateProfile(body)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	return res, nil
}
