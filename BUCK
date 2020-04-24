export_file(
    name = '.eslintrc.js',
    visibility = ['PUBLIC']
)

export_file(
    name = 'babel.config.js',
    visibility = ['PUBLIC']
)

export_file(
    name = 'webpack.config.js',
    visibility = ['PUBLIC']
)

export_file(
    name = '.browserslistrc',
    visibility = ['PUBLIC']
)

sh_binary(
    name = 'yarn',
    main = 'yarn.sh',
    resources = ['.yarnrc.yml', '.yarn', 'packages'],
    visibility = ['PUBLIC']
)