const fs = require('fs')

// https://gist.github.com/mathiasbynens/1010324
function bytes(s,b,i,c){for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);return b}

module.exports = (api, options, rootOptions) => {
    return api.render(files => {
        Object.entries(options)
            .filter(([file, content]) => "version" !== file)
            .forEach(([file, content]) => {
                if (null === content && !files[file]) {
                    api.exitLog(`Cannot delete ${file}, does not exist`, 'warn')
                } else if (null === content) {
                    api.exitLog(`Suppressed creation of ${file}`, 'info')
                    api.postProcessFiles(postFiles => delete postFiles[file])
                } else if (fs.existsSync(api.resolve(file))) {
                    api.exitLog(`Refusing to overwrite ${file}`, 'warn')
                } else {
                    api.exitLog(`Wrote ${bytes(content)} bytes to ${file}`, 'info')
                    files[file] = content
                }
            });
    });
}
