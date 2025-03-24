package api

// func (apiServer *Server) RegisterRoutes(router *mux.Router, repo repositories.Repository) http.Handler {
// 	r := mux.NewRouter()
// 	r.Use(mux.CORSMethodMiddleware(r))

// 	r.PathPrefix("/api/v1")

// 	apiServer.UserRoutes(r)
// 	apiServer.ProfileRoutes(r)

// 	return r
// }

// func (apiServer *Server) UserRoutes(r *mux.Router) {
// 	// user := r.PathPrefix("/users").Subrouter()

// }

// func (apiServer *Server) ProfileRoutes(r *mux.Router) {
// 	profile := r.PathPrefix("/profile").Subrouter()
// 	profile.Use(apiServer.IsAuth)

// }
