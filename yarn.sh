#!/usr/bin/env bash

set -euo pipefail -x

# The resources are also made available in a tree structure that mirrors their locations in the source and buck-out
# trees. The environment variable $BUCK_PROJECT_ROOT specifies a directory that contains all the resources, laid out
# in their locations relative to the original buck project root.
# -- https://buck.build/rule/sh_binary.html#resources

cd "${BUCK_PROJECT_ROOT}"

ls -lA
find

test -x $1

exec "$@"
