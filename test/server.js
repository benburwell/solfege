var should = require('should');
var request = require('request');
var server = require('../src');

var ROOT_URL = 'http://127.0.0.1:8000';

describe('Server', function() {

  before(function() {
    server.start();
  });

  after(function() {
    server.stop();
  });

  describe('Basic Connectivity', function() {
    it('should be available on port 8000', function() {
      request.get(ROOT_URL, function(err, response, body) {
        response.should.be.html();
      });
    });

    it('should serve the index', function() {
      request.get(ROOT_URL, function(err, response, body) {
        body.should.not.be.empty();
      });
    })
  });

  describe('Search results', function() {
    it('should display search results', function() {
      request.get(ROOT_URL + '/search?q=do+re+mi', function(err, res, body) {
        body.should.not.be.empty();
        response.should.have.status(200);
      });
    });
  });
});
