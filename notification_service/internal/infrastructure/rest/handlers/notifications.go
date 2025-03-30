package handlers

import (
	"net/http"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/queries"
	q "notification_serivce/internal/domain/queries"
	"notification_serivce/internal/infrastructure/rest"
	"notification_serivce/pkg"
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

func (h *NotificationHandler) GetNotifications(w http.ResponseWriter, r *http.Request) {
	body, err := pkg.DecodeJSON[q.GetNotificationsQuery](r)

	if err != nil {
		rest.BadRequest(w)
		return
	}

	res, err := h.queryService.GetNotifications(body.UserID)

	if err != nil {
		rest.BadRequest(w)
		return
	}

	rest.Ok(w, res)
}

func (h *NotificationHandler) DeleteNotification(w http.ResponseWriter, r *http.Request) {
}
