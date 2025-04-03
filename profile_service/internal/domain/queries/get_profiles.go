package queries

type GetProfilesQuery struct {
	Limit int `json:"limit"`
	Page  int `json:"page"`
}
