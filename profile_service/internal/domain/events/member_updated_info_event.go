package events

type MemberUpdatedInfoEvent struct {
	UserID    string  `json:"userID"`
	Username  *string `json:"username"`
	AvatarURL *string `json:"avatarURL"`
}

func NewMemberUpdatedInfoEvent(userID string, username, avatarURL *string) MemberUpdatedInfoEvent {
	return MemberUpdatedInfoEvent{
		UserID:    userID,
		Username:  username,
		AvatarURL: avatarURL,
	}
}

func (MemberUpdatedInfoEvent) Log() {}
