package main

import (
	"log"
	"net/http"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"os"

	"chat-backend/routes"
)

func main() {
	r := mux.NewRouter()
	PORT := os.Getenv("PORT")

	if PORT == "" {
		PORT = "5000"
	}

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	})
	r.HandleFunc("/signup", routes.Signup ).Methods("POST")
	r.HandleFunc("/login", routes.Login ).Methods("POST")
	r.HandleFunc("/users", routes.Users ).Methods("GET")

	r.HandleFunc("/ws", routes.HandleConnections)
	r.HandleFunc("/chat-history", routes.GetChatHistory).Methods("GET")
	go routes.HandleMessages()


	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	})

	handler := c.Handler(r)

	fmt.Printf("Server running on port %s\n", PORT)
	log.Fatal(http.ListenAndServe(":"+PORT , handler))

}