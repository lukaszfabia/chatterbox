package queries

type GetProfileQuery struct {
	UserID string `json:"userID"` // The ID of the user whose profile is being requested
}
