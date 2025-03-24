package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"profile_service/internal/infrastructure/repositories"
	"strings"
	"syscall"
	"time"

	"github.com/gorilla/mux"
)

// type Server interface {
// }

type Server struct {
	s    *http.Server
	repo repositories.Repository
}

func NewServer(repo repositories.Repository, router *mux.Router) *Server {
	port := os.Getenv("APP_PORT")
	host := strings.TrimSpace(os.Getenv("APP_ENV"))
	if host == "" {
		host = "localhost"
	}

	s := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      router,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return &Server{s: s, repo: repo}
}

func (apiServer *Server) GracefulShutdown(done chan bool) {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.s.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")

	done <- true
}

func (apiServer *Server) StartAndListen() {
	err := apiServer.s.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		panic(fmt.Sprintf("http server error: %s", err))
	}
}

func (apiServer *Server) GetProfileRepo() repositories.ProfileRepository {
	return apiServer.repo.ProfileRepository()
}
