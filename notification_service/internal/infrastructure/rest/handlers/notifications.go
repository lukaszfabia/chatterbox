// package handlers provides HTTP request handlers for the notification service.
package handlers

import (
	"log"
	"net/http"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/queries"
	q "notification_serivce/internal/domain/queries"
	"notification_serivce/internal/infrastructure/rest"
	"strconv"
	// Swagger Documentation Annotations
	// @title Notification Service API
	// @version 1.0
	// @description Notification delivery service
	// @host 0.0.0.0:8003
	// @BasePath /api/v1
	// @securityDefinitions.apikey ApiKeyAuth
	// @in header
	// @name Authorization
	// @InfoInstanceName docs
)

// NotificationHandler handles requests related to notifications.
type NotificationHandler struct {
	commandService commands.NotificationCommandService
	queryService   queries.NotificationQueryService
}

// NewNotificationHandler initializes a new NotificationHandler.
func NewNotificationHandler(
	commandService commands.NotificationCommandService,
	queryService queries.NotificationQueryService,
) NotificationHandler {
	return NotificationHandler{
		commandService: commandService,
		queryService:   queryService,
	}
}

// GetNotifications godoc
// @Summary      Get user notifications with pagination
// @Description  Returns a paginated list of notifications for a given user ID
// @Tags         notifications
// @Accept       json
// @Produce      json
// @Param        page query int false "Page number" default(1)
// @Param        limit query int false "Number of notifications per page" default(10)
// @Success      200 {array} models.Notification "List of notifications"
// @Failure      400 {object} nil "Invalid request"
// @Router       /notifications [get]
func (h *NotificationHandler) GetNotifications(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting some notifications")

	page := r.URL.Query().Get("page")
	limit := r.URL.Query().Get("limit")

	queryParams := &q.GetNotificationsQuery{
		Page:  1,
		Limit: 10,
	}

	if page != "" {
		pageInt, err := strconv.Atoi(page)
		if err == nil && pageInt > 0 {
			queryParams.Page = pageInt
		}
	}

	if limit != "" {
		limitInt, err := strconv.Atoi(limit)
		if err == nil && limitInt > 0 {
			queryParams.Limit = limitInt
		}
	}

	userID, ok := r.Context().Value(_userID).(string)
	if !ok {
		log.Println("Unauthorized access: userID missing from context")
		rest.Unauthorized(w)
		return
	}

	res, err := h.queryService.GetNotifications(userID, *queryParams)
	if err != nil {
		log.Printf("Error fetching notifications: %s", err.Error())
		rest.BadRequest(w)
		return
	}

	log.Println(res)

	rest.Ok(w, res)
}
