package ws

import (
	"log"
	"net/http"
	"notification_serivce/internal/domain/models"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type WebSocketServer struct {
	clients map[string]*websocket.Conn
	mu      sync.Mutex
}

func NewWebSocketServer() *WebSocketServer {
	return &WebSocketServer{
		clients: make(map[string]*websocket.Conn),
	}
}

func (ws *WebSocketServer) HandleConnection(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "user_id is required", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Failed to upgrade WebSocket:", err)
		return
	}

	ws.mu.Lock()
	ws.clients[userID] = conn
	ws.mu.Unlock()

	defer func() {
		ws.mu.Lock()
		delete(ws.clients, userID)
		ws.mu.Unlock()
		conn.Close()
	}()

	log.Printf("User %s connected to WebSocket", userID)

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Printf("User %s disconnected", userID)
			break
		}
	}
}

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
