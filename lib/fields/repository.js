'use strict';

module.exports = function (app) {
  return function (config) {
    if (config.repositories) {
      app.warn('repositories');
      config.repository = config.repositories[0];
    }

    if (!config.repository) {
      return app.warn('missingRepository');
    }

    if (typeof config.repository === 'string') {
      config.repository = {
        type: 'git',
        url: config.repository
      };
    }

    // var repo = config.repository.url || '';
    // if (repo) {
    //   var hosted = hostedGitInfo.fromUrl(r);
    //   if (hosted) {
    //     repo = config.repository.url = hosted.getDefaultRepresentation() == 'shortcut'
    //       ? hosted.https()
    //       : hosted.toString();
    //   }
    // }

    // if (r.match(/github.com\/[^\/]+\/[^\/]+\.git\.git$/)) {
    //   app.warn('brokenGitUrl', repo);
    // }
  };
};

