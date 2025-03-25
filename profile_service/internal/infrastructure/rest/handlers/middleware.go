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

func (h *ProfileHandler) IsAuth(next http.Handler) http.Handler {
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

		// set user in ctx
		ctx := context.WithValue(r.Context(), "user", user)
		r = r.WithContext(ctx)

		// go to next handler
		log.Printf("Done... %v\n", user)

		next.ServeHTTP(w, r)
	})
}
