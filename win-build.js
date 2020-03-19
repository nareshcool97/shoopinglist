const packager = require('electron-packager');
const rebuild = require('electron-rebuild');

packager({
    dir: './',
    overwrite: true,
    asar: true,
    platform: 'win32',
    arch: 'ia32',
    prune: true,
    out: 'release-builds-folder',
    executableName: 'sv-mart',
    icon: 'imgs/logo.ico',
    extraResource: 'migrations',

    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {

    rebuild.rebuild({ buildPath, electronVersion, platform, arch })

      .then(() => callback())

      .catch((error) => callback(error));

  }],

})