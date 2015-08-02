var should = require('should');
var normalize = require('../src/utils').normalize;

describe('Normalize', function() {

  describe('Uppercasing', function() {
    it('should normalize uppercase input', function() {
      normalize('DO').should.be.exactly('a');
    });
  });
  
  describe('Basic tests', function() {

    describe('A', function() {
      it('should convert do to a', function() {
        normalize('do').should.be.exactly('a');
      });

      it('should convert doh to a', function() {
        normalize('doh').should.be.exactly('a');
      });
    });

    describe('B', function() {
      it('should convert do+ to b', function() {
        normalize('do+').should.be.exactly('b');
      });

      it('should convert do# to b', function() {
        normalize('do#').should.be.exactly('b');
      });

      it('should convert doh+ to b', function() {
        normalize('doh+').should.be.exactly('b');
      });

      it('should convert doh# to b', function() {
        normalize('doh#').should.be.exactly('b');
      });

      it('should convert re- to b', function() {
        normalize('re-').should.be.exactly('b');
      });

      it('should convert reb to b', function() {
        normalize('reb').should.be.exactly('b');
      });
    });

    describe('C', function() {
      it('should convert re to c', function() {
        normalize('re').should.be.exactly('c');
      });
    });

    describe('D', function() {
      it('should convert re+ to d', function() {
        normalize('re+').should.be.exactly('d');
      });

      it('should convert re# to d', function() {
        normalize('re#').should.be.exactly('d');
      });

      it('should convert mi- to d', function() {
        normalize('mi-').should.be.exactly('d');
      });

      it('should convert mib to d', function() {
        normalize('mib').should.be.exactly('d');
      });
    });

    describe('E', function() {
      it('should convert mi to e', function() {
        normalize('mi').should.be.exactly('e');
      });
    });

    describe('F', function() {
      it('should convert fa to f', function() {
        normalize('fa').should.be.exactly('f');
      });
    });

    describe('G', function() {
      it('should convert fa+ to g', function() {
        normalize('fa+').should.be.exactly('g');
      });

      it('should convert fa# to g', function() {
        normalize('fa#').should.be.exactly('g');
      });

      it('should convert so- to g', function() {
        normalize('so-').should.be.exactly('g');
      });

      it('should convert sob to g', function() {
        normalize('sob').should.be.exactly('g');
      });

      it('should convert sol- to g', function() {
        normalize('sol-').should.be.exactly('g');
      });

      it('should convert solb to g', function() {
        normalize('solb').should.be.exactly('g');
      });
    });

    describe('H', function() {
      it('should convert so to h', function() {
        normalize('so').should.be.exactly('h');
      });

      it('should convert sol to h', function() {
        normalize('sol').should.be.exactly('h');
      });
    });

    describe('I', function() {
      it('should convert so+ to i', function() {
        normalize('so+').should.be.exactly('i');
      });

      it('should convert so# to i', function() {
        normalize('so#').should.be.exactly('i');
      });

      it('should convert sol+ to i', function() {
        normalize('sol+').should.be.exactly('i');
      });

      it('should convert sol# to i', function() {
        normalize('sol#').should.be.exactly('i');
      });

      it('should convert la- to i', function() {
        normalize('la-').should.be.exactly('i');
      });

      it('should convert lab to i', function() {
        normalize('lab').should.be.exactly('i');
      });
    });

    describe('J', function() {
      it('should convert la to j', function() {
        normalize('la').should.be.exactly('j');
      });
    });

    describe('K', function() {
      it('should convert la+ to k', function() {
        normalize('la+').should.be.exactly('k');
      });

      it('should convert la# to k', function() {
        normalize('la#').should.be.exactly('k');
      });

      it('should convert ti- to k', function() {
        normalize('ti-').should.be.exactly('k');
      });

      it('should convert tib to k', function() {
        normalize('tib').should.be.exactly('k');
      });

      it('should convert si- to k', function() {
        normalize('si-').should.be.exactly('k');
      });

      it('should convert sib to k', function() {
        normalize('sib').should.be.exactly('k');
      });
    });

    describe('L', function() {
      it('should convert ti to l', function() {
        normalize('ti').should.be.exactly('l');
      });

      it('should convert si to l', function() {
        normalize('si').should.be.exactly('l');
      });
    });

  });

  describe('Challenging input', function() {
    it('should correctly interpret multiple syllables', function() {
      normalize('do re mi').should.be.exactly('ace');
    });

    it('should correctly tokenize unusual spacing', function() {
      normalize('do re         mi').should.be.exactly('ace');
      normalize('do\
        re                                      mi').should.be.exactly('ace');
    });

    it('should ignore non-tokenizable input', function() {
      normalize('do asdn3 aweh fnhi re 2hha 1nnua mi').should.be.exactly('ace');
    });
  });
});
