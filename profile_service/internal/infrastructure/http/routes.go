package http

import (
	"net/http"

	"github.com/gorilla/mux"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := mux.NewRouter()
	r.Use(mux.CORSMethodMiddleware(r))

	r.PathPrefix("/api/v1")

	profile := r.PathPrefix("/profile").Subrouter()
	profile.Use(s.isAuth)

	return r
}
