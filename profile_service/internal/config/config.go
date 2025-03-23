package config

import (
	"profile_service/internal/domain"
	"reflect"

	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Events []domain.Event = []domain.Event{
	&domain.UserCreatedEvent{},
}

func GetGormConfig() *gorm.Config {
	return &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}
}

func RegisteredEvents() map[string]domain.Event {
	var events = map[string]domain.Event{}

	events[reflect.TypeOf(domain.UserCreatedEvent{}).Elem().Name()] = domain.UserCreatedEvent{}

	return events
}
