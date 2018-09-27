const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { postAlbum } = require('../controllers/artistController');
const Artist = require('../models/artistModel');

require('dotenv').config({
  path: path.join(__dirname, '../settings.env'),
});

describe('Album POST Endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });
  it('should add an album to an artist', (done) => {
    expect.assertions(1);
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
        url: '/artist/${artistCreated._id}/album',
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Abraxas',
          year: '1970',
        },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      postAlbum(request, response);
      response.on('end', () => {
        Artist.findById(artistCreated._id, (error, foundArtist) => {
          console.log(foundArtist);
          expect(foundArtist.albums.length).toEqual(1);
          done();
        });
      });
    });
  });

  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      }
      done();
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
