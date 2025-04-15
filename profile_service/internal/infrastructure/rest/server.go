// Package rest implements an HTTP server with routing, CORS handling, and graceful shutdown functionality.
package rest

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Server represents the HTTP server.
type Server struct {
	s *http.Server
}

// NewServer creates a new HTTP server with the provided router and configured settings.
// It reads the port and environment variables from the system environment and sets up CORS handling.
//
// Parameters:
//   - router: the HTTP router that will handle incoming requests.
//
// Returns:
//   - A pointer to the newly created Server instance.
func NewServer(router *mux.Router) *Server {
	port := os.Getenv("APP_PORT")
	host := os.Getenv("APP_ENV")
	if host == "" {
		host = "localhost"
	}

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	handler := corsHandler.Handler(router)

	s := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      handler,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return &Server{s: s}
}

// GracefulShutdown handles the graceful shutdown of the server.
// It listens for system signals like SIGINT or SIGTERM and shuts down the server cleanly,
// ensuring that no in-progress requests are interrupted.
//
// Parameters:
//   - done: a channel that is used to signal when the server has finished shutting down.
func (apiServer *Server) GracefulShutdown(done chan bool) {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	log.Println("Shutting down gracefully, press Ctrl+C again to force")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := apiServer.s.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")
	done <- true
}

// StartAndListen starts the HTTP server and begins listening for incoming requests.
// It logs the URL where the server is listening and handles any errors that occur
// during the server's execution. If the server shuts down, the method returns.
//
// Example usage:
//
//	go server.StartAndListen()
func (apiServer *Server) StartAndListen() {
	log.Printf("Server is listening on: http://%s%s", os.Getenv("APP_ENV"), apiServer.s.Addr)
	err := apiServer.s.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		// If there is an error other than server closure, panic
		panic(fmt.Sprintf("HTTP server error: %s", err))
	}
}
