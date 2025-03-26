package email_test

import (
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/infrastructure/email"
	"os"
	"testing"

	"github.com/joho/godotenv"
)

func TestSendCode(t *testing.T) {

	godotenv.Load("../../../.env")

	gmail := os.Getenv("GMAIL_MAIL")
	if gmail == "" {
		gmail = "ufabia03@gmail.com"
	}

	err := email.SendEmail(models.ExmapleNotification(), "ufabia03@gmail.com")

	if err != nil {
		t.Error(err)
	}
}
