package services

import (
	"errors"
	"fmt"
	"log"
	"notification_serivce/internal/domain"
	"notification_serivce/pkg"
	"os"

	"gopkg.in/mail.v2"
)

type Components struct {
	Subject  string
	Username string
	Info     string
}

// Sends email to user who logged or registered into app
func SendEmail(createdUser domain.UserLoggedEvent) error {
	components := Components{
		Subject:  "",
		Info:     "Lorem ipsum",
		Username: createdUser.Username,
	}

	if createdUser.IsNew {
		components.Subject = fmt.Sprintf("Hello %s again!", createdUser.Username)
	} else {
		components.Subject = fmt.Sprintf("Welcome %s!", createdUser.Username)
	}

	senderMail := os.Getenv("GMAIL_MAIL")
	senderPassword := os.Getenv("GMAIL_PASSWORD")

	if senderMail == "" || senderPassword == "" {
		return errors.New("SMTP credentials are missing")
	}

	m := mail.NewMessage()
	m.SetHeader("From", senderMail)
	m.SetHeader("To", createdUser.Email)
	m.SetHeader("Reply-To", "no-reply@example.com")
	m.SetAddressHeader("Cc", createdUser.Email, components.Username)
	m.SetHeader("Subject", components.Subject)

	body, err := pkg.ParseHTMLToString("welcome.html", components)

	if err != nil {
		log.Println("Error parsing email template:", err)
		return err
	}

	m.SetBody("text/html", body)

	d := mail.NewDialer("smtp.gmail.com", 587, senderMail, senderPassword)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Error sending email: %v", err)
		return errors.New("failed to send email")
	}

	return nil
}
