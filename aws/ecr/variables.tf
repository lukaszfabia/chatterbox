variable "region" {
  description = "AWS region to create resources in"
  type  = string
  default = "ap-southeast-2"
}

variable "repository_list" {
  description = "List of repository names"
  type = list
  default = ["auth_service", "profile_service", "chat_service", "notification_service", "status_service"]
}