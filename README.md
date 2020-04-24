
Exploring creating [Vue][6] (or indeed any) with an offline build process (looking at you NPM.) 

[Yarn][2] & [Buck][1], both from Facebook, same offline deterministic build methodology.

# Development vs CI

Doing development tasks and build/CI tasks are quite different.

E.g. development tasks, executed by the developer with command line (i.e. yarn) or with IDE tooling:
- add a node package (e.g. vuex) to a node module package.json (e.g. app/package.json)
- lock a node package (e.g. vuex@3.1.2) in (e.g. app/yarn.lock) 
- add a node package's TGZ (e.g. vuex-3.1.2.tgz) to the offline cache (e.g. lib/yarn-offline-mirror)
- adding/upgrading to a newer version of a node package (e.g. vuex@3.1.3) for a node module (e.g. app/package.json)

E.g. build/CI tasks, executed by the build tool (i.e. buck):
- build a node module (e.g. //app)
- run tests for a node module (e.g. //app)
- run a hot-deploy or local server (e.g. //app)
- package a node modules for production distribution (e.g. //app)
- run the production distribution (e.g. //app)

The build tool may delegate to other tools. In this case buck delegates to yarn.

This creates an interesting situation: buck must run yarn in offline/immutable mode and must use the //lib module's 
_output_; while the developer will need to run yarn in online mode and mutate the //lib module's _source_.

The developer and buck will need different configurations (i.e. .yarnrc), buck's will need to be a module _output_.

## Buck & Yarn

It is tempting to use `buck run` to provide the yarn and vue CLI tools. This _sort of_ works, but requires quite
a bit of tom-foolery to work around current working directories and linking yarn.lock and .yarnrc files.

It requires even more malarkey to get Vue CLI working too as it expects to be installed globally.  

One can see the efforts in //lib/yarn and //lib/vue-cli. Part of the problem is that it's conflating dev-time
tooling and build-/CI-time tooling. 

While this more-or-less works, those tools can now only be executed via buck via complicated wrapper scripts.

Another part of the problem is that one cannot specify `package.json` or `yarn.lock` files - they must be in the 
current working directory.

# Tooling

Look at `env.sh` and see how it sets up the development environment. Source it. 

Look at `opt/Makefile` and see how it finds, downloads, and installs each tool. 

    make -C opt

## Buck, Java 8, Python 2.7

Buck needs [Java 8][13] (JRE) to _run_. It honours the `JAVA_HOME` environment variable. See `opt/java` and `env.sh`.

Buck *also* needs Python 2.7. It sucks trying to get a standalone/portable python sorted, so just install your 
distribution's `python2` (Fedora/Debian/Ubuntu) package. 

Note that the [python2][14] distributable used by jitpack.io to build buck is missing some character encodings needed to 
run buck!

## Yarn

Yarn's setup to use Yarn berry (Yarn 2.x) and PnP (no more `node_modules` directories!). See `opt/yarn/Makefile`. 

It maintains a single cache of package archives (`.yarn/cache`), a single `yarn.lock` and single `.yarnrc.yml` 
configuration.

PnP (generally) refuses to let a module load a module that it doesn't declare in its package manifest.
See `pnpMode: loose` and `packageExtensions:` in `.yarnrc.yml` for workarounds.

Yarn is configured to use workspaces.

All node modules must be in a Yarn "workspace", these must be listed (or glob'd) in the root package.json.

## Vue CLI

1. Create a new project with Vue CLI.

       cd packages
       yarn vue create app

   Note the `tgz` files for each dependency added in `.yarn/cache`!

       git ls-files --others -- .yarn/cache 
   
3. Start a hot-deploy dev web server:

       yarn workspace app run serve

Building the production distributable is better handled with CI tooling, so build *and* serve the production 
distribution of the app:

    yarn dlx serve -s $(buck build --show-output //packages/app:build | awk '{ print $2 }')

See `buck.defs` and how it's used in `app/BUCK`; see `lib/BUCK` to see the yarn offline mirror and .yarnrc files used 
by buck.  

# Configuring ESLint, Babel, & Webpack

ESLint's [configuration][10] can be root-project-level, we shall also make this the "root" ESLint configuration file.
See `.eslint.js`.

Babel's [configuration][11] can be mono-repo friendly too, but it is [a bit trickier][15], so we need to configure 
[webpack][12]. See `babel.config.js` and `webpack.config.js`

# To Do

- [x] add JDK8, JDK11 from https://openjdk.java.net/install/ 
- [x] experiment? make vue cli a dependency rather than a source root package; added to opt
- [x] experiment? make yarn (and vue) buck executable modules (use buck run); see lib/yarn, lib/vue-cli
- [ ] build node 'library' module
- [ ] use the 'library' module in a 'app' module
- [ ] custom webpack project
- [ ] main/test sources
- [x] watchman from source
- [x] ~~node from source?~~ no
- [x] ~~yarn from source?~~ no
- [ ] ~~python2~~ buck won't run with (the [python2][14] distributable used to build it) with:
      
      LookupError: unknown encoding: ascii

- [x] try yarn [workspaces][17]
- [x] try [lerna][16]

- [ ] add websocket server (java portal)
- [ ] add websocket client
- [ ] add web workers: Shared(WebSocket) -> Dedicated -> Vuex -> Vue
- [ ] add a Disruptor!

# Host, chroot, or Container?

It might be helpful to run the tooling in a chroot or container with the project directory mounted.

That way the exact Node JS, Python 2.7, Java 8 JRE, and Java JDK can be configured for Yarn and Buck.

Say, based on an [Ubuntu Cloud Image][4]. 

Use LXC, LXD, Docker, systemd-container/machinectl, [linux-user-chroot][7] (now bubblewrap)?

Tooling/dependencies could be deployed into the chroot instead of ./opt/.

# References

[1]: https://buck.build/
[2]: https://classic.yarnpkg.com/en/docs
[3]: https://classic.yarnpkg.com/blog/2016/11/24/offline-mirror/
[4]: http://cloud-images.ubuntu.com/minimal/releases/bionic/release/
[5]: https://cli.vuejs.org/
[6]: https://vuejs.org/
[7]: http://manpages.ubuntu.com/manpages/bionic/man8/linux-user-chroot.8.html
[8]: https://cli.vuejs.org/guide/plugins-and-presets.html#preset-plugin-versioning
[9]: https://cli.vuejs.org/guide/creating-a-project.html#pulling-2-x-templates-legacy
[10]: https://eslint.org/docs/user-guide/configuring#configuration-file-formats
[11]: https://babeljs.io/docs/en/config-files#monorepos
[12]: https://babeljs.io/docs/en/config-files#webpack
[13]: https://jdk.java.net/java-se-ri/8-MR3
[14]: https://jitpack.io/com/github/facebook/buck/v2019.10.17.01/build.log
[15]: https://medium.com/botify-labs/lessons-learned-in-2-years-with-a-javascript-react-monorepo-526e2154d5f1
[16]: https://lerna.js.org/
[17]: https://classic.yarnpkg.com/en/docs/workspaces
[18]: https://github.com/slanatech/vue-monorepo-boilerplate