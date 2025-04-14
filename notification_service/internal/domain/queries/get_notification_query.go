package queries

// GetNotificationsQuery represents the query parameters used to fetch notifications from the repository.
// It includes pagination details, allowing users to specify the page number and the number of notifications
// to be returned per request.
type GetNotificationsQuery struct {
	// Page is the page number for pagination. It must be greater than or equal to 1.
	// Used to fetch notifications starting from a specific page.
	// Example: Page 1 fetches the first set of notifications.
	Page int `json:"page" validate:"gte=1"`

	// Limit is the number of notifications to fetch per page. It must be between 1 and 100.
	// Used to control the number of notifications returned in each request.
	// Example: Limit of 10 fetches up to 10 notifications.
	Limit int `json:"limit" validate:"gte=1,lte=100"`
}
