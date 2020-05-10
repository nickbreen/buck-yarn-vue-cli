yarn_requisites = [
    '.yarn/',
    '.pnp.js',
    '.yarnrc.yml',
    'package.json',
    'yarn.lock'
]

# Yarn requires all its workspaces to resolves any workspace packages; list them *all* here.
yarn_workspaces = [
    'build/packages',
    'packages',
    'shared/ui/packages',
]
# We *could* load workspaces from package.json - though it does not work well with globs or nested
# workspaces or when there are files (i.e. BUCK) in the workspace (e.g. build/packages/preset.json)!
# import json
# add_build_file_dep('//package.json')
# with open('package.json') as package_json:
#     manifest = json.load(package_json)
#     yarn_workspaces = glob(manifest['workspaces'])

sh_binary(
    name = 'yarn',
    main = 'yarn.sh',
    resources = yarn_requisites + yarn_workspaces,
    visibility = [
        'PUBLIC'
    ]
)