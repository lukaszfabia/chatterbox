package domain

// Accepted events

type UserLoggedEvent struct {
	UserID   string `json:"userID"`
	Email    string `json:"email"`
	Username string `json:"username"`
	IsNew    bool   `json:"isNew"`
}

type UserSendMessage struct {
	SenderID         uint   `json:"senderID"`
	ReceiverID       uint   `json:"receiverID"`
	ReceiverUsername string `json:"receiverUsername"`
}
