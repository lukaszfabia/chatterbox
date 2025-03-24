package writemodels

import (
	"net/mail"
	"profile_service/internal/domain/events"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Model struct {
	ID        uuid.UUID      `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`
}

type Profile struct {
	Model
	Username      string `gorm:"unique;not null;" json:"username"`
	Email         string `gorm:"unique;not null;" json:"email"`
	Bio           string `gorm:"size:512" json:"bio"`
	AvatarURL     string `gorm:"size:512" json:"avatar_url"`
	BackgroundURL string `gorm:"size:512" json:"background_url"`
}

func NewProfile(email string, username string, uid string) (*Profile, error) {
	id, err := uuid.Parse(uid)

	if err != nil {
		return nil, InvalidField("uid")
	}

	_, err = mail.ParseAddress(email)
	if err != nil {
		return nil, InvalidEmail()
	}

	uLen := len(username)
	if uLen < 3 || uLen > 64 {
		return nil, InvalidUsername()
	}

	return &Profile{
		Model: Model{
			ID: id,
		},
		Username: username,
		Email:    email,
		Bio:      "Edit me",
	}, nil
}

func NewProfileFromEvent(event events.UserCreatedEvent) (*Profile, error) {
	return NewProfile(event.Email, event.Username, event.UserID)
}

func (p *Profile) UpdateBio(newBio string) (*Profile, error) {
	lBio := len(newBio)

	if lBio < 0 || lBio > 512 {
		return nil, InvalidField("bio")
	}

	p.Bio = newBio

	return p, nil
}
