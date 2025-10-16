# 🚀 CI/CD Pipeline Documentation

## Overview

This repository uses GitHub Actions for automated CI/CD pipeline implementing DevSecOps best practices.

## Workflows

### 1. **CI/CD Pipeline** (`ci-cd.yml`)
**Trigger:** Push to `main`/`master`, Pull Requests

**Jobs:**
- ✅ Build & Test Backend Services
- ✅ Build & Test Frontend
- 🔒 Security Scanning (Trivy)
- 🐳 Build & Push Docker Images
- 📢 Deployment Notification

### 2. **Security Scan** (`security-scan.yml`)
**Trigger:** Daily at 2 AM UTC, Manual

**Purpose:** Regular security vulnerability scanning

### 3. **Pull Request Check** (`pr-check.yml`)
**Trigger:** Pull Request opened/updated

**Purpose:** Quality checks before merging

### 4. **Manual Deployment** (`manual-deploy.yml`)
**Trigger:** Manual workflow dispatch

**Purpose:** Deploy specific services to specific environments

## GitHub Secrets Required

| Secret Name | Description |
|-------------|-------------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password/token |
| `MONGO_URI` | MongoDB connection string |

## Usage

### Automatic Deployment
1. Push code to `main` or `master` branch
2. Pipeline automatically builds, tests, scans, and pushes Docker images
3. Manual kubectl command to update K8s deployment

### Manual Deployment
1. Go to Actions → Manual Deployment
2. Click "Run workflow"
3. Select environment and service
4. Click "Run workflow" button

### Update Kubernetes After CI/CD
```bash
# Restart all deployments to pull latest images
kubectl rollout restart deployment/student-service -n student-feedback
kubectl rollout restart deployment/feedback-service -n student-feedback
kubectl rollout restart deployment/admin-service -n student-feedback
kubectl rollout restart deployment/frontend -n student-feedback

# Check rollout status
kubectl rollout status deployment/student-service -n student-feedback
```

## Pipeline Stages

```
┌─────────────────┐
│  Code Push      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build & Test   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Security Scan   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Docker Build    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Push to Hub     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy Ready    │
└─────────────────┘
```

## DevSecOps Features

✅ Automated testing
✅ Code quality checks
✅ Vulnerability scanning (Trivy)
✅ Docker image scanning
✅ SARIF security reports
✅ Artifact retention
✅ Multi-stage builds
✅ Caching optimization

## Badges

Add these to your main README.md:

```markdown
![CI/CD Pipeline](https://github.com/Kartik-Dumadiya/student-feedback-system/actions/workflows/ci-cd.yml/badge.svg)
![Security Scan](https://github.com/Kartik-Dumadiya/student-feedback-system/actions/workflows/security-scan.yml/badge.svg)
```