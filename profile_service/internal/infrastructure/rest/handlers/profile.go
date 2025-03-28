package handlers

import (
	"log"
	"net/http"
	"profile_service/internal/application/commands"
	"profile_service/internal/application/queries"
	cmd "profile_service/internal/domain/commands"
	"profile_service/internal/domain/models"
	q "profile_service/internal/domain/queries"
	"profile_service/internal/infrastructure/rest"
	"profile_service/pkg"

	"github.com/gorilla/mux"
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

func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	body, files, err := pkg.DecodeMultipartForm[cmd.UpdateProfileCommand](r)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
		return
	}

	user, ok := r.Context().Value("user").(*models.Profile)
	if !ok || user == nil {
		rest.BadRequest(w)
		return
	}

	if avatarFile, ok := files["avatarFile"]; ok && len(avatarFile) > 0 {
		body.AvatarFile = avatarFile[0]
	}

	if backgroundFile, ok := files["backgroundFile"]; ok && len(backgroundFile) > 0 {
		body.BackgroundFile = backgroundFile[0]
	}

	body.UUID = user.ID

	res, err := h.commandService.UpdateProfile(*body)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
		return
	}

	rest.Ok(w, res)
}

func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	body, err := pkg.DecodeJSON[q.GetProfileQuery](r)

	if err != nil {
		id, ok := mux.Vars(r)["id"]
		if !ok {
			rest.BadRequest(w)
			return
		}
		body.UserID = id
	}

	res, err := h.queryService.GetProfile(*body)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
		return
	}

	rest.Ok(w, res)
}

func (h *ProfileHandler) GetProfiles(w http.ResponseWriter, r *http.Request) {
	body, err := pkg.DecodeJSON[q.GetProfilesQuery](r)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
		return
	}

	res, err := h.queryService.GetProfiles(*body)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
		return
	}

	rest.Ok(w, res)
}

func (h *ProfileHandler) GetAuthUserProfile(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("user").(*models.Profile)
	if !ok || user == nil {
		rest.BadRequest(w)
		return
	}

	rest.NewResponse(w, http.StatusOK, user)
}
