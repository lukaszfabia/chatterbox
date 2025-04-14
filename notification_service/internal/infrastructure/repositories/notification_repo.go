// package repositories provides the implementation for managing notifications in the database.
// It defines methods for interacting with the notifications, such as adding, retrieving, and deleting notifications.
package repositories

import (
	"context"
	"fmt"
	"log"
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/domain/queries"
	"notification_serivce/internal/infrastructure/database"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// NotificationRepository defines the interface for interacting with notification data.
// It provides methods for adding, retrieving, and deleting notifications from the database.
type NotificationRepository interface {
	// GetAllNotifications retrieves all notifications for a given user, with pagination.
	// It accepts a user ID and a query object that contains pagination information.
	// Returns a slice of notifications or an error if any occurs.
	GetAllNotifications(userID string, q queries.GetNotificationsQuery) ([]models.Notification, error)

	// DeleteNotification deletes a specific notification by its ID.
	// Returns an error if the deletion fails or if the notification is not found.
	DeleteNotification(id string) error

	// AddNotification adds a new notification to the database.
	// Returns the added notification or an error if the insertion fails.
	AddNotification(noti models.Notification) (*models.Notification, error)
}

// notificationRepoImpl is the concrete implementation of the NotificationRepository interface.
// It interacts with the database to perform CRUD operations for notifications.
type notificationRepoImpl struct {
	database *database.Database
}

// NewNotificationRepository creates a new instance of NotificationRepository.
// It accepts a pointer to a Database object and returns a NotificationRepository implementation.
func NewNotificationRepository(database *database.Database) NotificationRepository {
	return &notificationRepoImpl{
		database: database,
	}
}

// AddNotification inserts a new notification into the database.
// It returns the added notification if successful, or an error if the insertion fails.
func (n *notificationRepoImpl) AddNotification(noti models.Notification) (*models.Notification, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := n.database.GetNoSql().InsertOne(ctx, noti)
	if err != nil {
		return nil, fmt.Errorf("failed to insert notification: %w", err)
	}

	return &noti, nil
}

// DeleteNotification removes a notification by its ID.
// It returns an error if the notification is not found or if the deletion fails.
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

// GetAllNotifications retrieves all notifications for a user, supporting pagination.
// It accepts a user ID and query parameters for pagination (page and limit).
// Returns a list of notifications or an error if any occurs.
func (n *notificationRepoImpl) GetAllNotifications(userID string, q queries.GetNotificationsQuery) ([]models.Notification, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userid": userID}

	opts := options.Find().
		SetSkip(int64(q.Page-1) * int64(q.Limit)).
		SetSort(bson.D{{Key: "sentAt", Value: -1}}).
		SetLimit(int64(q.Limit))

	cursor, err := n.database.GetNoSql().Find(ctx, filter, opts)
	if err != nil {
		log.Println(err.Error())
		return nil, fmt.Errorf("failed to find notifications: %w", err)
	}
	defer cursor.Close(ctx)

	var notifications []models.Notification
	if err = cursor.All(ctx, &notifications); err != nil {
		log.Println(err.Error())
		return nil, fmt.Errorf("failed to decode notifications: %w", err)
	}

	return notifications, nil
}

// ClearAllNotifications removes all notifications from the database.
// It returns an error if the operation fails.
func (n *notificationRepoImpl) ClearAllNotifications() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := n.database.GetNoSql().DeleteMany(ctx, bson.M{})
	return err
}
