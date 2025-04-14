// provides WebSocket-based notification services.
package ws

import (
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/infrastructure/notifier"
)

// WebSocketNotifier represents a notifier that sends notifications over WebSocket.
type WebSocketNotifier struct {
	server *WebSocketServer // The WebSocket server that handles sending notifications.
}

// NewWebSocketNotifier creates a new instance of WebSocketNotifier.
// It takes a WebSocketServer as input and returns a pointer to a WebSocketNotifier.
func NewWebSocketNotifier(server *WebSocketServer) notifier.Notifier {
	return &WebSocketNotifier{
		server: server,
	}
}

// NotifyUser sends a notification to a user via WebSocket.
// It takes a notification object and an optional email address, but the email is not currently used in this implementation.
// It returns an error if sending the notification fails.
func (w *WebSocketNotifier) NotifyUser(notification models.Notification, email *string) error {
	// Sends the notification via the WebSocket server
	return w.server.SendNotification(notification)
}
