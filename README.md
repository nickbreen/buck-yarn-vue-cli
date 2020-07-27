A [yarn](https://yarnpkg.com/) plugin to resolve dependencies to [buck](https://buck.build/) targets. 

# To Do

## Isolating Projects

Use `pnpEnableInlining: false` and `pnpDataPath: "./.pnp.meta.json"` to keep the one `.pnp.js` file 
committed and separate actual dependency data for each (sub-)project. 

The yarn cache can be shared. So use `cacheFolder: "./.yarn/cache"` to specify it.

## Buck

Try doing the install (i.e. generate `.pnp.js`) with buck, so only requiring the lock file and cache dir.

## Plugin

Look at `LinkerPlugin`