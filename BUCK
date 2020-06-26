yarn_requisites = [
    '.pnp.js',
    '.yarnrc.yml',
    'package.json',
    'yarn.lock',
]

sh_binary(
    name = 'yarn.js',
    main = '.yarn/releases/yarn-2.0.0-rc.36.js',
    resources = yarn_requisites,
)

# Use this alias in BUCK files or defs to delegate to yarn.
command_alias(
    name = 'yarn',
    exe = ':yarn.js',
    visibility = [ 'PUBLIC' ]
)

# Wrapper script for building node modules with yarn in buck, it runs (somewhere, thou shalt not care where) in the buck-out directory
#sh_binary(
#    name = 'yarn.sh',
#    main = 'yarn.sh',
#    resources = [':yarn.js'],
#)

#command_alias(
#    name = 'yarn',
#    exe = ':yarn.sh',
#    args = ['$(exe :yarn.js)'], # first arg is the delegated yarn executable
#    visibility = [ 'PUBLIC' ]
#)
