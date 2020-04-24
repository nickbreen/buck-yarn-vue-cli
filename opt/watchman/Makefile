
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean

ifeq ($(bindir),)
  $(error bindir is not set)
endif

version ?= 4.9.0

prefix ?= $(abspath .)

install: bin
	test -n "$(bindir)"
	@ln -nvfrst $(bindir) $</watchman

clean:
	find -mindepth 1 -maxdepth 1 -type d | xargs -r rm -rf

watchman-%: watchman-%.tar.gz
	tar xmf $<
	echo $(prefix)
	cd $@ && ./autogen.sh && ./configure --prefix=$(prefix) --without-python --without-pcre --enable-lenient
	$(MAKE) -C $@

bin var share &: watchman-$(version)
	$(MAKE) -C $< install

watchman-%.tar.gz: url = https://github.com/facebook/watchman/archive/v$(*).tar.gz
watchman-%.tar.gz:
	curl -sSfJL -z "$@" -o $@ $(url)
	@touch $@
