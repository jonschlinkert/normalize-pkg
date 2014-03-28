const fs = require('fs');
const unique = require('unique-words');
const utils = require('./lib/utils');
const log = require('verbalize');
log.runner = 'normalize-pkg';



var normalize = module.exports = {};

/**
 * Author
 *
 * @param {Object} pkg
 * @return {Object} normalized author
 */

normalize.author = function (pkg) {
  var name = '', url = '';

  if (typeof pkg.author === 'object') {
    utils.msg.isCorrect('author');
    return pkg;

  } else if (typeof pkg.author === 'undefined') {
    if (pkg.authors && pkg.authors.length === 1)  {
      utils.msg.fixingProperty('author');

      name = pkg.authors[0].name;
      url = pkg.authors[0].url;

      delete pkg.authors;
    } else {
      utils.msg.isMissing('author');
      utils.msg.addingProperty('author');
    }

  } else if (typeof pkg.author === 'string') {
    utils.msg.isMissing('author');
    utils.msg.fixingProperty('author');

    name = pkg.author;
  } else {
    return utils.msg.isMalformed('author');
  }

  pkg.author = {
    name: name,
    url: url
  };

  return pkg;
};


/**
 * Repository
 *
 * @param {Object} pkg
 * @return {Object} normalized repository
 */

normalize.repo = function (pkg) {
  var type = '', url = '';

  if (typeof pkg.repository === 'object') {
    utils.msg.isCorrect('repository');
    return pkg;

  } else if (typeof pkg.repository === 'undefined') {
    if (pkg.repositories && pkg.repositories.length === 1)  {
      utils.msg.isMissing('repository');
      utils.msg.addingProperty('repository');

      type = pkg.repositories[0].type;
      url = pkg.repositories[0].url;
      delete pkg.repositories;

    } else {
      utils.msg.isMissing('repository');
      utils.msg.addingProperty('repository');
    }

  } else if (typeof pkg.repository === 'string') {
    utils.msg.fixingProperty('repository');
    url = pkg.repository;

    if (utils.contains(pkg.repository, 'git')) {
      type = 'git';
    }

  } else {
    // If none of the above, something is amiss
    return utils.msg.isMalformed('repository');
  }

  pkg.repository = {
    type: type,
    url: url
  };

  return pkg;
};


/**
 * Bugs
 *
 * @param {Object} pkg
 * @return {Object} normalized bugs
 */

normalize.bugs = function (pkg) {
  var url = '';

  if (typeof pkg.bugs === 'object') {
    utils.msg.isCorrect('bugs');
    return pkg;

  } else if (typeof pkg.bugs === 'undefined') {
    utils.msg.isMissing('bugs');
    utils.msg.addingProperty('bugs');

  } else if (typeof pkg.bugs === 'string') {
    utils.msg.fixingProperty('bugs');
    url = pkg.bugs;

  } else {
    // If none of the above, something is amiss
    return utils.msg.isMalformed('bugs');
  }

  pkg.bugs = {
    url: url
  };

  return pkg;
};


/**
 * License
 *
 * @param {Object} pkg
 * @return {Object} normalized license
 */
normalize.license = function (pkg) {
  var type = '', url = '';

  if (typeof pkg.license === 'object') {
    utils.msg.isCorrect('license');
    return pkg;

  } else if (typeof pkg.license === 'undefined') {
    if (pkg.licenses && pkg.licenses.length === 1)  {
      utils.msg.fixingProperty('license');

      type = pkg.licenses[0].type;
      url = pkg.licenses[0].url;
      delete pkg.licenses;

    } else {
      utils.msg.isMissing('license');
      utils.msg.addingProperty('license');
    }

  } else if (typeof pkg.license === 'string') {
    utils.msg.fixingProperty('license');

    var inferred = utils.inferLicenseURL(pkg.license);
    type = inferred.type;
    url = inferred.url;

  } else {
    // If none of the above, something is amiss
    return utils.msg.isMalformed('license');
  }

  pkg.license = {
    type: type,
    url: url
  };

  return pkg;
};


/**
 * Keywords
 *
 * @param {Object} pkg
 * @return {Object} normalized keywords
 */

normalize.keywords = function (pkg) {
  var keywords = pkg.keywords || [];

  if (typeof pkg.keywords === 'undefined') {
    utils.msg.isMissing('keywords');
    utils.msg.addingProperty('keywords');

  } else if (pkg.keywords && Array.isArray(pkg.keywords)) {
    utils.msg.fixingProperty('keywords');
    keywords = unique(pkg.keywords);

  } else {
    // If none of the above, something is amiss
    return utils.msg.isMalformed('keywords');
  }

  pkg.keywords = keywords;
  return pkg;
};



/**
 * All
 *
 * @param {Object} pkg
 * @return {Object} normalized values
 */

normalize.all = function(pkg) {
  pkg = normalize.author(pkg);
  pkg = normalize.repo(pkg);
  pkg = normalize.bugs(pkg);
  pkg = normalize.license(pkg);
  pkg = normalize.keywords(pkg);
  return pkg;
};