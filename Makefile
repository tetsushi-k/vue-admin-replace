.PHONY: help setup fresh up-db up down restart ps logs test test-api test-vue bash

COMPOSE = docker compose

help:
	@echo "Available targets:"
	@echo "  make setup     - Build, install deps, migrate and seed"
	@echo "  make fresh     - Reset DB and re-seed demo data"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make restart   - Restart all services"
	@echo "  make ps        - Show service status"
	@echo "  make logs      - Tail service logs"
	@echo "  make test      - Run API and Vue tests"
	@echo "  make test-api  - Run Laravel PHPUnit tests"
	@echo "  make test-vue  - Run Vue Vitest tests"
	@echo "  make bash      - Open shell in app container"

setup: up-db
	$(COMPOSE) run --rm -T app composer install --no-interaction
	$(COMPOSE) run --rm -T app cp -n .env.example .env || true
	$(COMPOSE) run --rm -T app php artisan key:generate --force
	$(COMPOSE) run --rm -T app php artisan migrate --force --seed
	$(COMPOSE) up -d
	$(COMPOSE) exec -T frontend npm install

fresh:
	$(COMPOSE) exec -T app php artisan migrate:fresh --seed --force

up-db:
	$(COMPOSE) up -d db

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
