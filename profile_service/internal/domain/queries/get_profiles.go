package queries

type GetProfilesQuery struct {
	Page  int `json:"page" validate:"gte=1"`
	Limit int `json:"limit" validate:"gte=1,lte=100"`
}
