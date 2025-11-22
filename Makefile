.PHONY: help install dev dev-backend dev-storefront build build-backend build-storefront kill-ports clean seed

# Colors for output
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Directories
BACKEND_DIR=backend
STOREFRONT_DIR=storefront

# Ports
BACKEND_PORT=9000
STOREFRONT_PORT=8000

help: ## Show this help message
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies for both projects
	@echo "$(GREEN)Installing backend dependencies...$(NC)"
	cd $(BACKEND_DIR) && yarn install
	@echo "$(GREEN)Installing storefront dependencies...$(NC)"
	cd $(STOREFRONT_DIR) && yarn install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

kill-ports: ## Kill processes running on ports 8000 and 9000
	@echo "$(YELLOW)Killing processes on port $(BACKEND_PORT)...$(NC)"
	@lsof -ti:$(BACKEND_PORT) | xargs kill -9 2>/dev/null || true
	@pkill -9 -f "medusa.*develop" 2>/dev/null || true
	@pkill -9 -f "medusa.*start" 2>/dev/null || true
	@echo "$(YELLOW)Killing processes on port $(STOREFRONT_PORT)...$(NC)"
	@lsof -ti:$(STOREFRONT_PORT) | xargs kill -9 2>/dev/null || true
	@pkill -9 -f "next.*dev.*8000" 2>/dev/null || true
	@sleep 2
	@echo "$(GREEN)✓ Ports cleared$(NC)"

dev: kill-ports ## Start both backend and storefront in development mode
	@echo "$(GREEN)Starting backend and storefront...$(NC)"
	@echo "$(YELLOW)Backend:$(NC) http://localhost:$(BACKEND_PORT)"
	@echo "$(YELLOW)Storefront:$(NC) http://localhost:$(STOREFRONT_PORT)"
	@trap 'kill 0' INT; \
	cd $(BACKEND_DIR) && yarn dev & \
	cd $(STOREFRONT_DIR) && yarn dev & \
	wait

dev-backend: ## Start only the Medusa backend
	@$(MAKE) kill-ports
	@echo "$(GREEN)Starting backend on http://localhost:$(BACKEND_PORT)...$(NC)"
	cd $(BACKEND_DIR) && yarn dev

dev-storefront: ## Start only the Next.js storefront
	@$(MAKE) kill-ports
	@echo "$(GREEN)Starting storefront on http://localhost:$(STOREFRONT_PORT)...$(NC)"
	cd $(STOREFRONT_DIR) && yarn dev

build: build-backend build-storefront ## Build both projects

build-backend: ## Build the Medusa backend
	@echo "$(GREEN)Building backend...$(NC)"
	cd $(BACKEND_DIR) && yarn build
	@echo "$(GREEN)✓ Backend built$(NC)"

build-storefront: ## Build the Next.js storefront
	@echo "$(GREEN)Building storefront...$(NC)"
	cd $(STOREFRONT_DIR) && yarn build
	@echo "$(GREEN)✓ Storefront built$(NC)"

seed: ## Seed the Medusa backend with sample data
	@echo "$(GREEN)Seeding backend database...$(NC)"
	cd $(BACKEND_DIR) && yarn seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

clean: ## Clean node_modules and build artifacts
	@echo "$(RED)Cleaning backend...$(NC)"
	rm -rf $(BACKEND_DIR)/node_modules $(BACKEND_DIR)/.medusa $(BACKEND_DIR)/dist
	@echo "$(RED)Cleaning storefront...$(NC)"
	rm -rf $(STOREFRONT_DIR)/node_modules $(STOREFRONT_DIR)/.next
	@echo "$(GREEN)✓ Cleaned$(NC)"

start-backend: ## Start backend in production mode
	@echo "$(GREEN)Starting backend in production mode...$(NC)"
	cd $(BACKEND_DIR) && yarn start

start-storefront: ## Start storefront in production mode
	@echo "$(GREEN)Starting storefront in production mode...$(NC)"
	cd $(STOREFRONT_DIR) && yarn start

logs-backend: ## View backend logs (if running in background)
	@cd $(BACKEND_DIR) && tail -f .medusa/server.log 2>/dev/null || echo "No log file found"

lint: ## Run linting for storefront
	@echo "$(GREEN)Running linter...$(NC)"
	cd $(STOREFRONT_DIR) && yarn lint

test-backend: ## Run backend tests
	@echo "$(GREEN)Running backend tests...$(NC)"
	cd $(BACKEND_DIR) && yarn test:unit
