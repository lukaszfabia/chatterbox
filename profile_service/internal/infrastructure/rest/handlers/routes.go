// Package handlers defines the routes and handlers for the profile service API,
// including profile management, authentication, and Swagger documentation endpoints.
package handlers

import (
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"

	_ "profile_service/docs"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

// NewRouter creates and returns a new HTTP router that maps the API endpoints to their respective handlers.
// It configures routes for profile management, authentication, and API documentation (Swagger).
//
// Parameters:
//   - commandService: an instance of ProfileCommandService responsible for handling profile commands.
//   - queryService: an instance of ProfileQueryService responsible for handling profile queries.
//
// Returns:
//   - A pointer to a configured mux.Router that maps the API paths to the appropriate handler functions.
func NewRouter(commandService commands.ProfileCommandService, queryService queries.ProfileQueryService) *mux.Router {
	profileHandler := NewProfileHandler(commandService, queryService)

	router := mux.NewRouter()

	// File server to serve media files
	fileServer := http.FileServer(http.Dir("./media"))
	router.PathPrefix("/api/v1/profile/media/").Handler(http.StripPrefix("/api/v1/profile/media/", fileServer))

	// Swagger documentation routes
	router.PathPrefix("/api/v1/swagger/").Handler(httpSwagger.WrapHandler)
	router.PathPrefix("/api/v1/docs/").Handler(httpSwagger.WrapHandler)

	// Profile routes (e.g., GetProfile, GetProfiles)
	profileRouter := router.PathPrefix("/api/v1/profiles").Subrouter()
	profileRouter.HandleFunc("/{id}", profileHandler.GetProfile).Methods(http.MethodGet)
	profileRouter.HandleFunc("", profileHandler.GetProfiles).Methods(http.MethodGet)

	// Authentication routes
	authRouter := router.PathPrefix("/api/v1/auth").Subrouter()
	authRouter.Use(profileHandler.IsAuth)

	// Routes for the authenticated user's profile
	authRouter.HandleFunc("/me", profileHandler.GetAuthUserProfile).Methods(http.MethodGet)
	authRouter.HandleFunc("/me", profileHandler.UpdateProfile).Methods(http.MethodPut)

	return router
}
