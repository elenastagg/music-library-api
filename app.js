const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const { postArtist, listArtists, getArtist } = require('./controllers/artistController.js');

require('dotenv').config({
  path: path.join(__dirname, 'settings.env'),
});

const app = express();

mongoose.connect(process.env.DATABASE_CONN, { useNewUrlParser: true });
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello MongoDB!'));
app.post('/artist', postArtist);
app.get('/artist/all', listArtists);
app.get('/artist/:artistId', getArtist);

app.listen(3000, () => console.log('It works!'));
