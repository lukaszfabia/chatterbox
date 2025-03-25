package writemodels

import (
	"net/mail"
	"profile_service/internal/domain/events"
	"profile_service/internal/domain/models/readmodels"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Model struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	UUID      uuid.UUID      `gorm:"type:uuid;uniqueIndex" json:"uuid"`
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
			UUID:      id,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		Username: username,
		Email:    email,
		Bio:      "Edit me",
	}, nil
}

func NewProfileFromEvent(event events.UserCreatedEvent) (*Profile, error) {
	return NewProfile(event.Email, event.Username, event.UserID)
}

func NewReadOnlyProfile(p Profile) readmodels.Profile {
	return readmodels.Profile{
		ID:            p.UUID,
		Username:      p.Username,
		Email:         p.Email,
		Bio:           p.Bio,
		AvatarURL:     p.AvatarURL,
		BackgroundURL: p.BackgroundURL,
		CreatedAt:     p.CreatedAt,
		UpdatedAt:     p.UpdatedAt,
		DeletedAt:     &p.DeletedAt.Time,
	}
}
