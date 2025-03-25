package models

import (
	"profile_service/internal/domain/commands"
	"profile_service/pkg"
	"time"

	"github.com/google/uuid"
)

func isValidBio(bio string) bool {
	bioLen := len(bio)

	return bioLen > 0 && bioLen <= 512
}

type Profile struct {
	ID            uuid.UUID  `bson:"_id,omitempty" json:"id"`
	CreatedAt     time.Time  `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time  `bson:"updatedAt" json:"updatedAt"`
	DeletedAt     *time.Time `bson:"deletedAt,omitempty" json:"deletedAt"`
	Username      string     `bson:"username" json:"username"`
	Email         string     `bson:"email" json:"email"`
	Bio           string     `bson:"bio" json:"bio"`
	AvatarURL     string     `bson:"avatar_url" json:"avatar_url"`
	BackgroundURL string     `bson:"background_url" json:"background_url"`
}

func NewProfile(email, username, uid string) (*Profile, error) {
	id, err := uuid.Parse(uid)
	if err != nil {
		return nil, err
	}

	return &Profile{
		ID:        id,
		Username:  username,
		Email:     email,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Bio:       "Edit me!",
	}, nil
}

func (p *Profile) UpdateProfile(new commands.UpdateProfileCommand) {

	aUrl, err := pkg.SaveImage[*pkg.Avatar](new.AvatarFile, p.AvatarURL)

	if err == nil {
		p.AvatarURL = aUrl
	}

	bUrl, err := pkg.SaveImage[*pkg.Background](new.BackgroundFile, p.BackgroundURL)

	if err == nil {
		p.BackgroundURL = bUrl
	}

	if p.Bio != new.Bio && isValidBio(new.Bio) {
		p.Bio = new.Bio
	}

}
