var expect = require('chai').expect;

// Local libs
var pkg = require('../');


/**
 * Author
 */

describe('author', function () {
  describe('when the `author` property is a string:', function () {
    it('should return an object, using the value from `author` to populate `author.name`', function () {
      var actual = pkg.author({
        author: 'Jon Schlinkert'
      });
      var expected = {
        author: {
          name: 'Jon Schlinkert',
          url: ''
        }
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when no `author` property exists, but an `authors` property exists with only one author:', function () {
    it('should convert the `authors` array into an `author` object', function () {
      var actual = pkg.author({
        authors: [
          {
            name: 'Jon Schlinkert',
            url: 'https://github.com/jonschlinkert'
          }
        ]
      });
      var expected = {
        author: {
          name: 'Jon Schlinkert',
          url: 'https://github.com/jonschlinkert'
        }
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when no `author` or `authors` properties exist:', function () {
    it('should return an `author` object with empty values', function () {
      var actual = pkg.author({});
      var expected = {
        author: {
          name: '',
          url: ''
        }
      };
      expect(actual).to.eql(expected);
    });
  });
});


/**
 * Repository
 */

describe('repo', function () {
  describe('when the `repository` property is a string:', function () {
    it('should return an object, using the value from `repository` to populate `repository.type`', function () {
      var actual = pkg.repo({
        repository: 'https://github.com/assemble/verb.git'
      });
      var expected = {
        repository: {
          type: 'git',
          url: 'https://github.com/assemble/verb.git'
        }
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when no `repository` property exists, but a `repositories` property exists with only one repository:', function () {
    it('should convert the `repositories` array into a `repository` object', function () {
      var actual = pkg.repo({
        repositories: [
          {
            type: 'git',
            url: 'https://github.com/assemble/verb.git'
          }
        ]
      });

      var expected = {
        repository: {
          type: 'git',
          url: 'https://github.com/assemble/verb.git'
        }
      };
      expect(actual).to.eql(expected);
    });
  });


  describe('when no `repository` property exists:', function () {
    it('should return a `repository` object with empty values', function () {
      var actual = pkg.repo({});
      var expected = {
        repository: {
          type: '',
          url: ''
        }
      };
      expect(actual).to.eql(expected);
    });
  });
});


/**
 * Bugs
 */

describe('bugs', function () {
  describe('when no `bugs` property exists:', function () {
    it('should return a `bugs` object with empty values', function () {
      var actual = pkg.bugs({});
      var expected = {
        bugs: {
          url: ''
        }
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when the `bugs` property is a string:', function () {
    it('should return an object, using the value from `bugs` to populate `bugs.url`', function () {
      var actual = pkg.bugs({
        bugs: 'https://github.com/assemble/verb.git'
      });
      var expected = {
        bugs: {
          url: 'https://github.com/assemble/verb.git'
        }
      };
      expect(actual).to.eql(expected);
    });
  });
});


/**
 * License
 */

describe('license', function () {

  describe('when the `license` property is a string:', function () {
    it('should return an array, using the value from `license` to populate `license.type`, and inferring the URL from the type.', function () {
      var actual = pkg.license({license: 'MIT'}, {license: false});
      var expected = {
        licenses: [{
          type: 'MIT',
          url: 'http://opensource.org/licenses/MIT'
        }]
      };
      expect(actual).to.eql(expected);
    });
  });

  describe('when the `license` property is a string, and `license: true` is defined in the options:', function () {
    it('should return the license property as a string.', function () {
      var actual = pkg.license({license: 'MIT'}, {license: true});
      expect(actual).to.eql({license: 'MIT'});
    });
  });

  describe('when no `license` property exists, but a `licenses` property exists with only one license:', function () {
    it('should convert the `licenses` array into a `license` object', function () {
      var fixture = {
        licenses: [
          {
            type: 'Apache',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
          }
        ]
      };
      var actual = pkg.license(fixture);
      expect(actual).to.eql(fixture);
    });
  });

  describe('when a `licenses` property exists with only one licenses:', function () {
    it('should leave the property alone, since this is correct.', function () {
      var fixture = {
        licenses: [
          {
            type: 'Apache',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
          },
          {
            type: 'MIT',
            url: 'http://opensource.org/licenses/MIT'
          }
        ]
      };
      var actual = pkg.license(fixture);
      var expected = fixture;
      expect(actual).to.eql(expected);
    });
  });

  describe('when no `license` or `licenses` properties exist:', function () {
    it('should return a `license` object with empty values', function () {
      var actual = pkg.license({});
      var expected = {
        licenses: [{
          type: '',
          url: ''
        }]
      };
      expect(actual).to.eql(expected);
    });
  });
});
