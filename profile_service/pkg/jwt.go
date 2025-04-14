// Package pkg provides utilities for working with JWTs (JSON Web Tokens).
// It includes a function to decode a JWT, validate its claims, and extract the user ID.
package pkg

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// Token represents a structure containing an access token and a refresh token.
type Token struct {
	Access  string `json:"access"`
	Refresh string `json:"refresh"`
}

/*
Decodes and validates a JWT token.

Params:
  - tokenStr (string): The token string received in the header.
  - service (database.Service): A service object that can be used to check if the token is blacklisted.

Returns:
  - uuid.UUID: The user ID (sub) decoded from the JWT, or uuid.Nil if an error occurred.
  - error: An error if any occurs during token decoding, such as token expiration or invalid claims.
*/
func DecodeJWT(tokenStr string) (uuid.UUID, error) {
	hmacSampleSecret := []byte(os.Getenv("JWT_SECRET"))

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Printf("Unexpected signing method: %v", token.Header["alg"])
			return nil, UnsupportedAlgorithm(token.Header["alg"])
		}
		return hmacSampleSecret, nil
	})

	if err != nil {
		log.Println("Error parsing token:", err)
		return uuid.Nil, FailedToParseToken(err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		exp, ok := claims["exp"].(float64)
		if !ok || time.Now().Unix() > int64(exp) {
			log.Println("Token expired or invalid")
			return uuid.Nil, InvalidToken(err)
		}

		sub, ok := claims["sub"].(string)
		if !ok {
			log.Println("Invalid token subject")
			return uuid.Nil, InvalidToken(err)
		}

		userID, err := uuid.Parse(sub)
		if err != nil {
			log.Println("Invalid UUID in token")
			return uuid.Nil, InvalidToken(err)
		}

		return userID, nil
	} else {
		log.Println("Invalid token claims")
		return uuid.Nil, InvalidToken(err)
	}
}
