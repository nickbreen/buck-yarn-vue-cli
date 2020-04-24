
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean

ifeq ($(bindir),)
  $(error bindir is not set)
endif

version ?= 12.16.1

install: node-v$(version)-linux-x64
	@ln -nvfrst $(bindir) $(wildcard $</bin/*)

clean:
	find -mindepth 1 -maxdepth 1 -type d | xargs -r rm -rf

node-v%-linux-x64.tar.xz: url = https://nodejs.org/dist/v$(*)/node-v$(*)-linux-x64.tar.xz
node-v%-linux-x64.tar.xz:
	curl -sSfJL -z "$@" -o $@ $(url)
	@touch $@

node-%: node-%.tar.xz
	tar xmf $<
