package queries

type GetProfilesQuery struct {
	Page  int `json:"page" validate:"gte=1"`          // The page number for pagination, must be >= 1
	Limit int `json:"limit" validate:"gte=1,lte=100"` // The limit of profiles per page, must be between 1 and 100
}
