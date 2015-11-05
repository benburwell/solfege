var Q = require('q');
var pg = require('pg');

var Squeuel = function(uri) {
  this.uri = uri;
  var self = this;
};

Squeuel.prototype.setUri = function(uri) {
  this.uri = uri;
};

// Run a query and return a promise
Squeuel.prototype.query = function(statement, binding) {
  var deferred = Q.defer();
  console.log('query', self.uri);

  // Grab a client from the pool
  pg.connect(self.uri, function(err, client, done) {
    
    // Catch error getting client
    if (err) {
      deferred.reject(new Error(err));
    } else {

      if (binding) {
        // query the client
        client.query(statement, binding, function(err, results) {
          
          // Release client back to pool
          done();

          // Catch error running query
          if (err) {
            deferred.reject(new Error(err));
          } else {
            deferred.resolve(results);
          }
        });
      } else {
        // query the client
        client.query(statement, function(err, results) {
          
          // Release client back to pool
          done();

          // Catch error running query
          if (err) {
            deferred.reject(new Error(err));
          } else {
            deferred.resolve(results);
          }
        });
      }
    }
  });

  // Finally, return our promise!
  return deferred.promise;
};

module.exports = Squeuel;
