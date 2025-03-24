package config

import (
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func GetGormConfig() *gorm.Config {
	return &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}
}
