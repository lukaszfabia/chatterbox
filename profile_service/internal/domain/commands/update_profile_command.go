package commands

import (
	"mime/multipart"
)

// UpdateProfileCommand defines the structure for updating a user profile.
type UpdateProfileCommand struct {
	UUID           string                `json:"id" form:"id" validate:"required,uuid"`                        // UUID is required and must be a valid UUID
	FirstName      *string               `json:"firstName" form:"firstName" validate:"omitempty,min=1,max=50"` // Optional but should not be empty if provided
	LastName       *string               `json:"lastName" form:"lastName" validate:"omitempty,min=1,max=50"`   // Optional but should not be empty if provided
	Bio            *string               `json:"bio" form:"bio" validate:"omitempty,max=512"`                  // Optional bio with a max length
	AvatarFile     *multipart.FileHeader `json:"-" form:"avatarFile" swaggerignore:"true"`                     // Avatar file (optional)
	BackgroundFile *multipart.FileHeader `json:"-" form:"backgroundFile" swaggerignore:"true"`                 // Background file (optional)
}
