package routes

import (
	"chat-backend/models"
	"encoding/json"
	"net/http"
	"time"
	"context"
	"log"
	"chat-backend/database"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}
	return string(bytes)
}

var UserCollection *mongo.Collection = database.OpenCollection(database.Client, "user")

func Signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if user.Username == "" || user.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = UserCollection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&user)

	if err == nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("User Already Exists"))
		return
	}

	user.Password = HashPassword(user.Password)
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.ID = primitive.NewObjectID()
	_, err = UserCollection.InsertOne(context.TODO(), user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusCreated)
}