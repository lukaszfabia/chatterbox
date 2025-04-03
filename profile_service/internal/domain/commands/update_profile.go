package commands

import (
	"mime/multipart"
)

type UpdateProfileCommand struct {
	UUID           string                `json:"id" form:"id"`
	FirstName      *string               `json:"firstName" form:"firstName"`
	LastName       *string               `json:"lastName" form:"lastName"`
	Bio            *string               `json:"bio" form:"bio"`
	AvatarFile     *multipart.FileHeader `json:"-" form:"avatarFile" swaggerignore:"true"`
	BackgroundFile *multipart.FileHeader `json:"-" form:"backgroundFile" swaggerignore:"true"`
}
