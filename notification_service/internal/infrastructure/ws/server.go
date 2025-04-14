// Package ws implements a simple WebSocket server for real-time notifications.
package ws

import (
	"log"
	"net/http"
	"notification_serivce/internal/domain/models"
	"notification_serivce/pkg"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

// upgrader configures the WebSocket upgrader with permissive origin checks.
// In production, you should restrict allowed origins.
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// WebSocketServer maintains WebSocket client connections and enables sending notifications.
type WebSocketServer struct {
	clients map[string]*websocket.Conn // Maps user IDs to their WebSocket connections.
	mu      sync.Mutex                 // Synchronizes access to the clients map.
}

// NewWebSocketServer initializes and returns a new WebSocketServer.
func NewWebSocketServer() *WebSocketServer {
	return &WebSocketServer{
		clients: make(map[string]*websocket.Conn),
	}
}

// HandleConnection handles incoming WebSocket connection requests.
// It authenticates the user via JWT (passed as query param or Authorization header),
// upgrades the connection, and listens for incoming messages (heartbeats).
func (ws *WebSocketServer) HandleConnection(w http.ResponseWriter, r *http.Request) {
	tokenParam := r.URL.Query().Get("token")
	authHeader := r.Header.Get("Authorization")

	var token string
	if tokenParam != "" {
		token = tokenParam
	} else if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	} else {
		http.Error(w, "Authorization token required", http.StatusUnauthorized)
		return
	}

	id, err := pkg.DecodeJWT(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade WebSocket:", err)
		return
	}

	ws.mu.Lock()
	ws.clients[id] = conn
	ws.mu.Unlock()

	defer func() {
		ws.mu.Lock()
		delete(ws.clients, id)
		ws.mu.Unlock()
		conn.Close()
	}()

	log.Printf("User %s connected to WebSocket", id)

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("User %s disconnected", id)
			break
		}
	}
}

// SendNotification sends a notification to a connected user via WebSocket.
// If the user is not connected, it returns a signal to handle it later.
func (ws *WebSocketServer) SendNotification(n models.Notification) error {
	ws.mu.Lock()
	conn, exists := ws.clients[n.UserID]
	ws.mu.Unlock()

	if !exists {
		return SendLater()
	}

	err := conn.WriteJSON(n)
	if err != nil {
		log.Printf("Failed to send WebSocket message: %v", err)
		return SendLater()
	}

	return nil
}
