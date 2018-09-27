const Artist = require('../models/artistModel');

exports.postArtist = (req, res) => {
  const artist = new Artist({ name: req.body.name, genre: req.body.genre, album: req.body.album, });
  artist.save((err, artistCreated) => {
    res.json(artistCreated);
  });
};

exports.listArtists = (req, res) => {
  Artist.find({}, (err, artists) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(artists);
  });
};

exports.getArtist = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(artist);
  });
};

exports.putArtist = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    artist.set({ name: req.body.name });
    artist.set({ genre: req.body.genre });
    artist.set({ albums: req.body.albums });

    artist.save((updateErr, artistUpdated) => {
      if (updateErr) {
        res.json('Could not update');
      }
      res.json(artistUpdated);
    });
  });
};

exports.postAlbum = (req, res) => {
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    artist.set({ albums: artist.albums.concat([req.body]) });
    artist.save((updatedErr, artistUpdated) => {
      if (updatedErr) {
        res.json('Could not update');
      }
      res.json(artistUpdated);
    });
  });
};

exports.deleteArtist = (req, res) => {
  Artist.findByIdAndDelete(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.send(artist === null);
  });
};
