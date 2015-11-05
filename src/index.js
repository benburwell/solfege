// require built-in modules
var fs = require('fs');
var path = require('path');

// require external libs
var Hapi = require('hapi');
var Q = require('q');

// require custom libs
var utils = require('./utils');
var Squeuel = require('./squeuel');

var server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 8000
});

server.app.DB_URI = process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1/solfege';
server.app.query = new Squeuel(server.app.DB_URI).query;

server.views({
  engines: {
    html: require('handlebars')
  },
  path: path.join(__dirname, 'templates')
});

server.method('search', function(query, next) {
  var norm = utils.normalize(query);
  var sql = 'SELECT title, artist_name '
    + 'FROM songs '
    + 'JOIN phrase_song ON (songs.song_id = phrase_song.song_id) '
    + 'WHERE phrase_song.phrase_id IN '
      + '(SELECT phrase_id FROM phrases WHERE solfege LIKE $1) '
    + 'GROUP BY songs.song_id;';

  server.app.query(sql, [ '%' + norm + '%'])
    .then(function(results) {
      next(null, results.rows);
    })
    .catch(function(err) {
      next(err)
    })
    .done();
});

server.method('getSongsWithSimilarTitle', function(title, next) {
  var sql = 'SELECT song_id, title, artist_name '
    + 'FROM songs '
    + 'WHERE title @@ plainto_tsquery($1);';

  server.app.query(sql, [ title ])
    .then(function(results) {
      next(null, results);
    })
    .catch(function(err) {
      next(err);
    })
    .done();
});

server.method('addSongWithPhrase', function(options, next) {
  if (!options.title || !options.artist_name || !options.solfege) {
    return next(new Error('Missing required title, artist_name, or solfege'));
  }

  var solfege = utils.normalize(options.solfege);
  var song_id = null;
  var phrase_id = null;

  server.app.query('BEGIN;')
    .then(server.app.query('INSERT INTO songs (title, artist_name) VALUES ($1, $2) RETURNING song_id;', [
      options.title,
      options.artist_name
    ]))
    .then(function(results) {
      console.log('r1', results);
      song_id = results.rows[0];
    })
    .then(server.app.query('INSERT INTO phrases (solfege) VALUES ($1) RETURNING phrase_id;', [ solfege ]))
    .then(function(results) {
      console.log('r2', results);
      phrase_id = results.rows[0];
    })
    .then(server.app.query('INSERT INTO phrase_song (phrase_id, song_id) VALUES ($1, $2);', [ phrase_id, song_id ]))
    .then(server.app.query('COMMIT;'))
    .catch(function(err) {
      console.error(err);
    })
    .done();
});

server.method('addPhraseToSong', function(options, next) {
  if (!options.song_id || !options.phrase) {
    return next(new Error('Missing required song_id or phrase'));
  }

  var solfege = utils.normalize(options.phrase);
  var sql = 'INSERT INTO phrase_song (song_id, phrase_id) '
    + 'VALUES ($2, (SELECT phrase_id FROM phrases WHERE solfege=$3));';
  
  server.app.query('INSERT INTO phrases (solfege) VALUES ($1);', [ solfege ])
    .then(server.app.query(sql, [ options.song_id, solfege ]))
    .then(function(result) {
      next(null);
    })
    .catch(next)
    .done();
});

// search results
server.route({
  method: 'GET',
  path: '/search',
  handler: function(request, reply) {

    var q = request.query.q;

    server.methods.search(request.query.q, function(err, results) {
      if (err) {
        reply('Error processing query: ' + err);
      } else {
        reply.view('search_results', {
          original_query: q,
          normalized_query: utils.normalize(q),
          denormalized_query: utils.denormalize(utils.normalize(q)),
          results: results
        });
      }
    });
  }
});

// submit a song
server.route({
  method: 'GET',
  path: '/submit_song',
  handler: function(request, reply) {
    server.methods.getSongsWithSimilarTitle(request.query.title, function(err, songs) {
      if (err) {
        console.error(err)
        reply('Error');
      } else {
        if (songs.length > 0 && request.query.new != 1) {
          reply.view('submit_song_picklist', { phrase: request.query.phrase, songs: songs });
        } else {
          reply.view('submit_song_new', {
            title: request.query.title,
            phrase: request.query.phrase
          });
        }
      }
    });
  }
});

server.route({
  method: 'POST',
  path: '/submit_song',
  handler: function(request, reply) {
    server.methods.addSongWithPhrase({
      title: request.payload.title,
      artist_name: request.payload.artist,
      solfege: request.payload.phrase
    }, function(err) {
      if (err) {
        console.log(err);
        reply('Error processing request');
      } else {
        reply.redirect('/thanks.html');
      }
    });
  }
});

server.route({
  method: 'GET',
  path: '/add_phrase',
  handler: function(request, reply) {
    server.methods.addPhraseToSong({
      song_id: request.query.id,
      phrase: request.query.phrase
    }, function(err) {
      if (err) {
        console.error(err);
        reply('Error processing request');
      } else {
        reply.redirect('/thanks.html');
      }
    });
  }
});

// serve static files
server.route({
  method: 'GET',
  path: '/{filename*}',
  handler: {
    directory: {
      path: path.join(__dirname, 'assets')
    }
  }
});

if (!module.parent) {
  server.start(function() {
    console.log('Server running!');
  });
}

module.exports = server;
