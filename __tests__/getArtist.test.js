const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { getArtist, listArtists } = require('../controllers/artistController');
const Artist = require('../models/artistModel');

require('dotenv').config({
  path: path.join(__dirname, '../settings.env'),
});

describe('Artist GET endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });
  it('should get an artist by id', (done) => {
    expect.assertions(2);
    const artist = new Artist({ name: 'Beastie Boys', genre: 'HipHop' });
    artist.save((err, artistCreated) => {
      if (err) {
        console.log(err, 'something went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/artist/1234',
        params: {
          artistId: artistCreated._id,
        },
      });
      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });

      getArtist(request, response);
      response.on('end', () => {
        const artistFound = JSON.parse(response._getData());
        expect(artistFound.name).toBe('Beastie Boys');
        expect(artistFound.genre).toBe('HipHop');
        done();
      });
    });
  });

  it('should get the list of artists', (done) => {
    expect.assertions(2);
    const artists = [
      { name: 'Beastie Boys', genre: 'HipHop' },
      { name: 'Paul Simon', genre: 'Folk' },
      { name: 'Red Hot Chili Peppers', genre: 'Rock' },
    ];
    Artist.create(artists, (err) => {
      if (err) {
        console.log(err, 'something went wrong');
      }
      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/artist/all',
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      listArtists(request, response);

      response.on('end', () => {
        const listOfArtists = JSON.parse(response._getData());
        const expected = ['Beastie Boys', 'Paul Simon'];
        const artistNames = listOfArtists.map(listing => listing.name);
        expect(artistNames).toEqual(expect.arrayContaining(expected));
        expect(listOfArtists).toHaveLength(3);
        done();
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
