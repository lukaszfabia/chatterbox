package handlers

import (
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"
)

type ProfileHandler struct {
	commandService commands.ProfileCommandService
	queryService   queries.ProfileQueryService
}

func NewProfileHandler(commandService commands.ProfileCommandService, queryService queries.ProfileQueryService) *ProfileHandler {
	return &ProfileHandler{
		commandService: commandService,
		queryService:   queryService,
	}
}

func (h *ProfileHandler) CreateProfile(w http.ResponseWriter, r *http.Request) {}
func (h *ProfileHandler) DeleteProfile(w http.ResponseWriter, r *http.Request) {}
func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {}

func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {}
