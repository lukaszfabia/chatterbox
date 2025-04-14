// Package rest provides an HTTP server with CORS configuration and graceful shutdown support.
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

// Server wraps an HTTP server and handles startup and graceful shutdown.
type Server struct {
	s *http.Server
}

// NewServer initializes a new Server with the given router, CORS support, and sensible timeouts.
// It reads the port from APP_PORT and host name from APP_ENV environment variables.
func NewServer(router *mux.Router) *Server {
	port := os.Getenv("APP_PORT")
	host := os.Getenv("APP_ENV")
	if host == "" {
		host = "localhost"
	}

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
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

// GracefulShutdown listens for system signals and shuts down the server cleanly,
// allowing up to 5 seconds for open connections to finish.
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

// StartAndListen starts the HTTP server and listens for incoming requests.
// If the server encounters a critical error (other than shutdown), it panics.
func (apiServer *Server) StartAndListen() {
	log.Printf("Server is listening on: http://%s%s", os.Getenv("APP_ENV"), apiServer.s.Addr)
	err := apiServer.s.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		panic(fmt.Sprintf("HTTP server error: %s", err))
	}
}
