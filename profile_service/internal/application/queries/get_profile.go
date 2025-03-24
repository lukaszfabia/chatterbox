package queries

import (
	"profile_service/internal/domain/models/readmodels"

	"github.com/google/uuid"
)

func (p *profileQueryServiceImple) GetProfile(id uuid.UUID) (*readmodels.Profile, error) {
	profile, _ := p.repo.GetUserById(id)

	return profile, nil
}
