# IMPORTANT: Replace with your actual MongoDB URI
mongo_uri = "mongodb+srv://dbUser:V3Kf2mVSEd74hxlE@student-feedback-db.e3m8zqf.mongodb.net/?retryWrites=true&w=majority&appName=student-feedback-db"

# Replace with your Docker Hub username
docker_registry = "kartikdumadiya"

# Environment
environment = "production"

# Namespace
namespace = "student-feedback"

# Replicas (adjust based on your needs)
student_service_replicas  = 2
feedback_service_replicas = 2
admin_service_replicas    = 2
frontend_replicas         = 2

# Ingress
enable_ingress = true
ingress_host   = "student-feedback.local"