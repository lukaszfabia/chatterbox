package handlers

import (
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"

	"github.com/gorilla/mux"
)

func NewRouter(commandService commands.ProfileCommandService, queryService queries.ProfileQueryService) *mux.Router {
	router := mux.NewRouter()

	profileHandler := NewProfileHandler(commandService, queryService)

	router.HandleFunc("/profiles/{id}", profileHandler.GetProfile).Methods(http.MethodGet)
	router.HandleFunc("/profiles", profileHandler.GetProfile).Methods(http.MethodGet)

	authRouter := router.NewRoute().Subrouter()
	authRouter.Use(profileHandler.IsAuth)

	authRouter.HandleFunc("/profiles", profileHandler.UpdateProfile).Methods(http.MethodPut)

	return router
}
