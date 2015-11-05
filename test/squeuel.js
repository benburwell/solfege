var should = require('should');
var Sandbox = require('sandboxed-module');
var Squeuel = Sandbox.require('../src/squeuel', {
  requires: {
    'pg': './mock_pg'
  }
});

describe('Connection', function() {

});
