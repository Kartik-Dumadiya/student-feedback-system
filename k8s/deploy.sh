#!/bin/bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Student Feedback System - K8s Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl not found. Please install kubectl first.${NC}"
    exit 1
fi

# Check cluster connectivity
echo -e "${BLUE}🔍 Checking cluster connectivity...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster.${NC}"
    echo "Please ensure your cluster is running:"
    echo "  - Minikube: minikube start"
    echo "  - Docker Desktop: Enable Kubernetes in settings"
    exit 1
fi

echo -e "${GREEN}✅ Cluster is accessible${NC}"
echo ""

# Step 1: Create Namespace
echo -e "${BLUE}📦 Creating namespace...${NC}"
kubectl apply -f namespace.yaml --validate=false

# Step 2: Create ConfigMap
echo -e "${BLUE}⚙️  Creating ConfigMap...${NC}"
kubectl apply -f configmap.yaml --validate=false

# Step 3: Create Secret
echo -e "${BLUE}🔐 Creating Secret...${NC}"
kubectl apply -f secret.yaml --validate=false

# Step 4: Deploy Backend Services
echo -e "${BLUE}🐳 Deploying Student Service...${NC}"
kubectl apply -f student-deployment.yaml --validate=false

echo -e "${BLUE}🐳 Deploying Feedback Service...${NC}"
kubectl apply -f feedback-deployment.yaml --validate=false

echo -e "${BLUE}🐳 Deploying Admin Service...${NC}"
kubectl apply -f admin-deployment.yaml --validate=false

# Step 5: Deploy Frontend
echo -e "${BLUE}🌐 Deploying Frontend...${NC}"
kubectl apply -f frontend-deployment.yaml --validate=false

# Step 6: Create Ingress (optional for now)
echo -e "${BLUE}🌍 Creating Ingress...${NC}"
kubectl apply -f ingress.yaml --validate=false 2>/dev/null || echo "Ingress creation skipped (requires ingress controller)"

# Wait for deployments
echo ""
echo -e "${YELLOW}⏳ Waiting for deployments to be ready (this may take a few minutes)...${NC}"

# Wait with timeout
kubectl wait --for=condition=available --timeout=300s \
  deployment/student-service \
  deployment/feedback-service \
  deployment/admin-service \
  deployment/frontend \
  -n student-feedback 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Some deployments are taking longer than expected${NC}"
    echo "Checking current status..."
}

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Checking deployment status..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
kubectl get all -n student-feedback

echo ""
echo -e "${GREEN}🎉 Deployment script completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Check pod status: kubectl get pods -n student-feedback"
echo "2. View logs: kubectl logs -f deployment/student-service -n student-feedback"
echo "3. Access services: kubectl port-forward -n student-feedback svc/frontend 8080:80"