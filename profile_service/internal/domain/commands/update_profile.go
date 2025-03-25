package commands

import (
	"mime/multipart"

	"github.com/google/uuid"
)

type UpdateProfileCommand struct {
	UUID           uuid.UUID             `json:"id"`
	Bio            string                `json:"bio"`
	AvatarFile     *multipart.FileHeader `json:"avatar_file"`
	BackgroundFile *multipart.FileHeader `json:"background_file"`
}
