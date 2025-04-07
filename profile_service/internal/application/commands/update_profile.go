package commands

import (
	"log"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/events"
	"profile_service/internal/domain/models"
	"reflect"
)

func (p *profileCommandServiceImpl) UpdateProfile(body commands.UpdateProfileCommand) (*models.Profile, error) {

	res, err := p.aggregate.UpdateProfile(body)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	var e events.MemberUpdatedInfoEvent = events.NewMemberUpdatedInfoEvent(res.ID, &res.Username, res.AvatarURL)
	// notifi the chat service
	err = p.bus.Publish(reflect.TypeOf(e).Name(), e)

	return res, nil
}
