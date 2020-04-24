
SHELL = /bin/sh

.SUFFIXES:

.PHONY: install clean check

ifeq ($(bindir),)
  $(error bindir is not set)
endif

install:
	$(MAKE) --makefile Makefile.java sum=md5 edition=8u41 version=8u41-b04-linux-x64-14_jan_2020 $@
	$(MAKE) --makefile Makefile.java sum=sha256 edition=11 version=11+28_linux-x64_bin $@

clean:
	$(MAKE) --makefile Makefile.java edition=8u41 $@
	$(MAKE) --makefile Makefile.java edition=11 $@

