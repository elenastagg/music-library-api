const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postSong } = require('../controllers/artistController');
const Artist = require('../models/artistModel');
const Album = require('../models/albumModel');
const Song = require('../models/songModel');

require('dotenv').config({
  path: path.join(__dirname, '../settings.env'),
});

describe('POST song endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });
  it('Should add a song to an album', (done) => {
    expect.assertions(3);
    const artist = new Artist({ name: 'The Meters', genre: 'Funk' });
    artist.save((artistCreatedError, artistCreated) => {
      if (artistCreatedError) {
        console.log(artistCreatedError);
      }
      const album = new Album([
        { name: 'Look-Ka Py Py', year: 1969 },
      ]);
      album.save((albumCreatedError, albumCreated) => {
        if (albumCreatedError) {
          console.log(albumCreatedError);
        };
        const request = httpMocks.createRequest({
          method: 'POST',
          url: `/album/${albumCreated._id}/song`,
          params: {
            albumId: albumCreated._id,
          },
          body: {
            name: 'Little Old Money Maker',
            artistId: artistCreated._id,
          },
        });
        const response = httpMocks.createResponse({
          eventEmitter: events.EventEmitter,
        });
        postSong(request, response);
        response.on('end', () => {
          const songCreated = JSON.parse(response._getData());
          expect(songCreated.name).toEqual('Little Old Money Maker');
          expect(songCreated.artist._id).toEqual(artistCreated._id.toString());
          expect(songCreated.album._id).toEqual(albumCreated._id.toString());
          done();
        });
      });
    });
  });
});

afterEach((done) => {
  Artist.collection.drop((artistDropErr) => {
    Album.collection.drop((albumDropErr) => {
      Song.collection.drop((songDropErr) => {
        if (artistDropErr || albumDropErr || songDropErr) {
          console.log('Cannot drop test collections');
        }
        done();
      });
    });
  });
});
afterAll((done) => {
  mongoose.connection.close(true, done);
});
