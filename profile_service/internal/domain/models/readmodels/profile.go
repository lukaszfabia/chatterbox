package readmodels

import (
	"time"

	"gorm.io/gorm"
)

type Model struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
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
