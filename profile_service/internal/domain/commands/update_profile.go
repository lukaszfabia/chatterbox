package commands

import (
	"mime/multipart"
)

type UpdateProfileCommand struct {
	UUID           string                `json:"id"`
	FirstName      *string               `json:"firstName"`
	LastName       *string               `json:"lastName"`
	Bio            *string               `json:"bio"`
	AvatarFile     *multipart.FileHeader `json:"avatarFile"`
	BackgroundFile *multipart.FileHeader `json:"backgroundFile"`
}
