package pkg

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"text/template"
)

func DecodeJSON[T any](r *http.Request) (*T, error) {
	form := new(T) // new instance of T
	if err := json.NewDecoder(r.Body).Decode(form); err != nil {
		return nil, IvnalidJson(err)
	}

	return form, nil
}

func ParseHTMLToString(templateName string, data any) (string, error) {
	pwd, err := os.Getwd()
	if err != nil {
		log.Printf("Error getting working directory: %v", err)
		return "", errors.New("failed to get working directory")
	}
	log.Println(pwd)

	templatePath := filepath.Join(pwd, "internal", "infrastructure", "email", "templates", templateName)
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
