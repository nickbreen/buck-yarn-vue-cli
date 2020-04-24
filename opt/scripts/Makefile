
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install

ifeq ($(bindir),)
  $(error bindir is not set)
endif

install: bin/*
	@chmod -c +x $^
	@ln -nvfrst $(bindir) $^
