FISTBOOT_SERVICE := $(shell base64 -w0 < aux/custom-first-boot.service)

INSTALL_DIR := ~/.local/share/cockpit
INSTALL_TARGET := $(INSTALL_DIR)/image-builder-frontend

# you might want to override when building e.g. with
# export WEBPACK_BIN=./node_modules/.bin/webpack
# make build
WEBPACK_BIN ?= webpack

CUR_DIR := $(shell pwd)

help:
	@cat Makefile

src/constants.ts: aux/custom-first-boot.service
	sed -i "s/.*FIRST_BOOT_SERVICE_DATA.*/export const FIRST_BOOT_SERVICE_DATA = '$(FISTBOOT_SERVICE)';/" $@

.PHONY: prep
prep: src/constants.ts

.PHONY: install
install:
	npm install

.PHONY: start
start: prep
	npm start



all: devel-install build devel-uninstall

# target to create all directories if needed
pkg/lib $(INSTALL_DIR):
	mkdir -p $@

$(INSTALL_TARGET): $(INSTALL_DIR)
	ln  -sfn $(CUR_DIR)/cockpit/public $(INSTALL_TARGET)

.temp_cockpit_repo:

# README is just some file that will be there, when done
pkg/lib/README: pkg/lib
	git clone --depth 1 --branch main https://github.com/cockpit-project/cockpit.git temp_cockpit_repo
	cp -r temp_cockpit_repo/pkg/lib/* pkg/lib/
	rm -rf temp_cockpit_repo

# this requires a built source tree and avoids having to install anything system-wide
devel-install: $(INSTALL_DIR) pkg/lib/README

build: devel-install
	@echo "Building Cockpit using Webpack."
	$(WEBPACK_BIN) --config cockpit/webpack.config.ts

clean:
	rm -f $(INSTALL_TARGET)
	rm -rf pkg/
	rm -rf dist/
	rm -rf cockpit/public/vendor*
	rm -rf cockpit/public/src_*
	rm -rf cockpit/public/main*


.PHONY: all devel-install build clean

