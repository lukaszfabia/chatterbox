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
	base = "./media"
	host = "/api/v1/media"
)

type Background struct{}
type Avatar struct{}

type Saveable interface {
	GetPath(base string, fileName string, ext string) string
}

func (e *Background) GetPath(base string, fileName string, ext string) string {
	return fmt.Sprintf("%s/backgrounds/%s%s", base, fileName, ext)
}

func (a *Avatar) GetPath(base string, fileName string, ext string) string {
	return fmt.Sprintf("%s/avatars/%s%s", base, fileName, ext)
}

type FileInfo struct {
	File      *multipart.File
	Extension string
	OldPath   *string
}

// Saves image and returns new URL
func SaveImage[T Saveable](fileHeader *multipart.FileHeader, oldpath string) (url string, err error) {

	fileinfo, err := GetFileFromForm(fileHeader)
	fileinfo.OldPath = &oldpath

	if err != nil {
		return "", err
	}

	if fileinfo.File == nil {
		return "", nil
	}

	var item T

	uuid := uuid.New()

	// remove old file
	if fileinfo.OldPath != nil {
		// translate path on local path
		lst := strings.Split(*fileinfo.OldPath, "/")
		filename := lst[len(lst)-1] // file.ext
		toremove := item.GetPath(base, filename, "")
		if err := os.Remove(toremove); err != nil {
			// if there was an error it means that image comes from provider
			log.Println(err)
		}
	}

	var path string = item.GetPath(base, uuid.String(), fileinfo.Extension)

	// create new one
	outFile, err := os.Create(path)
	if err != nil {
		log.Printf("Error during creating new path: %s\n", err)
		return "", err
	}
	defer outFile.Close()

	_, err = io.Copy(outFile, *fileinfo.File)
	if err != nil {
		log.Println(err)
		return "", err
	}

	return item.GetPath(host, uuid.String(), fileinfo.Extension), nil
}
