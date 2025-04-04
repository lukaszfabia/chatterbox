package queries

// GetNotificationsQuery represents the payload to fetch notifications
type GetNotificationsQuery struct {
	Page  int `json:"page" validate:"gte=1"`
	Limit int `json:"limit" validate:"gte=1,lte=100"`
}
