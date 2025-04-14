package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/messaging"
	"reflect"
)

// UserCreatedHandler handles the UserCreatedEvent by creating a user profile
// and publishing a notification event to notify other services about the newly created user.
type UserCreatedHandler struct {
	aggregate aggregates.ProfileAggregate // The aggregate responsible for creating the profile.
	bus       messaging.EventBus          // The event bus used to publish events to other services.
}

// NewUserCreatedEventHandler initializes a new UserCreatedHandler with the provided ProfileAggregate and EventBus.
// It returns the newly created handler.
func NewUserCreatedEventHandler(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) EventHandler {
	return &UserCreatedHandler{
		aggregate: aggregate,
		bus:       bus,
	}
}

// Handle processes the incoming UserCreatedEvent, creates the user profile based on the event data,
// and then publishes a notification event to inform other services about the newly created user.
// It performs the following steps:
//  1. Unmarshals the incoming event data into a UserCreatedEvent.
//  2. Uses the ProfileAggregate to create the user profile.
//  3. Creates a NotifyCreatedEvent to notify other services about the newly created user.
//  4. Publishes the NotifyCreatedEvent to the event bus to inform other services.
//
// Parameters:
//   - body: The event data (in byte format) to be processed and unmarshalled.
//
// Returns:
//   - An error if any occurred during the process. If no errors occurred, the function returns nil.
func (h *UserCreatedHandler) Handle(body []byte) error {
	var event events.UserCreatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	_, err := h.aggregate.CreateProfile(event)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	n := events.NewNotifyCreatedEvent(event)

	err = h.bus.Publish(reflect.TypeOf(n).Name(), n)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
