output "namespace" {
  description = "Kubernetes namespace"
  value       = kubernetes_namespace.feedback_system.metadata[0].name
}

output "student_service_endpoint" {
  description = "Student service internal endpoint"
  value       = "http://${kubernetes_service.student_service.metadata[0].name}:${kubernetes_service.student_service.spec[0].port[0].port}"
}

output "feedback_service_endpoint" {
  description = "Feedback service internal endpoint"
  value       = "http://${kubernetes_service.feedback_service.metadata[0].name}:${kubernetes_service.feedback_service.spec[0].port[0].port}"
}

output "admin_service_endpoint" {
  description = "Admin service internal endpoint"
  value       = "http://${kubernetes_service.admin_service.metadata[0].name}:${kubernetes_service.admin_service.spec[0].port[0].port}"
}

output "frontend_service_type" {
  description = "Frontend service type"
  value       = kubernetes_service.frontend.spec[0].type
}

output "deployment_summary" {
  description = "Deployment summary"
  value = {
    namespace                      = kubernetes_namespace.feedback_system.metadata[0].name
    student_service_replicas      = var.student_service_replicas
    feedback_service_replicas     = var.feedback_service_replicas
    admin_service_replicas        = var.admin_service_replicas
    frontend_replicas             = var.frontend_replicas
    environment                   = var.environment
  }
}

output "kubectl_commands" {
  description = "Useful kubectl commands"
  value = <<-EOT
    # View all resources
    kubectl get all -n ${kubernetes_namespace.feedback_system.metadata[0].name}
    
    # View pods
    kubectl get pods -n ${kubernetes_namespace.feedback_system.metadata[0].name}
    
    # View services
    kubectl get svc -n ${kubernetes_namespace.feedback_system.metadata[0].name}
    
    # Port forward frontend
    kubectl port-forward -n ${kubernetes_namespace.feedback_system.metadata[0].name} svc/frontend 8080:80
    
    # View logs
    kubectl logs -f deployment/student-service -n ${kubernetes_namespace.feedback_system.metadata[0].name}
  EOT
}