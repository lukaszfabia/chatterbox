// provides HTTP request handlers for the notification service.
package handlers

import (
	"context"
	"log"
	"net/http"
	"notification_serivce/internal/infrastructure/rest"
	"notification_serivce/pkg"
	"strings"
)

// IsAuth is a middleware that checks if the incoming request contains a valid JWT token
// in the Authorization header. If valid, it extracts the user ID from the token and
// passes it to the next handler in the chain. If the token is missing or invalid,
// it responds with an Unauthorized status.
func (h *NotificationHandler) IsAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")

		if authorization == "" {
			log.Println("Unauthorized: Missing Authorization header")
			rest.Unauthorized(w)
			return
		}

		tokenStr := strings.TrimPrefix(authorization, "Bearer ")

		if tokenStr == "" {
			log.Println("Unauthorized: Token missing after trimming Bearer prefix")
			rest.Unauthorized(w)
			return
		}

		id, err := pkg.DecodeJWT(tokenStr)
		if err != nil {
			log.Printf("Error decoding token: %s\n", err.Error())
			rest.Unauthorized(w)
			return
		}

		ctx := context.WithValue(r.Context(), "userID", id)
		r = r.WithContext(ctx)

		log.Printf("Authorization successful for user ID: %v\n", id)

		next.ServeHTTP(w, r)
	})
}
