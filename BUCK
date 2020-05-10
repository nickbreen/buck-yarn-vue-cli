sh_binary(
    name = 'yarn',
    main = 'yarn.sh',
    resources = [
        # Yarn's requisites
        '.yarn/',
        '.pnp.js',
        '.yarnrc.yml',
        'package.json',
        'yarn.lock',
        # Add workspaces here
        'build/packages',
        'packages',
        'shared/ui/packages',
    ],
    visibility = [
        'PUBLIC'
    ]
)