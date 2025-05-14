variable "aws_region" {
  default = "us-east-1"
}

variable "db_user" {
  description = "Database username for both Postgres and MongoDB"
  type        = string
  default     = "lukasz"
}

variable "db_password" {
  description = "Database password for both Postgres and MongoDB"
  type        = string
  default     = "lukasz"
}

variable "db_name_postgres" {
  description = "SQL database name"
  type        = string
  default     = "auth_data"
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "vpc_id" {
  type = string
}
