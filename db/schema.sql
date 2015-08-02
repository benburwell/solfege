-- Create the phrase table
-- This will hold the phrases with an associated ID
-- Phrases will be varchars of solfege syllables normalized as:
--   a = do
--   b = do+/re-
--   c = re
--   d = re+/mi-
--   e = mi
--   f = fa
--   g = fa+/so-
--   h = so
--   i = so+/la-
--   j = la
--   k = la+/ti-
--   l = ti
CREATE TABLE IF NOT EXISTS phrases (
  phrase_id BIGSERIAL PRIMARY KEY,
  solfege VARCHAR(30) NOT NULL UNIQUE
);

-- Create a table that allows us to have a many-to-many
-- relationship between phrases and songs (i.e., a phrase can be
-- contained within multiple songs, and a song can have multiple phrases).
CREATE TABLE IF NOT EXISTS phrase_song (
  phrase_id BIGINT NOT NULL,
  song_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS songs (
  song_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255),
  artist_name VARCHAR(255)
);

-- Now we need an index that will allow us to search more quickly for phrases
CREATE UNIQUE INDEX phrases_solfege ON phrases (solfege);
