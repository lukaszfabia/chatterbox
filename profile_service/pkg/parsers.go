// Package pkg provides utilities for decoding JSON, handling multipart form data,
// and working with file uploads in HTTP requests.
package pkg

import (
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"path/filepath"

	"github.com/gorilla/schema"
)

var decoder = schema.NewDecoder()

// DecodeJSON is a utility function to decode JSON request bodies into a Go struct.
// It automatically handles the request body and decodes it into the provided struct type.
//
// Params:
//   - r (*http.Request): The incoming HTTP request that contains the JSON body.
//
// Returns:
//   - *T: A pointer to the decoded struct (of type T).
//   - error: An error, if any, during the decoding process.
func DecodeJSON[T any](r *http.Request) (*T, error) {
	form := new(T)
	if err := json.NewDecoder(r.Body).Decode(form); err != nil {
		return nil, IvnalidJson(err)
	}

	return form, nil
}

// DecodeMultipartForm is a utility function to decode multipart form data
// into a Go struct while also extracting file headers for file uploads.
//
// Params:
//   - r (*http.Request): The incoming HTTP request that contains the multipart form data.
//
// Returns:
//   - *T: A pointer to the decoded struct (of type T).
//   - map[string][]*multipart.FileHeader: A map of file fields and their respective file headers.
//   - error: An error, if any, during the form or file parsing process.
func DecodeMultipartForm[T any](r *http.Request) (*T, map[string][]*multipart.FileHeader, error) {
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10 MB limit
		return nil, nil, FailedToParseForm(err)
	}

	form := new(T)

	if err := decoder.Decode(form, r.PostForm); err != nil {
		return nil, nil, IvnalidFormData(err)
	}

	files := r.MultipartForm.File

	return form, files, nil
}

// GetFileFromForm is a utility function to extract the file information (such as file and extension)
// from a multipart file header.
//
// Params:
//   - fileHeader (*multipart.FileHeader): The header information for the uploaded file.
//
// Returns:
//   - FileInfo: A struct containing the file and its extension.
//   - error: An error, if any, during file processing.
func GetFileFromForm(fileHeader *multipart.FileHeader) (FileInfo, error) {
	fileInfo := FileInfo{}

	file, err := fileHeader.Open()
	if err != nil {
		return fileInfo, fmt.Errorf("failed to open file: %w", err)
	}

	extension := filepath.Ext(fileHeader.Filename)
	if extension == "" {
		return fileInfo, fmt.Errorf("file has no extension")
	}

	fileInfo.File = &file
	fileInfo.Extension = extension

	return fileInfo, nil
}
