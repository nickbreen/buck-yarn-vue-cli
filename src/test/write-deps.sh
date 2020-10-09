#!/usr/bin/env bash

set -euo pipefail

declare name location

while getopts "n:l:" OPT ; do
  case $OPT in
    n) name=$OPTARG;;
    l) location=$OPTARG
       echo -e "${name}\t${location}" | tee /dev/stderr
    ;;
  esac
done
