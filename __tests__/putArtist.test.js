const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { putArtist } = require('../controllers/artistController');
const Artist = require('../models/artistModel');

require('dotenv').config({
  path: path.join(__dirname, '../settings.env'),
});

describe('Artist PUT endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });

  it('should update an artist document when PUT is called', (done) => {
    expect.assertions(1);
    const artist = new Artist({ name: 'Norah Jones', genre: 'Jazz' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'stuff went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'PUT',
        URL: '/artist/1234',
        params: {
          artistId: artistCreated._id,
        },
        body: {
          name: 'Norah Jones',
          genre: 'Pop Folk',
        },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      putArtist(request, response);
      response.on('end', () => {
        const updatedArtist = JSON.parse(response._getData());
        expect(updatedArtist).toEqual({
          __v: 0,
          _id: artistCreated._id.toString(),
          name: 'Norah Jones',
          genre: 'Pop Folk',
        });
        done();
      })
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
    mongoose.disconnect().then(() => {
      setTimeout(done, 500);
    });
  });
});
