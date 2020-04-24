
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install

ifeq ($(bindir),)
  $(error bindir is not set)
endif

version ?= 2019.10.17.01

install: buck-v$(version).pex bin/buck
	@chmod -c +x $^
	@ln -nvfrst $(bindir) bin/buck

buck-v%.pex: url = https://jitpack.io/com/github/facebook/buck/v$(*)/buck-v$(*).pex
buck-v%.pex:
	curl -sSfJL -z "$@" -o $@ $(url)
	@touch $@
