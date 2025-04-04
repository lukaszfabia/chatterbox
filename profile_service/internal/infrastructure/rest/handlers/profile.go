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
	"strconv"

	"github.com/gorilla/mux"
	// @title Profile Service API
	// @version 1.0
	// @description Profile management microservice
	// @host localhost:8000
	// @BasePath /api/v1
	// @securityDefinitions.apikey BearerAuth
	// @in header
	// @name Authorization
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

// UpdateProfile updates the profile of the currently authenticated user
// @Summary Update user profile
// @Description Updates the profile of the logged-in user
// @Tags profile
// @Accept  multipart/form-data
// @Produce json
// @Security ApiKeyAuth
// @Param firstName formData string false "First name"
// @Param lastName formData string false "Last name"
// @Param bio formData string false "Biography"
// @Param avatarFile formData file false "Avatar image"
// @Param backgroundFile formData file false "Background image"
// @Success 200 {object} models.Profile
// @Failure 400 {object} nil "Invalid request"
// @Failure 401 {object} nil "Unauthorized"
// @Router /api/v1/auth/me [put]
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

// GetProfile retrieves a profile by ID
// @Summary Get user profile
// @Description Returns user profile details based on the provided user ID
// @Tags Profile
// @Accept  json
// @Produce  json
// @Param id path string true "User ID"
// @Success 200 {object} models.Profile "Profile details"
// @Failure 400 {object} nil "Invalid request"
// @Router /api/v1/profiles/{id} [get]
func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	body := &q.GetProfileQuery{}

	id, ok := mux.Vars(r)["id"]
	if !ok {
		rest.BadRequest(w)
		return
	}

	log.Println(id)

	body.UserID = id

	res, err := h.queryService.GetProfile(*body)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
		return
	}

	rest.Ok(w, res)
}

// GetProfiles retrieves a list of profiles with pagination
// @Summary Get list of profiles
// @Description Returns a list of user profiles with pagination
// @Tags Profile
// @Accept  json
// @Produce  json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of profiles per page" default(10)
// @Success 200 {array} models.Profile "List of profiles"
// @Failure 400 {object} nil "Invalid request"
// @Router /api/v1/profiles [get]
func (h *ProfileHandler) GetProfiles(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")
	limit := r.URL.Query().Get("limit")

	if page == "" {
		page = "1"
	}
	if limit == "" {
		limit = "10"
	}

	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt <= 0 {
		log.Println("Invalid page number")
		rest.BadRequest(w)
		return
	}

	limitInt, err := strconv.Atoi(limit)
	if err != nil || limitInt <= 0 {
		log.Println("Invalid limit value")
		rest.BadRequest(w)
		return
	}

	// Construct query with pagination
	body := &q.GetProfilesQuery{
		Page:  pageInt,
		Limit: limitInt,
	}

	res, err := h.queryService.GetProfiles(*body)

	if err != nil {
		log.Println(err.Error())
		rest.BadRequest(w)
		return
	}

	rest.Ok(w, res)
}

// GetAuthUserProfile retrieves the profile of the authenticated user
// @Summary Get authenticated user profile
// @Description Returns the profile of the currently logged-in user
// @Tags Auth
// @Accept  json
// @Produce  json
// @Success 200 {object} models.Profile "Authenticated user profile"
// @Failure 401 {object} nil "Unauthorized"
// @Router /api/v1/auth/me [get]
func (h *ProfileHandler) GetAuthUserProfile(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("user").(*models.Profile)
	if !ok || user == nil {
		rest.Unauthorized(w)
		return
	}

	rest.NewResponse(w, http.StatusOK, user)
}
