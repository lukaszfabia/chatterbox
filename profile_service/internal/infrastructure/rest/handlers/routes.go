package handlers

import (
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"

	"github.com/gorilla/mux"
)

func NewRouter(commandService commands.ProfileCommandService, queryService queries.ProfileQueryService) *mux.Router {
	router := mux.NewRouter()

	apiRouter := router.PathPrefix("/api/v1").Subrouter()

	profileHandler := NewProfileHandler(commandService, queryService)

	apiRouter.HandleFunc("/profiles/{id}", profileHandler.GetProfile).Methods(http.MethodGet)
	apiRouter.HandleFunc("/profiles", profileHandler.GetProfile).Methods(http.MethodGet)

	authRouter := apiRouter.NewRoute().Subrouter()
	authRouter.Use(profileHandler.IsAuth)

	authRouter.HandleFunc("/profiles", profileHandler.UpdateProfile).Methods(http.MethodPut)

	return router
}
