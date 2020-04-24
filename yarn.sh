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

echo "\$PWD=${PWD}"
ls -lA "${PWD}"
echo "\$BUCK_PROJECT_ROOT=${BUCK_PROJECT_ROOT}"
ls -lA "${BUCK_PROJECT_ROOT}"
echo "\$BUCK_DEFAULT_RUNTIME_RESOURCES=${BUCK_DEFAULT_RUNTIME_RESOURCES}"
ls -lA "${BUCK_DEFAULT_RUNTIME_RESOURCES}"

cd "${BUCK_PROJECT_ROOT}"

if [ "${workspace_path}" ]
then
  workspace_name=$(yarn workspaces list --json | yarn json -ga -c "this.location==='${workspace_path}'" .name)
fi

# Grr, vue-cli-service/webpack/cache-loader create node_modules/.cache/{babel-loader,eslint-loader,vue-loader,terser-webpack-plugin}
# TODO find a way to configure this to use ${TMP}
trap 'rm -rf "${BUCK_PROJECT_ROOT}/${workspace_path}/node_modules"' EXIT

yarn ${workspace_name+workspace "${workspace_name}"} "$@"
