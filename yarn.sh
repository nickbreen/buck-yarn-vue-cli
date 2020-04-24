#!/usr/bin/env bash

set -euo pipefail

declare workspace_path workspace_name

while getopts :w: opt; do
  case ${opt} in
  w) workspace_path="$OPTARG" ;;
  :)
    echo "Missing argument to $OPTARG"
    exit 64
    ;;
  \?)
    echo "Unknown argument $OPTARG"
    exit 64
    ;;
  *)
    echo "Unimplemented argument $OPTARG"
    exit 64
    ;;
  esac
done
shift $((OPTIND-1))

cd "${BUCK_DEFAULT_RUNTIME_RESOURCES}"

if [ "${workspace_path}" ]
then
  workspace_name=$(yarn workspaces list --json | yarn json -ga -c "this.location==='${workspace_path}'" .name)
fi

yarn ${workspace_name+workspace "${workspace_name}"} "$@"
