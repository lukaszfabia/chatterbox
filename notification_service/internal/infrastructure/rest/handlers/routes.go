// provides HTTP request handlers for the notification service.
package handlers

import (
	"net/http"
	_ "notification_serivce/docs"
	"notification_serivce/internal/application/commands"
	"notification_serivce/internal/application/queries"
	"notification_serivce/internal/infrastructure/ws"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

// NewRouter creates and configures a new HTTP router with all routes for the NotificationService.
func NewRouter(commandService commands.NotificationCommandService, queryService queries.NotificationQueryService, ws *ws.WebSocketServer) *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/ws", ws.HandleConnection)

	apiRouter := router.PathPrefix("/api/v1").Subrouter()
	apiRouter.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	apiRouter.PathPrefix("/docs/").Handler(httpSwagger.WrapHandler)

	notiHandler := NewNotificationHandler(commandService, queryService)

	authRouter := apiRouter.PathPrefix("").Subrouter()
	authRouter.Use(notiHandler.IsAuth)

	authRouter.HandleFunc("/notifications", notiHandler.GetNotifications).Methods(http.MethodGet)

	return router
}
