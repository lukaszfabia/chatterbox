package email

import (
	"errors"
	"fmt"
	"log"
	"notification_serivce/internal/domain/models"
	"notification_serivce/internal/infrastructure/notifier"
	"notification_serivce/pkg"
	"os"

	"gopkg.in/mail.v2"
)

// EmailNotifier implements the Notifier interface and is used to send email notifications.
type EmailNotifier struct {
}

// NewEmailNotifier creates a new instance of EmailNotifier.
func NewEmailNotifier() notifier.Notifier {
	return &EmailNotifier{}
}

// Components holds the necessary components for the email template.
type Components struct {
	Sub     string // Subject of the email
	Name    string // Name of the user to whom the email is being sent
	Info    string // Information or details in the email content
	AppName string // Application name (fetched from environment variables)
}

// NewComponents initializes and returns a Components struct based on the notification and username.
func NewComponents(n models.Notification, username string) Components {
	return Components{
		Sub:     n.Sub,
		Info:    n.Info,
		Name:    username,
		AppName: os.Getenv("APP_NAME"),
	}
}

// NotifyUser sends an email notification to the user who has logged in or registered into the app.
// It takes the notification data and the user's email as input.
//
// Parameters:
// - notification: The notification model containing subject, info, etc.
// - email: The user's email address where the notification should be sent.
//
// Returns:
// - error: Returns an error if the email could not be sent, otherwise nil.
func (e *EmailNotifier) NotifyUser(notification models.Notification, email *string) error {
	if email == nil {
		return fmt.Errorf("no email provided, skipping sending email")
	}

	components := NewComponents(notification, *email)

	senderMail := os.Getenv("GMAIL_MAIL")
	senderPassword := os.Getenv("GMAIL_PASSWORD")

	if senderMail == "" || senderPassword == "" {
		return errors.New("SMTP credentials are missing")
	}

	m := mail.NewMessage()
	m.SetHeader("From", senderMail)
	m.SetHeader("To", *email)
	m.SetHeader("Reply-To", "no-reply@example.com")
	m.SetAddressHeader("Cc", *email, *email)
	m.SetHeader("Subject", components.Sub)

	body, err := pkg.ParseHTMLToString("mail.html", components)
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

	log.Printf("Email has been sent to %s\n", *email)

	return nil
}
