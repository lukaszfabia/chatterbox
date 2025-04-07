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
