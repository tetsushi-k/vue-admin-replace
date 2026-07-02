.PHONY: help setup up down restart ps logs test test-api test-vue bash

COMPOSE = docker compose

help:
	@echo "Available targets:"
	@echo "  make setup     - Build, install deps, migrate and seed"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make restart   - Restart all services"
	@echo "  make ps        - Show service status"
	@echo "  make logs      - Tail service logs"
	@echo "  make test      - Run API and Vue tests"
	@echo "  make test-api  - Run Laravel PHPUnit tests"
	@echo "  make test-vue  - Run Vue Vitest tests"
	@echo "  make bash      - Open shell in app container"

setup: up
	$(COMPOSE) exec -T app composer install --no-interaction
	$(COMPOSE) exec -T app cp -n .env.example .env || true
	$(COMPOSE) exec -T app php artisan key:generate --force
	$(COMPOSE) exec -T app php artisan migrate --force
	$(COMPOSE) exec -T app php artisan db:seed --force
	$(COMPOSE) exec -T frontend npm install

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart: down up

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

test: test-api test-vue

test-api:
	$(COMPOSE) exec -T app php artisan test

test-vue:
	$(COMPOSE) exec -T frontend npm run test:run

bash:
	$(COMPOSE) exec app bash
