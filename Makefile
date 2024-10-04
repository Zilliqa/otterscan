.PHONY: all
all: image/build-and-push

.ONESHELL:
SHELL := /bin/bash
.SHELLFLAGS = -ec

ENVIRONMENT ?= dev
VALID_ENVIRONMENTS := dev stg prd
# Check if the ENVIRONMENT variable is in the list of valid environments
ifeq ($(filter $(ENVIRONMENT),$(VALID_ENVIRONMENTS)),)
$(error Invalid value for ENVIRONMENT. Valid values are dev, stg, or prd.)
endif

HERE=$(shell pwd)

IMAGE_TAG ?= otterscan:latest


.PHONY: image/build-and-push
image/build-and-push:
	./scripts/gen-version.sh autogen/version.ts
	docker buildx build -f Dockerfile.zilliqa . -t $(IMAGE_TAG)
	docker push "$(IMAGE_TAG)"
