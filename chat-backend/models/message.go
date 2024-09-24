package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	From      string             `json:"from" bson:"from"`
	To        string             `json:"to" bson:"to"`
	Text      string             `json:"text" bson:"text"`
	SentAt time.Time             `json:"sent_at" bson:"sent_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}