// require built-in modules
var fs = require('fs');
var path = require('path');

// require external libs
var Hapi = require('hapi');

// require custom libs
var utils = require('./utils');

var server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: process.env.PORT || 8000
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: path.join(__dirname, 'templates')
});

server.register({
  register: require('hapi-postgres'),
  options: {
    uri: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1/solfege'
  }
}, function(err) {
  if (err) {
    console.error('Failed to load hapi-postgres', err);
  }
});

server.method('search', function(query, next) {
  var client = server.plugins['hapi-postgres'].client;
  var done = server.plugins['hapi-postgres'].done;

  var norm = utils.normalize(query);

  var sql = 'SELECT title, artist_name FROM songs JOIN phrase_song ON (songs.song_id = phrase_song.song_id) WHERE phrase_song.phrase_id IN (SELECT phrase_id FROM phrases WHERE solfege LIKE \'%' + norm + '%\') GROUP BY songs.song_id;';
  return client.query(sql, function(err, results) {
    done();

    if (err) {
      next(err);
    } else {
      next(null, results.rows);
    }
  });
});

server.method('getSongsWithSimilarTitle', function(title, next) {
  var client = server.plugins['hapi-postgres'].client;
  var done = server.plugins['hapi-postgres'].done;

  var sql = 'SELECT song_id, title, artist_name FROM songs WHERE title @@ plainto_tsquery(\'' + title + '\');';
  return client.query(sql, function(err, results) {
    done();
    if (err) {
      next(err);
    } else {
      next(null, results.rows);
    }
  });
});

server.method('addSongWithPhrase', function(options, next) {
  var client = server.plugins['hapi-postgres'].client;
  var done = server.plugins['hapi-postgres'].done;

  if (!options.title || !options.artist_name || !options.solfege) {
    done();
    return next(new Error('Missing required title, artist_name, or solfege'));
  }

  options.solfege = utils.normalize(options.solfege);
  var sql = 'INSERT INTO songs (title, artist_name) VALUES (\'' + options.title + '\', \'' + options.artist_name + '\'); INSERT INTO phrases (solfege) VALUES (\'' + options.solfege + '\'); INSERT INTO phrase_song (song_id, phrase_id) VALUES ((SELECT CURRVAL(\'songs_song_id_seq\')), (SELECT CURRVAL(\'phrases_phrase_id_seq\')));';
  return client.query(sql, function(err, results) {
    done();
    if (err) {
      next(err);
    } else {
      next(null);
    }
  });
});

server.method('addPhraseToSong', function(options, next) {
  var client = server.plugins['hapi-postgres'].client;
  var done = server.plugins['hapi-postgres'].done;

  if (!options.song_id || !options.phrase) {
    done();
    return next(new Error('Missing required song_id or phrase'));
  } else {
    var solfege = utils.normalize(options.phrase);
    var sql = 'INSERT INTO phrases (solfege) VALUES (\'' + solfege + '\'); INSERT INTO phrase_song (song_id, phrase_id) VALUES (' + options.song_id + ', (SELECT phrase_id FROM phrases WHERE solfege=\'' + solfege + '\'));';
    return client.query(sql, function(err, results) {
      done();

      if (err) {
        next(new Error('Error adding phrase to song'));
      } else {
        next(null);
      }
    });
  }
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

server.start(function() {
  console.log('Server running!');
});