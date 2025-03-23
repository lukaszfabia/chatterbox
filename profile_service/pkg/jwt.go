package pkg

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
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

  - id uint: decoded sub
  - error occured during executing
*/
func DecodeJWT(tokenStr string) (uint, error) {

	hmacSampleSecret := []byte(os.Getenv("JWT_SECRET"))

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Printf("Unexpected signing method: %v", token.Header["alg"])
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return hmacSampleSecret, nil
	})

	if err != nil {
		msg := "Error during parsing the token"
		log.Println(err)
		return 0, errors.New(strings.ToLower(msg))
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		exp, ok := claims["exp"].(float64)
		if !ok || time.Now().Unix() > int64(exp) {
			msg := "Token expired or invalid"
			log.Println(msg)
			return 0, errors.New(strings.ToLower(msg))
		}

		sub, ok := claims["sub"].(float64)
		if !ok {
			msg := "Invalid token subject"
			log.Println(msg)
			return 0, errors.New(strings.ToLower(msg))
		} else {
			return uint(sub), nil
		}

	} else {
		msg := "Invalid token claims"
		log.Println(msg)
		return 0, errors.New(strings.ToLower(msg))
	}
}
