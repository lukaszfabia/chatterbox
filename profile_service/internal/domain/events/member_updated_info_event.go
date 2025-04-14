package events

import "log"

// MemberUpdatedInfoEvent represents the event of a member's information update.
// This includes the user ID, updated username, and avatar URL.
type MemberUpdatedInfoEvent struct {
	UserID    string  `json:"userID"`    // The unique identifier of the user whose info is updated
	Username  *string `json:"username"`  // The updated username (nullable)
	AvatarURL *string `json:"avatarURL"` // The updated avatar URL (nullable)
}

// NewMemberUpdatedInfoEvent creates a new instance of MemberUpdatedInfoEvent with the provided user ID, username, and avatar URL.
func NewMemberUpdatedInfoEvent(userID string, username, avatarURL *string) MemberUpdatedInfoEvent {
	return MemberUpdatedInfoEvent{
		UserID:    userID,
		Username:  username,
		AvatarURL: avatarURL,
	}
}

// Log outputs a log message when a member's information is updated.
// You can extend this function to log more detailed information about the update.
func (m MemberUpdatedInfoEvent) Log() {
	log.Printf("User with ID %s updated their profile", m.UserID)

	if m.Username != nil {
		log.Printf("Updated Username: %s", *m.Username)
	}

	if m.AvatarURL != nil {
		log.Printf("Updated Avatar URL: %s", *m.AvatarURL)
	}
}
