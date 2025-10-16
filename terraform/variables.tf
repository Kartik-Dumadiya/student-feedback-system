variable "namespace" {
  description = "Kubernetes namespace for the application"
  type        = string
  default     = "student-feedback"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "student-feedback-system"
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "mongo_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
}

variable "docker_registry" {
  description = "Docker registry username"
  type        = string
  default     = "kartikdumadiya"
}

variable "student_service_replicas" {
  description = "Number of replicas for student service"
  type        = number
  default     = 2
}

variable "feedback_service_replicas" {
  description = "Number of replicas for feedback service"
  type        = number
  default     = 2
}

variable "admin_service_replicas" {
  description = "Number of replicas for admin service"
  type        = number
  default     = 2
}

variable "frontend_replicas" {
  description = "Number of replicas for frontend"
  type        = number
  default     = 2
}

variable "enable_ingress" {
  description = "Enable ingress controller"
  type        = bool
  default     = true
}

variable "ingress_host" {
  description = "Ingress hostname"
  type        = string
  default     = "student-feedback.local"
}