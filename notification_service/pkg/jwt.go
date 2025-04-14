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

// DecodeJWT decodes and validates a JWT token string using HMAC signing.
// It returns the subject (user UUID) if the token is valid.
//
// Parameters:
//   - tokenStr: The JWT token string.
//
// Returns:
//   - string: UUID string of the user (from "sub" claim).
//   - error: An error if the token is invalid or expired.
func DecodeJWT(tokenStr string) (string, error) {
	hmacSampleSecret := []byte(os.Getenv("JWT_SECRET"))

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, UnsupportedAlgorithm(token.Header["alg"])
		}
		return hmacSampleSecret, nil
	})
	if err != nil {
		log.Printf("Failed to parse JWT token: %v\n", err)
		return "", FailedToParseToken(err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		log.Printf("Invalid JWT claims or token is not valid\n")
		return "", InvalidToken(err)
	}

	exp, ok := claims["exp"].(float64)
	if !ok || time.Now().Unix() > int64(exp) {
		log.Printf("Token expired: exp=%v\n", claims["exp"])
		return "", InvalidToken(err)
	}

	sub, ok := claims["sub"].(string)
	if !ok {
		log.Printf("Missing subject in token\n")
		return "", InvalidToken(err)
	}

	userID, err := uuid.Parse(sub)
	if err != nil {
		log.Printf("Invalid UUID format in token subject: %v\n", err)
		return "", InvalidToken(err)
	}

	return userID.String(), nil
}
