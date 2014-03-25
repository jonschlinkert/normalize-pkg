const log = require('verbalize');

var utils = module.exports = {};


utils.normalizeAuthor = function(pkg) {
  if (typeof pkg.author === 'undefined') {
    log.warn('  normalize-pkg [missing]', ' author: {name: \'\', url: \'\'}');
    return pkg;
  }

  var author = pkg.author || '';
  var url = '';

  if (typeof author === 'object') {
    return pkg;
  } else if (typeof author === 'string') {
    log.run('normalizing', 'author property');

    pkg.author = {
      name: author,
      url: url
    };

    return pkg;
  }
};

utils.normalizeRepo = function(pkg) {
  if (typeof pkg.repository === 'undefined') {
    log.warn('  normalize-pkg [missing]', ' repository: {url: \'\', type: \'\'}');
    return pkg;
  }

  var repository = pkg.repository || '';
  var type = '';

  if (typeof repository === 'object') {
    return pkg;
  } else if (typeof repository === 'string') {
    log.run('normalizing', 'repo property');

    if (!!~repository.search('git')) {
      type = 'git';
    }

    pkg.repository = {
      type: type,
      url: repository
    };

    return pkg;
  }
};

utils.normalizeBugs = function(pkg) {
  if (typeof pkg.bugs === 'undefined') {
    log.warn('  normalize-pkg [missing]', ' bugs: {url: \'\'}');
    return pkg;
  }

  var bugs = pkg.bugs || '';

  if (typeof bugs === 'object') {
    return pkg;
  } else if (typeof bugs === 'string') {
    log.run('normalizing', 'bugs property');

    pkg.bugs = {
      url: bugs
    };

    return pkg;
  }
};

utils.normalizeLicense = function(pkg) {

  if (typeof pkg.license === 'undefined') {
    log.warn('  normalize-pkg [missing]', ' license: {url: \'\', type: \'\'}');
    return pkg;
  }

  var license = pkg.license || '';
  var url = '';

  if(pkg.licenses || typeof pkg.license === 'object') {
    return pkg;
  } else if (typeof license === 'string') {
    log.run('normalizing', 'license property');

    if (!!~license.search('MIT')) {
      url = 'http://opensource.org/licenses/MIT';
    }

    if (!!~license.search('Apache')) {
      url = 'http://www.apache.org/licenses/LICENSE-2.0.html';
    }

    if (!!~license.search('GPL')) {
      if (!!~license.search('2')) {
        url = 'http://www.gnu.org/licenses/gpl-2.0.txt';
      }

      if (!!~license.search('3')) {
        url = 'http://www.gnu.org/licenses/gpl-3.0.txt';
      }
    }

    pkg.license = {
      type: license,
      url: url
    };

    return pkg;
  }
};