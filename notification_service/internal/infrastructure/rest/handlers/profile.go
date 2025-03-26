package handlers

import (
	"net/http"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/queries"
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
}

func (h *NotificationHandler) DeleteNotification(w http.ResponseWriter, r *http.Request) {
}
