package handlers

import (
	"log"
	"net/http"
	"notification_serivce/internal/infrastructure/rest"
	"notification_serivce/pkg"
	"strings"
)

func (h *NotificationHandler) IsAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("Validation...")
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
		_, err := pkg.DecodeJWT(tokenStr)

		if err != nil {
			log.Println("Error during decoding token")
			rest.Unauthorized(w)
			return
		}

		next.ServeHTTP(w, r)
	})
}
