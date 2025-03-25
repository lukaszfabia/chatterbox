package handlers

import (
	"log"
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"
	cmd "profile_service/internal/domain/commands"
	q "profile_service/internal/domain/queries"
	"profile_service/internal/infrastructure/rest"
	"profile_service/pkg"
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

func (h *ProfileHandler) DeleteProfile(w http.ResponseWriter, r *http.Request) {}
func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	body, err := pkg.DecodeMultipartForm[cmd.UpdateProfileCommand](r)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
	}

	res, err := h.commandService.UpdateProfile(*body)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
	}

	rest.Ok(w, res)
}

func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	body, err := pkg.DecodeMultipartForm[q.GetProfileQuery](r)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
	}

	res, err := h.queryService.GetProfile(*body)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
	}

	rest.Ok(w, res)
}
