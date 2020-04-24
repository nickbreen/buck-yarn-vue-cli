
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean

ifeq ($(bindir),)
  $(error bindir is not set)
endif

version ?= 1.22.4
berry ?= 2.0.0-rc.32

install: yarn-$(version).js
	@chmod +x $<
	@ln -nvfrs $< $(bindir)/yarn
	node $< set version berry || node $< set version latest || node $< set version $(berry)

yarn-%.js: url = https://github.com/yarnpkg/yarn/releases/download/v$(*)/yarn-$(*).js
yarn-%.js:
	curl -sSfJL -z "$@" -o $@ $(url)
