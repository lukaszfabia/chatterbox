package pkg

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Token struct {
	Access  string `json:"access"`
	Refresh string `json:"refresh"`
}

/*
Decodes token

Params:

  - tokenStr string: token received in header
  - serivce database.Service: checks is token blacklisted

Returns:

  - id uuid.UUID: decoded sub
  - error occured during executing
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
		log.Println(err)
		return uuid.Nil, FailedToParse(err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		exp, ok := claims["exp"].(float64)
		if !ok || time.Now().Unix() > int64(exp) {
			msg := "Token expired or invalid"
			log.Println(msg)
			return uuid.Nil, InvalidToken(err)
		}

		sub, ok := claims["sub"].(string)
		if !ok {
			msg := "Invalid token subject"
			log.Println(msg)
			return uuid.Nil, InvalidToken(err)
		}

		userID, err := uuid.Parse(sub)
		if err != nil {
			msg := "Invalid UUID in token"
			log.Println(msg)
			return uuid.Nil, InvalidToken(err)
		}

		return userID, nil
	} else {
		msg := "Invalid token claims"
		log.Println(msg)
		return uuid.Nil, InvalidToken(err)
	}
}
