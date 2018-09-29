const mongoose = require('mongoose');
const path = require('path');
const httpMocks = require('node-mocks-http');
const events = require('events');
const { getAlbums } = require('../controllers/artistController');
const Album = require('../models/albumModel');

require('dotenv').config({
  path: path.join(__dirname, '../settings.env'),
});

describe('Album GET endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(process.env.TEST_DATABASE_CONN, { useNewUrlParser: true }, done);
  });
  it('should get the list of albums', (done) => {
    expect.assertions(2);
    const albums = [
      { name: 'Look-Ka Py Py', year: 1969 },
      { name: 'Fire on the Bayou', year: 1975 },
      { name: 'Rejuvenation', year: 1974 },
    ];
    Album.create(albums, (err) => {
      if (err) {
        console.log(err, 'Can\'t get list of albums');
      }
      const request = httpMocks.createRequest({
        method: 'GET',
        URL: '/albums/all',
      });

      const response = httpMocks.createResponse({
        eventEmitter: events.EventEmitter,
      });
      getAlbums(request, response);

      response.on('end', () => {
        const listOfAlbums = JSON.parse(response._getData());
        const expected = ['Look-Ka Py Py', 'Fire on the Bayou'];
        const albumsNames = listOfAlbums.map(listing => listing.name);
        expect(albumsNames).toEqual(expect.arrayContaining(expected));
        expect(listOfAlbums).toHaveLength(3);
        done();
      });
    });
  });
});

afterEach((done) => {
  Album.collection.drop((e) => {
    if (e) {
      console.log(e);
    }
    done();
  });
});

afterAll((done) => {
  mongoose.connection.close(true, done);
});
