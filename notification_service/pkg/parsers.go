package pkg

import (
	"bytes"
	"errors"
	"log"
	"os"
	"path/filepath"
	"text/template"
)

func ParseHTMLToString(templateName string, data any) (string, error) {
	pwd, err := os.Getwd()
	if err != nil {
		log.Printf("Error getting working directory: %v", err)
		return "", errors.New("failed to get working directory")
	}
	log.Println(pwd)

	templatePath := filepath.Join(pwd, "templates", templateName)
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Printf("Error parsing template file %s: %v", templateName, err)
		return "", errors.New("failed to parse email template")
	}

	var buf bytes.Buffer
	err = tmpl.Execute(&buf, data)
	if err != nil {
		log.Printf("Error executing template %s: %v", templateName, err)
		return "", errors.New("failed to execute email template")
	}

	body := buf.String()
	if body == "" {
		log.Println("Email body is empty")
		return "", errors.New("email body is empty")
	}

	return body, nil
}
