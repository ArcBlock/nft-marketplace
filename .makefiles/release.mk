RELEASE_VERSION=v$(VERSION)
GIT_BRANCH=$(strip $(shell git symbolic-ref --short HEAD))
GIT_VERSION="$(strip $(shell git rev-parse --short HEAD))"
GIT_LOG=$(shell git log `git describe --tags --abbrev=0`..HEAD --pretty="tformat:%h | %s [%an]\n" | sed "s/\"/'/g")
RELEASE_BODY=release on branch __$(GIT_BRANCH)__\n\n$(GIT_LOG)
RELEASE_DATA='{"tag_name": "$(RELEASE_VERSION)", "name": "$(RELEASE_VERSION)", "target_commitish": "master", "body": "$(RELEASE_BODY)"}'
RELEASE_URL=https://api.github.com/repos/ArcBlock/nft-marketplace/releases

release:
	@git config --local user.name "zhenqiang"
	@git config --local user.email "zhenqiang@arcblock.io"
	@git remote remove origin
	@git remote add origin "https://$(GITHUB_TOKEN)@github.com/$(TRAVIS_REPO_SLUG).git"
	@git tag -a $(RELEASE_VERSION) -m "Release $(RELEASE_VERSION). Revision is: $(GIT_VERSION)" | true
	@git push origin $(RELEASE_VERSION) | true
	@npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
	@npm publish

delete-release:
	@echo "Delete a release on $(RELEASE_VERSION)"
	@git tag -d $(RELEASE_VERSION) | true
	@git push -f -d origin $(RELEASE_VERSION) | true

bump-version:
	@echo "Bump version..."
	@.makefiles/bump_version.sh
	@@test -f "package.json" && .makefiles/bump_node_version.sh

create-pr:
	@echo "Creating pull request..."
	@make bump-version || true
	@git add .;git commit -a -m "bump version";git push origin $(GIT_BRANCH)
	@hub pull-request

browse-pr:
	@hub browse -- pulls
