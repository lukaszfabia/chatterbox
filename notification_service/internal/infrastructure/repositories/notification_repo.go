package repositories

import (
	"encoding/json"
	"fmt"
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/infrastructure/database"
)

type NotificationRepository interface {
	GetAllNotifications(userID string) ([]models.Notification, error)
	DeleteNotification(id string) error
	AddNotification(noti models.Notification) (*models.Notification, error)
}

type notificationRepoImpl struct {
	database *database.Database
}

func (n *notificationRepoImpl) AddNotification(noti models.Notification) (*models.Notification, error) {
	notificationData, err := json.Marshal(noti)
	if err != nil {
		return nil, err
	}

	err = n.database.GetRedis().LPush(fmt.Sprintf("userID:%s", noti.UserID), notificationData).Err()
	if err != nil {
		return nil, err
	}

	return &noti, nil
}

func (n *notificationRepoImpl) DeleteNotification(id string) error {
	_, err := n.database.GetRedis().Del(fmt.Sprintf("id:%s", id)).Result()
	return err
}

func (n *notificationRepoImpl) GetAllNotifications(userID string) ([]models.Notification, error) {
	res, err := n.database.GetRedis().LRange(fmt.Sprintf("userID:%s", userID), 0, -1).Result()
	if err != nil {
		return nil, err
	}
	var notifications []models.Notification
	for _, notificationData := range res {
		var notification models.Notification
		err := json.Unmarshal([]byte(notificationData), &notification)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}

	return notifications, nil
}
func NewNotificationRepository(database *database.Database) NotificationRepository {
	return &notificationRepoImpl{database: database}
}
