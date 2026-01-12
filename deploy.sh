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

# Check if .env.production exists or create it from .env
if [ ! -f .env.production ]; then
    if [ -f .env ]; then
        echo -e "${YELLOW}⚠️  .env.production not found, copying from .env...${NC}"
        cp .env .env.production
    else
        echo -e "${RED}❌ Error: No .env or .env.production file found${NC}"
        echo "Please create a .env file first"
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
fi

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
    git pull
fi

# Stop and remove old containers
echo -e "${YELLOW}🛑 Stopping old containers...${NC}"
docker compose -f docker-compose.prod.yml down

# Build the application
echo -e "${YELLOW}🏗️  Building application...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Wait for health check
echo -e "${YELLOW}⏳ Waiting for health check...${NC}"
sleep 10

# Check if containers are running
if docker ps | grep -q inoxlink-app && docker ps | grep -q inoxlink-caddy; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Site available at: https://inoxlink.com.br${NC}"

    # Show container status
    echo -e "\n${YELLOW}📊 Container Status:${NC}"
    docker compose -f docker-compose.prod.yml ps

    # Show logs command
    echo -e "\n${YELLOW}📝 To view logs:${NC}"
    echo "docker compose -f docker-compose.prod.yml logs -f"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Check logs with: docker compose -f docker-compose.prod.yml logs"
    exit 1
fi
