
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean

export bindir := $(abspath bin)
export PATH := $(bindir):$(PATH)

install:
	$(MAKE) -C node install
	$(MAKE) -C yarn install
	$(MAKE) -C buck install
	$(MAKE) -C watchman install
	$(MAKE) -C java install
	@find -L $(bindir) -type l -delete

clean:
	$(MAKE) -C node clean
	$(MAKE) -C watchman clean
	$(MAKE) -C java clean
	@find -L $(bindir) -type l -delete
