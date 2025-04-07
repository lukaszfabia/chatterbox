package handlers

import (
	"context"
	"log"
	"net/http"
	"notification_serivce/internal/infrastructure/rest"
	"notification_serivce/pkg"
	"strings"
)

func (h *NotificationHandler) IsAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")

		// no bearer token
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

		// decode token
		id, err := pkg.DecodeJWT(tokenStr)

		if err != nil {
			log.Printf("Error during decoding token: %s\n", err.Error())
			rest.Unauthorized(w)
			return
		}

		ctx := context.WithValue(r.Context(), "userID", id)
		r = r.WithContext(ctx)

		// go to next handler
		log.Printf("Done... %v\n", id)

		next.ServeHTTP(w, r)
	})
}
