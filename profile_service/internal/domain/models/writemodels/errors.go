package writemodels

import (
	"fmt"
)

func InvalidEmail() error {
	return fmt.Errorf("invalid email")
}

func InvalidUsername() error {
	return fmt.Errorf("invalid username")
}
func InvalidField(field string) error {
	return fmt.Errorf("invalid %s", field)
}
