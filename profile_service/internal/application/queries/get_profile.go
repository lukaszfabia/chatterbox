package queries

import (
	"profile_service/internal/domain/models/readmodels"
	"profile_service/internal/domain/queries"

	"github.com/google/uuid"
)

func (p profileQueryServiceImpl) GetProfile(q queries.GetProfileQuery) (*readmodels.Profile, error) {
	uid, err := uuid.Parse(q.UserID)

	if err != nil {
		return nil, err
	}

	return p.repo.GetUserById(uid)
}
