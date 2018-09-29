const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../controllers/artistController');
const Artist = require('../models/artistModel');
const Album = require('../models/albumModel');

require('dotenv').config({
  path: path.join(__dirname, '../settings.env'),
});

beforeAll((done) => {
  mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
});

describe('Album POST Endpoint', () => {
  it('should add an album to an artist', (done) => {
    expect.assertions(3);

    const artist = new Artist({
      name: 'Santana',
      genre: 'Latin Rock',
    });

    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'something went wrong');
      }

      const request = httpMocks.createRequest({
        method: 'POST',
        url: `/artist/${artistCreated._id}/album`,
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Abraxas',
          year: 1970,
        },
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      postAlbum(request, response);

      response.on('end', () => {
        const albumCreated = JSON.parse(response._getData());
        expect(albumCreated.name).toBe('Abraxas');
        expect(albumCreated.year).toBe(1970);
        expect(albumCreated.artist._id).toBe(artistCreated._id.toString());
        done();
      });
    });
  });
});

afterEach((done) => {
  Artist.collection.drop((artistDropErr) => {
    Album.collection.drop((albumDropErr) => {
      if (artistDropErr || albumDropErr) {
        console.log('Can not drop test collections');
      }
      done();
    });
  });
});

afterAll((done) => {
  mongoose.connection.close(true, done);
});
