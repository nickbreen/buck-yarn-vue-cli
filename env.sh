#!/usr/bin/env bash

# default to the current working directory
export project="$(realpath "${1-$PWD}")"

# the specified dir must contain this script
test "${project}/env.sh" -ef "${BASH_SOURCE[0]}" || return 64 # use return so we can source this script

# add opt/bin to the path if not already present in the path
[[ ":$PATH:" == *":${project}/opt/bin:"* ]] || PATH="${project}/opt/bin:$PATH"

alias godev='cd ${project}'
