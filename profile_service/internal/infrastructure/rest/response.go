// Package rest provides helper functions to send HTTP responses with proper status codes and JSON encoding.
package rest

import (
	"encoding/json"
	"log"
	"net/http"
)

// NewResponse sends a server response with the specified HTTP status code and data.
// It sets the Content-Type header to "application/json", encodes the provided data
// as a JSON object, and writes it to the response body.
//
// Parameters:
//   - w: the `http.ResponseWriter` to send the response to.
//   - httpCode: the HTTP status code to return (e.g., 200, 201, 400, etc.).
//   - data: the data to encode as JSON and send in the response body. It can be any type.
//
// If there is an error encoding the data to JSON, it logs the error and responds with a 400 Bad Request
// status code (if the original status code was 200 OK).
//
// Example usage:
//
//	NewResponse(w, http.StatusOK, map[string]string{"message": "Success"})
func NewResponse(w http.ResponseWriter, httpCode int, data any) {
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(httpCode)

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		log.Printf("Error encoding response: %v", err)
		if httpCode == http.StatusOK {
			http.Error(w, "Error encoding response", http.StatusBadRequest)
		}
	}
}

// Unauthorized sends an HTTP 401 Unauthorized response with no data in the body.
// It uses the NewResponse function to set the status and send the response.
func Unauthorized(w http.ResponseWriter) {
	NewResponse(w, http.StatusUnauthorized, nil)
}

// Ok sends an HTTP 200 OK response with the provided data in the body.
// It uses the NewResponse function to send the response with status OK.
func Ok(w http.ResponseWriter, data any) {
	NewResponse(w, http.StatusOK, data)
}

// Created sends an HTTP 201 Created response with the provided data in the body.
// It uses the NewResponse function to send the response with status Created.
func Created(w http.ResponseWriter, data any) {
	NewResponse(w, http.StatusCreated, data)
}

// BadRequest sends an HTTP 400 Bad Request response with no data in the body.
// It uses the NewResponse function to send the response with status Bad Request.
func BadRequest(w http.ResponseWriter) {
	NewResponse(w, http.StatusBadRequest, nil)
}
