package queries

import (
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/queries"
)

// GetProfiles retrieves a profile for user with given UserID
func (p profileQueryServiceImpl) GetProfile(q queries.GetProfileQuery) (*models.Profile, error) {
	return p.repo.GetUserById(q.UserID)
}
