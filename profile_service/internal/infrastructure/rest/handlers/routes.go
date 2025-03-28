package handlers

import (
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"

	"github.com/gorilla/mux"
)

func NewRouter(commandService commands.ProfileCommandService, queryService queries.ProfileQueryService) *mux.Router {
	profileHandler := NewProfileHandler(commandService, queryService)
	router := mux.NewRouter()

	fileServer := http.FileServer(http.Dir("./media"))
	router.PathPrefix("/api/v1/media/").Handler(http.StripPrefix("/api/v1/media/", fileServer))

	apiRouter := router.PathPrefix("/api/v1/profile").Subrouter()

	apiRouter.HandleFunc("", profileHandler.GetProfile).Methods(http.MethodGet)
	apiRouter.HandleFunc("/many", profileHandler.GetProfiles).Methods(http.MethodGet)

	authRouter := apiRouter.PathPrefix("/auth").Subrouter()
	authRouter.Use(profileHandler.IsAuth)

	authRouter.HandleFunc("/me", profileHandler.UpdateProfile).Methods(http.MethodPut)
	authRouter.HandleFunc("/me", profileHandler.GetAuthUserProfile).Methods(http.MethodGet)

	return router
}
