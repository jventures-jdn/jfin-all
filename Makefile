.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

setup: ## Setup prerequisites for development environmemt
	@echo ⌛ Installing prerequisites...
	@echo Please use Node 🤖 version 18.14+, your Node version: $$(node -v)
	@echo 💻 Changing PNPM version to 8.6.1
	npm i --location=global --silent pnpm@8.6.1
	@echo ✅ Ready

.SILENT: clean
clean: ## Clean Repo
	echo 🧹 Cleaning repo...
	find . -maxdepth 3 -name node_modules -type d -prune -exec rm -rf '{}' +
	find . -maxdepth 3 -name .next -type d -prune -exec rm -rf '{}' +
	find . -maxdepth 3 -name .turbo -type d -prune -exec rm -rf '{}' +
	find . -maxdepth 3 -name dist -type d -prune -exec rm -rf '{}' +
	find . -maxdepth 3 -name build -type d -prune -exec rm -rf '{}' +
	find . -maxdepth 3 -name coverage -type d -prune -exec rm -rf '{}' +
	find . -maxdepth 3 -name .docusaurus -type d -prune -exec rm -rf '{}' +
	find . -maxdepth 1 -name generated -type d -prune -exec rm -rf '{}' +
	find . -name '*.log' -prune -exec rm -rf '{}' +
	echo ✅ Repo cleaned!