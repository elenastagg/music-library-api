const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { deleteArtist } = require('../controllers/artistController');
const Artist = require('../models/artistModel');

require('dotenv').config({
  path: path.join(__dirname, '../settings.env'),
});

describe('Artist DELETE endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });

  it('should delete an artist document when DELETE is called', (done) => {
    expect.assertions(1);
    const artist = new Artist({ name: 'Bob Marley', genre: 'Jazz' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'DELETE',
        URL: 'artist/1234',
        params: {
          artistId: artistCreated._id,
        },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      deleteArtist(request, response);
      response.on('end', () => {
        Artist.findById(artistCreated._id, (error, noSuchArtist) => {
          expect(noSuchArtist).toBe(null);
          done();
        });
      });
    });
  });

  afterEach((done) => {
    Artist.collection.drop((e) => {
      if (e) {
        console.log(e);
      };
      done();
    });
  });

  afterAll((done) => {
    mongoose.connection.close(true, done);
  });
});
