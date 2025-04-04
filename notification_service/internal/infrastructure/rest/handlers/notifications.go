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
	page := r.URL.Query().Get("page")
	limit := r.URL.Query().Get("limit")

	queryParams := &q.GetNotificationsQuery{
		Page:  1,
		Limit: 10,
	}

	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt <= 0 {
		log.Println("Invalid page number")
		rest.BadRequest(w)
		return
	}

	limitInt, err := strconv.Atoi(limit)
	if err != nil || limitInt <= 0 {
		log.Println("Invalid limit value")
		rest.BadRequest(w)
		return
	}
	if err != nil {
		rest.BadRequest(w)
		return
	}

	userID, ok := r.Context().Value("userID").(string)

	if !ok {
		rest.Unauthorized(w)
		return
	}

	queryParams.Page = pageInt
	queryParams.Limit = limitInt

	res, err := h.queryService.GetNotifications(userID, *queryParams)

	if err != nil {
		rest.BadRequest(w)
		return
	}

	rest.Ok(w, res)
}

func (h *NotificationHandler) DeleteNotification(w http.ResponseWriter, r *http.Request) {
}
