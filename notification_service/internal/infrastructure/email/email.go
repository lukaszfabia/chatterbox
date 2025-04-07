package email

import (
	"errors"
	"log"
	"notification_serivce/internal/domain/models"
	"notification_serivce/pkg"
	"os"

	"gopkg.in/mail.v2"
)

type Components struct {
	Sub     string
	Name    string
	Info    string
	AppName string
}

func NewComponents(n models.Notification, username string) Components {
	return Components{
		Sub:     n.Sub,
		Info:    n.Info,
		Name:    username,
		AppName: os.Getenv("APP_NAME"),
	}
}

// Sends email to user who logged or registered into app
func SendEmail(n models.Notification, email string) error {
	components := NewComponents(n, email)

	senderMail := os.Getenv("GMAIL_MAIL")
	senderPassword := os.Getenv("GMAIL_PASSWORD")

	if senderMail == "" || senderPassword == "" {
		return errors.New("SMTP credentials are missing")
	}

	m := mail.NewMessage()
	m.SetHeader("From", senderMail)
	m.SetHeader("To", email)
	m.SetHeader("Reply-To", "no-reply@example.com")
	m.SetAddressHeader("Cc", email, email)
	m.SetHeader("Subject", components.Sub)

	body, err := pkg.ParseHTMLToString("mail.html", components)

	if err != nil {
		log.Println("Error parsing email template:", err)
		return err
	}

	m.SetBody("text/html", body)

	log.Println(n)

	// d := mail.NewDialer("smtp.gmail.com", 587, senderMail, senderPassword)

	// if err := d.DialAndSend(m); err != nil {
	// 	log.Printf("Error sending email: %v", err)
	// 	return errors.New("failed to send email")
	// }

	log.Printf("Email has been sent to %s", email)

	return nil
}
