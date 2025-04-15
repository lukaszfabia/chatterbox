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
	router.HandleFunc("/api/v1/docs", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/api/v1/docs/", http.StatusMovedPermanently)
	})

	router.Methods(http.MethodOptions, http.MethodHead).PathPrefix("/api/v1/docs/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Swagger UI
	router.PathPrefix("/api/v1/docs/").Handler(httpSwagger.WrapHandler)

	notiHandler := NewNotificationHandler(commandService, queryService)

	authRouter := apiRouter.PathPrefix("").Subrouter()
	authRouter.Use(notiHandler.IsAuth)

	authRouter.HandleFunc("/notifications", notiHandler.GetNotifications).Methods(http.MethodGet)

	return router
}
