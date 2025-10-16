#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Student Feedback System - Docker Manager${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1) Build all images"
echo "2) Start all services"
echo "3) Stop all services"
echo "4) View logs"
echo "5) Check service health"
echo "6) Restart all services"
echo "7) Clean up (remove containers and images)"
echo "8) Exit"
echo ""
read -p "Enter your choice: " choice

case $choice in
  1)
    echo -e "${GREEN}Building Docker images...${NC}"
    docker-compose build
    ;;
  2)
    echo -e "${GREEN}Starting all services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Services started! Checking health...${NC}"
    sleep 5
    docker-compose ps
    ;;
  3)
    echo -e "${RED}Stopping all services...${NC}"
    docker-compose down
    ;;
  4)
    echo -e "${BLUE}Viewing logs (Ctrl+C to exit)...${NC}"
    docker-compose logs -f
    ;;
  5)
    echo -e "${GREEN}Checking service health...${NC}"
    echo ""
    echo "Student Service:"
    curl -s http://localhost:3001/health | jq .
    echo ""
    echo "Feedback Service:"
    curl -s http://localhost:3002/health | jq .
    echo ""
    echo "Admin Service:"
    curl -s http://localhost:3003/api/admin/health-check | jq .
    ;;
  6)
    echo -e "${GREEN}Restarting all services...${NC}"
    docker-compose restart
    ;;
  7)
    echo -e "${RED}Cleaning up...${NC}"
    docker-compose down -v
    docker system prune -f
    ;;
  8)
    echo -e "${GREEN}Exiting...${NC}"
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid choice${NC}"
    ;;
esac