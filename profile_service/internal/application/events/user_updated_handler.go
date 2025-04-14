package events

import (
	"encoding/json"
	"log"
	aggregates "profile_service/internal/domain/aggretates"
	"profile_service/internal/domain/events"
	"profile_service/internal/infrastructure/messaging"
	"reflect"
)

// UserUpdatedHandler handles the UserUpdatedEvent and updates the user profile.
// After updating the profile, it publishes an event to notify other services, such as the chat service.
type UserUpdatedHandler struct {
	aggregate aggregates.ProfileAggregate // The aggregate that handles profile updates.
	bus       messaging.EventBus          // The event bus used to publish events to other services.
}

// NewUserUpdatedEventHandler initializes a new UserUpdatedHandler with the provided ProfileAggregate and EventBus.
// It returns the newly created handler.
func NewUserUpdatedEventHandler(aggregate aggregates.ProfileAggregate, bus messaging.EventBus) EventHandler {
	return &UserUpdatedHandler{
		aggregate: aggregate,
		bus:       bus,
	}
}

// Handle processes the incoming UserUpdatedEvent, updates the user profile based on the event,
// and then publishes a MemberUpdatedInfoEvent to notify other services about the updated information.
// It performs the following steps:
//  1. Unmarshals the incoming event data into a UserUpdatedEvent.
//  2. Uses the ProfileAggregate to update the user's profile with the new information.
//  3. Creates a MemberUpdatedInfoEvent with the updated profile information.
//  4. Publishes the MemberUpdatedInfoEvent to the event bus to notify other services (e.g., the chat service).
//
// Parameters:
//   - body: The event data (in byte format) to be processed and unmarshalled.
//
// Returns:
//   - An error if any occurred during the process. If no errors occurred, the function returns nil.
func (h *UserUpdatedHandler) Handle(body []byte) error {
	var event events.UserUpdatedEvent
	if err := json.Unmarshal(body, &event); err != nil {
		return err
	}

	profile, err := h.aggregate.UpdateProfileAuthInfo(event)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	var e events.MemberUpdatedInfoEvent = events.NewMemberUpdatedInfoEvent(profile.ID, &profile.Username, profile.AvatarURL)

	err = h.bus.Publish(reflect.TypeOf(e).Name(), e)

	return err
}
