package models

import (
	"log"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/events"
	"profile_service/pkg"
	"time"
)

// Profile represents a user's profile, including their personal information, images, and timestamps.
type Profile struct {
	ID            string     `bson:"id,omitempty" json:"id"`               // Unique identifier for the profile
	CreatedAt     time.Time  `bson:"createdAt" json:"createdAt"`           // Time when the profile was created
	UpdatedAt     time.Time  `bson:"updatedAt" json:"updatedAt"`           // Time when the profile was last updated
	DeletedAt     *time.Time `bson:"deletedAt,omitempty" json:"deletedAt"` // Time when the profile was marked as deleted
	FirstName     *string    `bson:"firstName" json:"firstName"`           // User's first name
	LastName      *string    `bson:"lastName" json:"lastName"`             // User's last name
	Username      string     `bson:"username" json:"username"`             // User's username (unique)
	Email         string     `bson:"email" json:"email"`                   // User's email (unique)
	Bio           string     `bson:"bio" json:"bio"`                       // User's bio
	AvatarURL     *string    `bson:"avatarURL" json:"avatarURL"`           // URL to the user's avatar image
	BackgroundURL *string    `bson:"backgroundURL" json:"backgroundURL"`   // URL to the user's background image
}

// isValidBio checks if the provided bio is valid:
// - It must be between 1 and 512 characters long.
// - It must be different from the old bio.
func isValidBio(bio, old string) bool {
	bioLen := len(bio)
	return bioLen > 0 && bioLen <= 512 && bio != old
}

// canBeSet checks if the new value for a field is non-empty and different from the old value.
func canBeSet(new *string, old string) bool {
	if new == nil {
		return false
	}
	return len(*new) > 0 && *new != old
}

// tryToSaveImg tries to save the new avatar and background images.
// It updates the profile's AvatarURL and BackgroundURL if new images are provided.
func (p *Profile) tryToSaveImg(new commands.UpdateProfileCommand) error {
	log.Println("Saving image")

	if new.AvatarFile != nil {
		aUrl, err := pkg.SaveImage[*pkg.Avatar](new.AvatarFile, p.AvatarURL)
		if err != nil {
			log.Println(err.Error())
			return err
		}
		p.AvatarURL = &aUrl
	} else {
		log.Println("No Avatar file provided")
	}

	if new.BackgroundFile != nil {
		bUrl, err := pkg.SaveImage[*pkg.Background](new.BackgroundFile, p.BackgroundURL)
		if err != nil {
			log.Println(err.Error())
			return err
		}
		p.BackgroundURL = &bUrl
	}

	return nil
}

// NewProfile creates a new user profile with the given email, username, and unique ID.
// Sets initial values for bio, creation date, and update date.
func NewProfile(email, username, uid string) (*Profile, error) {
	return &Profile{
		ID:        uid,
		Username:  username,
		Email:     email,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Bio:       "Edit me!",
	}, nil
}

// UpdateProfile updates the user's profile information based on the provided UpdateProfileCommand.
// This includes the bio, first name, last name, and images.
func (p *Profile) UpdateProfile(new commands.UpdateProfileCommand) {
	log.Println("Changing data")
	p.UpdatedAt = time.Now()

	if err := p.tryToSaveImg(new); err != nil {
		log.Println(err.Error())
	}

	if new.Bio != nil && isValidBio(*new.Bio, p.Bio) {
		p.Bio = *new.Bio
	}

	if p.FirstName == nil || canBeSet(new.FirstName, *p.FirstName) {
		p.FirstName = new.FirstName
	}

	if p.LastName == nil || canBeSet(new.LastName, *p.LastName) {
		p.LastName = new.LastName
	}
}

// UpdateAuthInfo updates the user's email and username based on the provided UserUpdatedEvent.
// This is usually triggered by an update in authentication information.
func (p *Profile) UpdateAuthInfo(new events.UserUpdatedEvent) {
	p.UpdatedAt = time.Now()

	if canBeSet(new.Email, p.Email) {
		p.Email = *new.Email
	}

	if canBeSet(new.Username, p.Username) {
		p.Username = *new.Username
	}
}

// MarkDelete marks the profile as deleted by setting the DeletedAt field to the current time.
func (p *Profile) MarkDelete() {
	t := time.Now()
	p.DeletedAt = &t
}
