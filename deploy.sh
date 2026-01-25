#!/bin/bash

# Inox Link - Production Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Inox Link deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: No .env file found${NC}"
    echo "Please create a .env file first"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo -e "${YELLOW}📥 Pulling latest changes from git...${NC}"
    git pull origin main
fi

# Stop and remove old containers
echo -e "${YELLOW}🛑 Stopping old containers...${NC}"
docker compose down

# Build the application
echo -e "${YELLOW}🏗️  Building application...${NC}"
docker compose build --no-cache

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker compose up -d

# Wait for health check
echo -e "${YELLOW}⏳ Waiting for health check...${NC}"
sleep 10

# Check if containers are running
if docker ps | grep -q inoxlink-app && docker ps | grep -q inoxlink-caddy; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Site available at: https://inoxlink.com.br${NC}"

    # Show container status
    echo -e "\n${YELLOW}📊 Container Status:${NC}"
    docker compose ps

    # Show logs command
    echo -e "\n${YELLOW}📝 To view logs:${NC}"
    echo "docker compose logs -f"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Check logs with: docker compose logs"
    exit 1
fi
