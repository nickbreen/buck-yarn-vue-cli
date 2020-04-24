SHELL = /bin/sh

.SUFFIXES:

.PHONY: install check.md5 check.sha256

sum ?= md5
edition ?= 8u41
version ?= $(edition)-b04-linux-x64-14_jan_2020
url ?= https://download.java.net/openjdk/jdk$(edition)/ri/

install: openjdk-$(edition)

clean:
	rm -rf openjdk-$(edition)

openjdk-%.tar.gz openjdk-%.tar.gz.md5 openjdk-%.tar.gz.sha256:
	curl -sSfJL -z "$@" -o "$@" $(addprefix $(url),$@)
	@touch $@

check.md5: openjdk-$(version).tar.gz openjdk-$(version).tar.gz.md5
	echo "$$(awk '{ print $$NF }' $<.md5)  $<" | md5sum -c

check.sha256: openjdk-$(version).tar.gz openjdk-$(version).tar.gz.sha256
	echo "$$(cat $<.sha256)  $<" | sha256sum -c

openjdk-$(edition): openjdk-$(version).tar.gz check.$(sum)
	rm -rf "$@"; mkdir "$@"
	tar xmf $< -C "$@" --strip-components 1