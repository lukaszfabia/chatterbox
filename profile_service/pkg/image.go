// Package pkg provides utilities for handling file uploads and saving images in the application.
// It includes functionality for saving images, managing file paths, and handling different file types like avatars and backgrounds.
package pkg

import (
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"strings"

	"github.com/google/uuid"
)

var (
	// Base path for saving files on the local system
	base = "./media"
	// Host path for accessing the files via API
	host = "/api/v1/profile/media"
)

// Background represents a background image type.
type Background struct{}

// Avatar represents an avatar image type.
type Avatar struct{}

// Saveable is an interface for objects that have a method to return their file path.
type Saveable interface {
	// GetPath generates a file path for the given file with a specified base directory, file name, and extension.
	// The path is used for saving or retrieving the file.
	GetPath(base string, fileName string, ext string) string
}

// GetPath generates a file path for background images.
func (e *Background) GetPath(base string, fileName string, ext string) string {
	return fmt.Sprintf("%s/backgrounds/%s%s", base, fileName, ext)
}

// GetPath generates a file path for avatar images.
func (a *Avatar) GetPath(base string, fileName string, ext string) string {
	return fmt.Sprintf("%s/avatars/%s%s", base, fileName, ext)
}

// FileInfo contains the details of an uploaded file, including the file, its extension, and its old path.
type FileInfo struct {
	File      *multipart.File
	Extension string
	OldPath   *string
}

// SaveImage saves an image file to the server's local file system and returns its URL.
// It supports different image types (e.g., avatar or background) based on the generic type parameter T.
//
// Parameters:
//   - fileHeader: The header information of the uploaded file.
//   - oldpath: The previous file path (if replacing an existing file).
//
// Returns:
//   - A string URL of the saved image, or an empty string in case of an error.
//   - An error if any occurs during the image saving process.
func SaveImage[T Saveable](fileHeader *multipart.FileHeader, oldpath *string) (url string, err error) {

	fileinfo, err := GetFileFromForm(fileHeader)
	fileinfo.OldPath = oldpath

	if err != nil {
		log.Println(err.Error())
		return "", err
	}

	if fileinfo.File == nil {
		log.Println("No file provided")
		return "", nil
	}

	var item T
	uuid := uuid.New()

	if fileinfo.OldPath != nil {
		lst := strings.Split(*fileinfo.OldPath, "/")
		filename := lst[len(lst)-1] // file.ext
		toremove := item.GetPath(base, filename, "")
		if err := os.Remove(toremove); err != nil {
			log.Println(err)
		}
	}

	var path string = item.GetPath(base, uuid.String(), fileinfo.Extension)

	outFile, err := os.Create(path)
	if err != nil {
		log.Printf("Error creating file at path %s: %v\n", path, err)
		return "", err
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, *fileinfo.File)
	if err != nil {
		log.Println("Error copying file content:", err)
		return "", err
	}

	return item.GetPath(host, uuid.String(), fileinfo.Extension), nil
}
