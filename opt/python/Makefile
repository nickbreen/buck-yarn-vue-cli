
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean

.PRECIOUS: python-%.tar.gz

ifeq ($(bindir),)
  $(error bindir is not set)
endif

version ?= 2.7

install: dist
	@ln -nvfrst $(bindir) $(wildcard $</bin/*)

clean:
	rm -rf dist

python-%.tar.gz: url = https://github.com/kageiit/jitpack-python/releases/download/$(*)/python-$(*).tar.gz
python-%.tar.gz:
	curl -sSfJL -z "$@" -o $@ $(url)
	@touch $@

dist: python-$(version).tar.gz
	tar xmf $<
