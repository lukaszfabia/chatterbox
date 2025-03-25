package pkg

import (
	"encoding/json"
	"net/http"

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
