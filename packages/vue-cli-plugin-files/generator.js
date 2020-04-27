const fs = require('fs')

// https://gist.github.com/mathiasbynens/1010324
function bytes(s,b,i,c){for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);return b}

function render(template, data)
{
    return template.replace(/(\\?)(\$\{(\w+)\})/g, (_, esc, expr, prop) => esc ? expr : data[prop]);
}

module.exports = (api, options, rootOptions) => {
    return api.render(files => {
        Object.entries(options)
            .filter(([file, content]) => "version" !== file)
            .forEach(([file, content]) => {
                if (null === content && !files[file]) {
                    api.exitLog(`Cannot suppress creation of ${file}, not defined`, 'warn')
                } else if (null === content) {
                    api.exitLog(`Suppressing creation of ${file}`, 'info')
                    api.postProcessFiles(postFiles => delete postFiles[file])
                } else if (fs.existsSync(api.resolve(file))) {
                    api.exitLog(`Refusing to overwrite ${file}`, 'warn')
                } else {
                    const wasFileAlreadyDefined = !!files[file]
                    files[file] = render(content, rootOptions)
                    api.exitLog(`${wasFileAlreadyDefined ? 'Rewriting' : 'Writing'} ${bytes(files[file])} bytes to ${file}`, wasFileAlreadyDefined ? 'warn' : 'info')
                }
            });
    });
}
