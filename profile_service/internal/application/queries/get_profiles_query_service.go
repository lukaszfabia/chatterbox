package queries

import (
	"profile_service/internal/domain/models"
	"profile_service/internal/domain/queries"
)

// GetProfiles retrieves a list of profiles based on the pagination parameters.
func (p *profileQueryServiceImpl) GetProfiles(q queries.GetProfilesQuery) ([]*models.Profile, error) {
	return p.repo.GetUsers(q.Limit, q.Page)
}
