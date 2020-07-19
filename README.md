A [yarn](https://yarnpkg.com/) plugin to resolve dependencies to [buck](https://buck.build/) targets. 

# To Do

Use `pnpEnableInlining: false` and `pnpDataPath: "./.pnp.meta.json"` to keep the one `.pnp.js` file 
committed and separate actual dependency data for each (sub-)project. 

The yarn cache can be shared. So use `cacheFolder: "./.yarn/cache"` to specify it.

Try doing the install with buck, so only requiring the lock file and cache dir.

