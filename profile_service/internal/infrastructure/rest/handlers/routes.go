package handlers

import (
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"

	_ "profile_service/docs"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

func NewRouter(commandService commands.ProfileCommandService, queryService queries.ProfileQueryService) *mux.Router {
	profileHandler := NewProfileHandler(commandService, queryService)
	router := mux.NewRouter()

	fileServer := http.FileServer(http.Dir("./media"))
	router.PathPrefix("/api/v1/profile/media/").Handler(http.StripPrefix("/api/v1/profile/media/", fileServer))

	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	profileRouter := router.PathPrefix("/api/v1/profiles").Subrouter()

	profileRouter.HandleFunc("/{id}", profileHandler.GetProfile).Methods(http.MethodGet)

	profileRouter.HandleFunc("", profileHandler.GetProfiles).Methods(http.MethodGet)

	authRouter := router.PathPrefix("/api/v1/auth").Subrouter()
	authRouter.Use(profileHandler.IsAuth)

	authRouter.HandleFunc("/me", profileHandler.GetAuthUserProfile).Methods(http.MethodGet)

	authRouter.HandleFunc("/me", profileHandler.UpdateProfile).Methods(http.MethodPut)

	return router
}
