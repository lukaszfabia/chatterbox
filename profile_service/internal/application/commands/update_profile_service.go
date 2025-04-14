package commands

import (
	"log"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/events"
	"profile_service/internal/domain/models"
	"reflect"
)

// UpdateProfile updates a user's profile based on the provided command data.
//
// It delegates the domain logic to the ProfileAggregate, which handles validation,
// modification, and persistence of profile state.
//
// After a successful update, it emits a MemberUpdatedInfoEvent to notify other services
// (e.g., ChatService) about changes to the profile (such as username or avatar).
//
// Parameters:
//   - body: the UpdateProfileCommand containing the fields to be updated.
//
// Returns:
//   - *models.Profile: the updated profile model.
//   - error: if the update or event publishing fails.
func (p *profileCommandServiceImpl) UpdateProfile(body commands.UpdateProfileCommand) (*models.Profile, error) {

	res, err := p.aggregate.UpdateProfile(body)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	var e events.MemberUpdatedInfoEvent = events.NewMemberUpdatedInfoEvent(res.ID, &res.Username, res.AvatarURL)

	err = p.bus.Publish(reflect.TypeOf(e).Name(), e)

	if err != nil {
		log.Println(err.Error())
	}

	return res, nil
}
