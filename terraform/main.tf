# Namespace
resource "kubernetes_namespace" "feedback_system" {
  metadata {
    name = var.namespace
    labels = {
      name        = var.namespace
      environment = var.environment
      managed-by  = "terraform"
    }
  }
}

# ConfigMap
resource "kubernetes_config_map" "feedback_config" {
  metadata {
    name      = "feedback-system-config"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
  }

  data = {
    STUDENT_SERVICE_PORT    = "3001"
    FEEDBACK_SERVICE_PORT   = "3002"
    ADMIN_SERVICE_PORT      = "3003"
    STUDENT_SERVICE_URL     = "http://student-service:3001"
    FEEDBACK_SERVICE_URL    = "http://feedback-service:3002"
    NODE_ENV                = var.environment
  }
}

# Secret
resource "kubernetes_secret" "feedback_secret" {
  metadata {
    name      = "feedback-system-secret"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
  }

  data = {
    MONGO_URI = var.mongo_uri
  }

  type = "Opaque"
}

# Student Service Deployment
resource "kubernetes_deployment" "student_service" {
  metadata {
    name      = "student-service"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app  = "student-service"
      tier = "backend"
    }
  }

  spec {
    replicas = var.student_service_replicas

    selector {
      match_labels = {
        app = "student-service"
      }
    }

    template {
      metadata {
        labels = {
          app  = "student-service"
          tier = "backend"
        }
      }

      spec {
        container {
          name  = "student-service"
          image = "${var.docker_registry}/student-service:latest"
          image_pull_policy = "Always"

          port {
            container_port = 3001
            name          = "http"
          }

          env {
            name = "STUDENT_SERVICE_PORT"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "STUDENT_SERVICE_PORT"
              }
            }
          }

          env {
            name = "NODE_ENV"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "NODE_ENV"
              }
            }
          }

          env {
            name = "MONGO_URI"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.feedback_secret.metadata[0].name
                key  = "MONGO_URI"
              }
            }
          }

          resources {
            requests = {
              memory = "128Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "256Mi"
              cpu    = "200m"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 3001
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = 3001
            }
            initial_delay_seconds = 10
            period_seconds        = 5
            timeout_seconds       = 3
          }
        }
      }
    }
  }
}

# Student Service
resource "kubernetes_service" "student_service" {
  metadata {
    name      = "student-service"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app = "student-service"
    }
  }

  spec {
    selector = {
      app = "student-service"
    }

    port {
      port        = 3001
      target_port = 3001
      protocol    = "TCP"
      name        = "http"
    }

    type = "ClusterIP"
  }
}

# Feedback Service Deployment
resource "kubernetes_deployment" "feedback_service" {
  metadata {
    name      = "feedback-service"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app  = "feedback-service"
      tier = "backend"
    }
  }

  spec {
    replicas = var.feedback_service_replicas

    selector {
      match_labels = {
        app = "feedback-service"
      }
    }

    template {
      metadata {
        labels = {
          app  = "feedback-service"
          tier = "backend"
        }
      }

      spec {
        container {
          name  = "feedback-service"
          image = "${var.docker_registry}/feedback-service:latest"
          image_pull_policy = "Always"

          port {
            container_port = 3002
            name          = "http"
          }

          env {
            name = "FEEDBACK_SERVICE_PORT"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "FEEDBACK_SERVICE_PORT"
              }
            }
          }

          env {
            name = "STUDENT_SERVICE_URL"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "STUDENT_SERVICE_URL"
              }
            }
          }

          env {
            name = "NODE_ENV"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "NODE_ENV"
              }
            }
          }

          env {
            name = "MONGO_URI"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.feedback_secret.metadata[0].name
                key  = "MONGO_URI"
              }
            }
          }

          resources {
            requests = {
              memory = "128Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "256Mi"
              cpu    = "200m"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 3002
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = 3002
            }
            initial_delay_seconds = 10
            period_seconds        = 5
            timeout_seconds       = 3
          }
        }
      }
    }
  }
}

# Feedback Service
resource "kubernetes_service" "feedback_service" {
  metadata {
    name      = "feedback-service"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app = "feedback-service"
    }
  }

  spec {
    selector = {
      app = "feedback-service"
    }

    port {
      port        = 3002
      target_port = 3002
      protocol    = "TCP"
      name        = "http"
    }

    type = "ClusterIP"
  }
}

# Admin Service Deployment
resource "kubernetes_deployment" "admin_service" {
  metadata {
    name      = "admin-service"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app  = "admin-service"
      tier = "backend"
    }
  }

  spec {
    replicas = var.admin_service_replicas

    selector {
      match_labels = {
        app = "admin-service"
      }
    }

    template {
      metadata {
        labels = {
          app  = "admin-service"
          tier = "backend"
        }
      }

      spec {
        container {
          name  = "admin-service"
          image = "${var.docker_registry}/admin-service:latest"
          image_pull_policy = "Always"

          port {
            container_port = 3003
            name          = "http"
          }

          env {
            name = "ADMIN_SERVICE_PORT"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "ADMIN_SERVICE_PORT"
              }
            }
          }

          env {
            name = "STUDENT_SERVICE_URL"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "STUDENT_SERVICE_URL"
              }
            }
          }

          env {
            name = "FEEDBACK_SERVICE_URL"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "FEEDBACK_SERVICE_URL"
              }
            }
          }

          env {
            name = "NODE_ENV"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.feedback_config.metadata[0].name
                key  = "NODE_ENV"
              }
            }
          }

          resources {
            requests = {
              memory = "128Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "256Mi"
              cpu    = "200m"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 3003
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = 3003
            }
            initial_delay_seconds = 10
            period_seconds        = 5
            timeout_seconds       = 3
          }
        }
      }
    }
  }
}

# Admin Service
resource "kubernetes_service" "admin_service" {
  metadata {
    name      = "admin-service"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app = "admin-service"
    }
  }

  spec {
    selector = {
      app = "admin-service"
    }

    port {
      port        = 3003
      target_port = 3003
      protocol    = "TCP"
      name        = "http"
    }

    type = "ClusterIP"
  }
}

# Frontend Deployment
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app  = "frontend"
      tier = "frontend"
    }
  }

  spec {
    replicas = var.frontend_replicas

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app  = "frontend"
          tier = "frontend"
        }
      }

      spec {
        container {
          name  = "frontend"
          image = "${var.docker_registry}/student-feedback-frontend:latest"
          image_pull_policy = "Always"

          port {
            container_port = 80
            name          = "http"
          }

          resources {
            requests = {
              memory = "64Mi"
              cpu    = "50m"
            }
            limits = {
              memory = "128Mi"
              cpu    = "100m"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 30
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 80
            }
            initial_delay_seconds = 10
            period_seconds        = 5
          }
        }
      }
    }
  }
}

# Frontend Service
resource "kubernetes_service" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.feedback_system.metadata[0].name
    labels = {
      app = "frontend"
    }
  }

  spec {
    selector = {
      app = "frontend"
    }

    port {
      port        = 80
      target_port = 80
      protocol    = "TCP"
      name        = "http"
    }

    type = "LoadBalancer"
  }
}