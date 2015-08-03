var pg = require('pg');
var fs = require('fs');

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  if (err) {
    return console.error('Unable to connect to datbase', err);
  }

  fs.readFile('schema.sql', function(err, sql) {
    if (err) {
      return console.error('Unable to read SQL file', err);
    }

    client.query(sql, function(err) {
      if (err) {
        return console.error('Error running SQL query', err);
      }

      console.log('Database created');
      done();
    });
  });
});
