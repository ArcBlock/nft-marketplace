TOP_DIR=.
README=$(TOP_DIR)/README.md

VERSION=$(strip $(shell cat version))

build:
	@echo "Building the software..."
	@yarn build

init: install dep
	@echo "Initializing the repo..."

travis-init: install dep
	@echo "Initialize software required for travis (normally ubuntu software)"

install:
	@echo "Install software required for this repo..."
	@npm install -g yarn @abtnode/cli

dep:
	@echo "Install dependencies required for this repo..."
	@yarn

pre-build: install dep
	@echo "Running scripts before the build..."

post-build:
	@echo "Running scripts after the build is done..."

all: pre-build build post-build

test:
	@echo "Running test suites..."

lint:
	@echo "Linting the software..."
	@yarn lint

doc:
	@echo "Building the documenation..."

precommit: dep lint doc build test

travis: precommit

travis-deploy:
	@echo "Deploy the software by travis"

clean:
	@echo "Cleaning the build..."

run:
	@echo "Running the software..."
	@yarn start

redep:
	@echo "Rebuilding dependencies..."
	@rm -rf node_modules
	@rm -f yarn.lock
	@yarn
	@git checkout yarn.lock

include .makefiles/*.mk

.PHONY: build init travis-init install dep pre-build post-build all test doc precommit travis clean watch run bump-version create-pr
