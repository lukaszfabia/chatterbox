package repositories

import (
	"context"
	"fmt"
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/infrastructure/database"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type NotificationRepository interface {
	GetAllNotifications(userID string) ([]models.Notification, error)
	DeleteNotification(id string) error
	AddNotification(noti models.Notification) (*models.Notification, error)
}

type notificationRepoImpl struct {
	database *database.Database
}

func NewNotificationRepository(database *database.Database) NotificationRepository {
	return &notificationRepoImpl{
		database: database,
	}
}

func (n *notificationRepoImpl) AddNotification(noti models.Notification) (*models.Notification, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := n.database.GetNoSql().InsertOne(ctx, noti)
	if err != nil {
		return nil, fmt.Errorf("failed to insert notification: %w", err)
	}

	return &noti, nil
}

func (n *notificationRepoImpl) DeleteNotification(id string) error {
	uuid, err := uuid.Parse(id)
	if err != nil {
		return fmt.Errorf("invalid notification ID: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": uuid}
	result, err := n.database.GetNoSql().DeleteOne(ctx, filter)
	if err != nil {
		return fmt.Errorf("failed to delete notification: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("notification not found")
	}

	return nil
}

func (n *notificationRepoImpl) GetAllNotifications(userID string) ([]models.Notification, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userID": userID}
	opts := options.Find().SetSort(bson.D{{Key: "sentAt", Value: -1}})

	cursor, err := n.database.GetNoSql().Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to find notifications: %w", err)
	}
	defer cursor.Close(ctx)

	var notifications []models.Notification
	if err = cursor.All(ctx, &notifications); err != nil {
		return nil, fmt.Errorf("failed to decode notifications: %w", err)
	}

	return notifications, nil
}

func (n *notificationRepoImpl) ClearAllNotifications() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := n.database.GetNoSql().DeleteMany(ctx, bson.M{})
	return err
}
