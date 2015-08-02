module.exports = {
  // Take some solfege input and normalize it
  normalize: function(str) {
    var tokens = str.toLowerCase().split(/\s+/);
    var normalized = '';
    var table = {
      'do': 'a',
      'do+': 'b',
      'do#': 'b',
      'doh': 'a',
      'doh+': 'b',
      'doh#': 'b',
      're-': 'b',
      'reb': 'b',
      're': 'c',
      're+': 'd',
      're#': 'd',
      'mi-': 'd',
      'mib': 'd',
      'mi': 'e',
      'fa': 'f',
      'fa+': 'g',
      'fa#': 'g',
      'so-': 'g',
      'sob': 'g',
      'so': 'h',
      'so+': 'i',
      'so#': 'i',
      'sol-': 'g',
      'solb': 'g',
      'sol': 'h',
      'sol+': 'i',
      'sol#': 'i',
      'la-': 'i',
      'lab': 'i',
      'la': 'j',
      'la+': 'k',
      'la#': 'k',
      'ti-': 'k',
      'tib': 'k',
      'ti': 'l',
      'si-': 'k',
      'sib': 'k',
      'si': 'l'
    };

    for (var i = 0; i < tokens.length; i++) {
      if (table[tokens[i]]) {
        normalized += table[tokens[i]];
      }
    }

    return normalized;
  },

  // Take some solfege from the DB and translate it back
  // to something readable
  denormalize: function(str) {
    var table = {
      'a': 'do',
      'b': 'do+',
      'c': 're',
      'd': 're+',
      'e': 'mi',
      'f': 'fa',
      'g': 'fa+',
      'h': 'so',
      'i': 'so+',
      'j': 'la',
      'k': 'la+',
      'l': 'ti'
    };
    var ret = '';

    for (var i = 0; i < str.length; i++) {
      ret += table[str.charAt(i)] + ' ';
    }

    return ret.trim();
  }
};
