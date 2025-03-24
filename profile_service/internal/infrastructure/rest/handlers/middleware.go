package handlers

import (
	"context"
	"log"
	"net/http"
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
			rest.NewResponse(w, http.StatusUnauthorized, "")
			return
		}

		tokenStr := strings.TrimPrefix(authorization, "Bearer ")

		if tokenStr == "" {
			log.Println("Token missing after trimming Bearer prefix")
			rest.NewResponse(w, http.StatusUnauthorized, "")
			return
		}

		// decode token
		id, err := pkg.DecodeJWT(tokenStr)

		if err != nil {
			log.Println("Error during decoding token")
			rest.NewResponse(w, http.StatusUnauthorized, err.Error())
			return
		}

		user, err := h.queryService.GetProfile(id)

		if err != nil {
			log.Println("Error retrieving user from database:", err)
			rest.NewResponse(w, http.StatusUnauthorized, "")
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
