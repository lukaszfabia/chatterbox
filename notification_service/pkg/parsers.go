// Package pkg provides utility helpers for JSON decoding and HTML email template parsing.
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

// DecodeJSON decodes a JSON body from an HTTP request into the provided generic type T.
//
// Example:
//
//	type MyStruct struct { Name string }
//	data, err := DecodeJSON[MyStruct](r)
//
// Parameters:
//   - r (*http.Request): HTTP request containing the JSON body.
//
// Returns:
//   - *T: A pointer to the decoded struct.
//   - error: An error if decoding fails.
func DecodeJSON[T any](r *http.Request) (*T, error) {
	form := new(T)
	if err := json.NewDecoder(r.Body).Decode(form); err != nil {
		return nil, IvnalidJson(err)
	}
	return form, nil
}

// ParseHTMLToString parses an HTML template with the provided name and data into a string.
//
// It expects templates to be located under: internal/infrastructure/email/templates
//
// Parameters:
//   - templateName: The name of the template file (e.g., "welcome.html").
//   - data: The data to inject into the template.
//
// Returns:
//   - A rendered string with the injected data.
//   - An error if something goes wrong.
func ParseHTMLToString(templateName string, data any) (string, error) {
	pwd, err := os.Getwd()
	if err != nil {
		log.Printf("Error getting working directory: %v", err)
		return "", errors.New("failed to get working directory")
	}

	templatePath := filepath.Join(pwd, "internal", "infrastructure", "email", "templates", templateName)
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Printf("Error parsing template file %s: %v", templateName, err)
		return "", errors.New("failed to parse email template")
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
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
