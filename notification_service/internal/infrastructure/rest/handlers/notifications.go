package handlers

import (
	"log"
	"net/http"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/queries"
	q "notification_serivce/internal/domain/queries"
	"notification_serivce/internal/infrastructure/rest"
	"strconv"
	// @title Notification Service API
	// @version 1.0
	// @description Notification management service
	// @host localhost:8003
	// @BasePath /api/v1
	// @securityDefinitions.apikey ApiKeyAuth
	// @in header
	// @name Authorization
)

type NotificationHandler struct {
	commandService commands.NotificationCommandService
	queryService   queries.NotificationQueryService
}

func NewNotificationHandler(
	commandService commands.NotificationCommandService,
	queryService queries.NotificationQueryService,
) NotificationHandler {
	return NotificationHandler{commandService: commandService, queryService: queryService}
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

	pageInt, err := strconv.Atoi(page)
	if err == nil || pageInt <= 0 {
		queryParams.Page = pageInt
	}

	limitInt, err := strconv.Atoi(limit)
	if err == nil || limitInt <= 0 {
		queryParams.Limit = limitInt
	}

	userID, ok := r.Context().Value("userID").(string)

	if !ok {
		log.Println(userID)
		rest.Unauthorized(w)
		return
	}

	res, err := h.queryService.GetNotifications(userID, *queryParams)

	if err != nil {
		rest.BadRequest(w)
		return
	}

	log.Println(res)

	rest.Ok(w, res)
}

// func (h *NotificationHandler) DeleteNotification(w http.ResponseWriter, r *http.Request) {
// }
