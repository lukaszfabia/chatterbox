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

func NewRouter(commandService commands.NotificationCommandService, queryService queries.NotificationQueryService, ws *ws.WebSocketServer) *mux.Router {
	router := mux.NewRouter()
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	router.HandleFunc("/ws", ws.HandleConnection)

	apiRouter := router.PathPrefix("/api/v1").Subrouter()

	notiHandler := NewNotificationHandler(commandService, queryService)

	authRouter := apiRouter.PathPrefix("").Subrouter()
	authRouter.Use(notiHandler.IsAuth)

	authRouter.HandleFunc("/notifications", notiHandler.GetNotifications).Methods(http.MethodGet)

	return router
}
