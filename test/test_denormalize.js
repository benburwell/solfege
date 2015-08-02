var should = require('should');
var denormalize = require('../src/utils').denormalize;

describe('Denormalize', function() {
  it('should denormalize a', function() {
    denormalize('a').should.be.exactly('do');
  });

  it('should denormalize b', function() {
    denormalize('b').should.be.exactly('do+');
  });

  it('should denormalize c', function() {
    denormalize('c').should.be.exactly('re');
  });

  it('should denormalize d', function() {
    denormalize('d').should.be.exactly('re+');
  });

  it('should denormalize e', function() {
    denormalize('e').should.be.exactly('mi');
  });

  it('should denormalize f', function() {
    denormalize('f').should.be.exactly('fa');
  });

  it('should denormalize g', function() {
    denormalize('g').should.be.exactly('fa+');
  });

  it('should denormalize h', function() {
    denormalize('h').should.be.exactly('so');
  });

  it('should denormalize i', function() {
    denormalize('i').should.be.exactly('so+');
  });

  it('should denormalize j', function() {
    denormalize('j').should.be.exactly('la');
  });

  it('should denormalize k', function() {
    denormalize('k').should.be.exactly('la+');
  });

  it('should denormalize l', function() {
    denormalize('l').should.be.exactly('ti');
  });

  it('should denormalize multiple syllables', function() {
    denormalize('ace').should.be.exactly('do re mi');
  });
});
