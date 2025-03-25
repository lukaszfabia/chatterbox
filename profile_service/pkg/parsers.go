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

func DecodeJSON[T any](r *http.Request) (*T, error) {
	form := new(T) // new instance of T
	if err := json.NewDecoder(r.Body).Decode(form); err != nil {
		return nil, IvnalidJson(err)
	}

	return form, nil
}

func DecodeMultipartForm[T any](r *http.Request) (*T, error) {
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10 MB limit
		return nil, FailedToParseForm(err)
	}

	form := new(T)

	// map values
	if err := decoder.Decode(form, r.PostForm); err != nil {
		return nil, IvnalidFormData(err)
	}

	return form, nil
}

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
