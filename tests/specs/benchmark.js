var Promise = require('es6-promise').Promise;
var Gagarin = require('../../gagarin');
var tools = require('../../tools');
var path = require('path');
var expect = require('chai').expect;
var buildAsPromise = require('../../build');

describe('Benchmark test suite', function () {

  var pathToApp = path.resolve('./tests/example');

  var gagarin = new Gagarin({
    pathToApp: path.resolve('./tests/example')
  });

  before(function () {
    // the sleep is not required but
    // lets demonstrate that it works :)
    return gagarin.start().sleep(500);
  });

  after(function () {
    return gagarin.exit();
  });

  // this testdoes not make sense after all
  it.skip('should be able to find the release config', function () {
    var config = tools.getReleaseConfig(pathToApp);
    expect(config.tools).to.be.ok;
    expect(config.tools).not.to.be.equal('latest');
  });

  it('should be able to build app', function () {
    return buildAsPromise(pathToApp);
  });

  it('execute should work', function () {
    return gagarin.execute(function () {
      return Meteor.release;
    })
    .then(function (value) {
      expect(value).not.to.be.empty;
    });
  });

  it('db insert should work', function () {
    return gagarin.execute(function () {
      return Items.insert({vostok: Random.id()});
    })
    .then(function (value) {
      expect(value).not.to.be.empty;
    });
  });

  it('promise should work', function () {
    return gagarin.promise(function (resolve, reject) {
      Meteor.setTimeout(function () {
        resolve(Meteor.release);
      }, 100);
    })
    .then(function (value) {
      expect(value).not.to.be.empty;
    });
  });

  it('should throw a descriptive error', function () {
    return gagarin.execute(function () {
      undefined[0];
    }).expectError(function (err) {
      expect(err.toString()).to.contain('property');
    });
  });

});
