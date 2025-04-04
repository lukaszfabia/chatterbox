package handlers

import (
	"net/http"
	_ "notification_serivce/docs"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/queries"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

func NewRouter(commandService commands.NotificationCommandService, queryService queries.NotificationQueryService) *mux.Router {
	router := mux.NewRouter()
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	apiRouter := router.PathPrefix("/api/v1").Subrouter()

	profileHandler := NewNotificationHandler(commandService, queryService)

	authRouter := apiRouter.NewRoute().Subrouter()
	authRouter.Use(profileHandler.IsAuth)

	authRouter.HandleFunc("/notifications", profileHandler.GetNotifications).Methods(http.MethodGet)

	return router
}
