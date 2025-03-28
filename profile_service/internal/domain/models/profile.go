package models

import (
	"log"
	"profile_service/internal/domain/commands"
	"profile_service/internal/domain/events"
	"profile_service/pkg"
	"time"
)

func isValidBio(bio, old string) bool {
	bioLen := len(bio)

	return bioLen > 0 && bioLen <= 512 && bio != old
}

func canBeSet(new *string, old string) bool {
	if new == nil {
		return false
	}

	return len(*new) > 0 && *new != old
}

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
		log.Println("no file provided")
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

type Profile struct {
	ID            string     `bson:"id,omitempty" json:"id"`
	CreatedAt     time.Time  `bson:"createdAt" json:"createdAt"`
	UpdatedAt     time.Time  `bson:"updatedAt" json:"updatedAt"`
	DeletedAt     *time.Time `bson:"deletedAt,omitempty" json:"deletedAt"`
	FirstName     *string    `bson:"firstName" json:"firstName"`
	LastName      *string    `bson:"lastName" json:"lastName"`
	Username      string     `bson:"username" json:"username"`
	Email         string     `bson:"email" json:"email"`
	Bio           string     `bson:"bio" json:"bio"`
	AvatarURL     *string    `bson:"avatarURL" json:"avatarURL"`
	BackgroundURL *string    `bson:"backgroundURL" json:"backgroundURL"`
}

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

func (p *Profile) UpdateAuthInfo(new events.UserUpdatedEvent) {
	p.UpdatedAt = time.Now()

	if canBeSet(new.Email, p.Email) {
		p.Email = *new.Email
	}

	if canBeSet(new.Username, p.Username) {
		p.Username = *new.Username
	}
}

func (p *Profile) MarkDelete() {
	t := time.Now()

	p.DeletedAt = &t
}
