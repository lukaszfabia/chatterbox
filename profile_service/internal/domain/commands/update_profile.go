package commands

import (
	"mime/multipart"
)

type UpdateProfileCommand struct {
	UUID           string                `json:"id"`
	Bio            string                `json:"bio"`
	AvatarFile     *multipart.FileHeader `json:"avatar_file"`
	BackgroundFile *multipart.FileHeader `json:"background_file"`
}
