// package commands provides the command service layer for handling business logic related to notifications.
// It defines the NotificationCommandService interface and an implementation for handling commands related to notifications.
package commands

import (
	aggregates "notification_serivce/internal/domain/aggretates"
)

// NotificationCommandService defines the interface for a command service that handles actions or commands
// related to notifications. The service interacts with aggregates to perform business operations.
type NotificationCommandService interface {
	// Future methods can be added to handle specific notification-related commands,
	// such as creating, updating, or deleting notifications, depending on the application's requirements.
}

// notificationCommandServiceImpl is the concrete implementation of NotificationCommandService.
// It contains an instance of the NotificationAggregate which is used to execute the commands related to notifications.
type notificationCommandServiceImpl struct {
	aggregate aggregates.NotificationAggregate
}

// NewNotificationCommandService is a constructor function that creates and returns a new instance of
// notificationCommandServiceImpl. It initializes the command service with the provided NotificationAggregate.
//
// Parameters:
//   - aggregate: An instance of NotificationAggregate that is responsible for executing the business logic.
//
// Returns:
//   - A new instance of NotificationCommandService implementation.
func NewNotificationCommandService(aggregate aggregates.NotificationAggregate) NotificationCommandService {
	return &notificationCommandServiceImpl{aggregate: aggregate}
}
