package routes

import (
	"chat-backend/models"
	"chat-backend/database"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// WebSocket clients and broadcast channel
var clients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan models.Message)    // broadcast channel

// MongoDB collection for messages
var messageCollection *mongo.Collection = database.OpenCollection(database.Client, "message")

// Handle WebSocket connections
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin (modify for production)
	},
}

// WebSocket endpoint to handle new connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading to WebSocket:", err)
		return
	}
	defer ws.Close()

	// Register new client
	clients[ws] = true

	for {
		var msg models.Message
		// Read message from WebSocket
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading WebSocket message:", err)
			delete(clients, ws)
			break
		}
		// Send the message to the broadcast channel
		broadcast <- msg
	}
}

// Broadcast messages to all connected clients
func HandleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast

		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error broadcasting WebSocket message:", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

// Store a message in the MongoDB database
func storeMessageInDB(msg models.Message) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := messageCollection.InsertOne(ctx, bson.M{
		"from":    msg.From,
		"to":      msg.To,
		"Text":    msg.Text,
		"sentAt":  time.Now(),
	})

	if err != nil {
		fmt.Println("Error inserting message into database:", err)
	}
}

// Retrieve messages between two users
func GetChatHistory(w http.ResponseWriter, r *http.Request) {
	from := r.URL.Query().Get("from")
	to := r.URL.Query().Get("to")

	filter := bson.M{
		"$or": []bson.M{
			{"from": from, "to": to},
			{"from": to, "to": from},
		},
	}

	// Find all messages matching the filter
	cursor, err := messageCollection.Find(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Error fetching chat history", http.StatusInternalServerError)
		return
	}

	var messages []models.Message
	if err = cursor.All(context.TODO(), &messages); err != nil {
		http.Error(w, "Error parsing chat history", http.StatusInternalServerError)
		return
	}

	// Send chat history as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}
