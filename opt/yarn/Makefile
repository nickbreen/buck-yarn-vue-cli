
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean

ifeq ($(bindir),)
  $(error bindir is not set)
endif

version ?= 1.22.4
berry ?= 2.1.1

install: node_modules/.bin
	@ln -nvfrst $(bindir) $^/*
	yarn set version $(berry) || yarn set version berry && yarn set version $(berry)

package.json:
	echo '{}' > $@

node_modules/.bin: package.json
	npm install --no-package-lock

yarn-%.js: url = https://github.com/yarnpkg/yarn/releases/download/v$(*)/yarn-$(*).js
yarn-%.js:
	curl -sSfJL -z "$@" -o $@ $(url)
	@chmod +x $<

clean:
	rm -rf node_modules package.json