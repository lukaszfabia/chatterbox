// Package handlers contains HTTP request handlers for profile-related operations.
package handlers

import (
	"context"
	"log"
	"net/http"
	"profile_service/internal/domain/queries"
	"profile_service/internal/infrastructure/rest"
	"profile_service/pkg"
	"strings"
)

// key type is used to define custom keys for storing values in request context.
type key string

// _user is the key used to store the authenticated user in the request context.
const _user key = "user"

// IsAuth is a middleware function that validates the JWT token passed in the Authorization header of the request.
// It decodes the token to retrieve the user's ID, then fetches the corresponding profile from the database.
// If the token is valid and the user is found, the user is added to the request context, and the request proceeds.
// If the token is missing, invalid, or if there is an error retrieving the user, an Unauthorized response is sent.
//
// Parameters:
//   - next: the next handler to call after the authorization is successful.
//
// Returns:
//   - An HTTP handler that performs token validation and, if successful, passes control to the next handler.
func (h *ProfileHandler) IsAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("Validation...")
		authorization := r.Header.Get("Authorization")

		if authorization == "" {
			log.Println("Unauthorized")
			rest.Unauthorized(w)
			return
		}

		tokenStr := strings.TrimPrefix(authorization, "Bearer ")

		if tokenStr == "" {
			log.Println("Token missing after trimming Bearer prefix")
			rest.Unauthorized(w)
			return
		}

		id, err := pkg.DecodeJWT(tokenStr)

		if err != nil {
			log.Println("Error during decoding token")
			rest.Unauthorized(w)
			return
		}

		q := queries.GetProfileQuery{UserID: id.String()}

		user, err := h.queryService.GetProfile(q)

		if err != nil {
			log.Println("Error retrieving user from database:", err)
			rest.Unauthorized(w)
			return
		}

		ctx := context.WithValue(r.Context(), _user, user)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}
