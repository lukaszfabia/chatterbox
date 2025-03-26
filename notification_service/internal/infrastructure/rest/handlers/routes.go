package handlers

import (
	"net/http"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/queries"

	"github.com/gorilla/mux"
)

func NewRouter(commandService commands.NotificationCommandService, queryService queries.NotificationQueryService) *mux.Router {
	router := mux.NewRouter()

	apiRouter := router.PathPrefix("/api/v1").Subrouter()

	profileHandler := NewNotificationHandler(commandService, queryService)

	authRouter := apiRouter.NewRoute().Subrouter()
	authRouter.Use(profileHandler.IsAuth)

	authRouter.HandleFunc("/notification", profileHandler.DeleteNotification).Methods(http.MethodDelete)
	authRouter.HandleFunc("/notifications", profileHandler.GetNotifications).Methods(http.MethodGet)

	return router
}
