package domain

import (
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/models/writemodels"
)

func Update(t *readmodels.Profile, profile commands.UpdateProfileCommand) (*writemodels.Profile, error) {
	updated, err := writemodels.NewProfile(t.Email, t.Username, t.ID.String())

	if err != nil {
		return nil, err
	}

	if t.Bio != profile.Bio {
		updated.Bio = profile.Bio
	}
	//save img

	return updated, nil
}
