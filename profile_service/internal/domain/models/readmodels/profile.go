package readmodels

import (
	"time"

	"github.com/google/uuid"
)

// Denormalized profile for nosql
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
