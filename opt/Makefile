
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean

export bindir := $(abspath bin)
export PATH := $(bindir):$(PATH)

install:
	$(MAKE) -C scripts install
	$(MAKE) -C java install
#	$(MAKE) -C python install
	$(MAKE) -C buck install
	$(MAKE) -C watchman install
	$(MAKE) -C node install
	$(MAKE) -C yarn install
	@find -L $(bindir) -type l -delete

clean:
	$(MAKE) -C java clean
	$(MAKE) -C python clean
	$(MAKE) -C watchman clean
	$(MAKE) -C node clean
	@find -L $(bindir) -type l -delete
