const Artist = require('../models/artistModel');
const Album = require('../models/albumModel');
const Song = require('../models/songModel');

exports.postArtist = (req, res) => {
  const artist = new Artist({ name: req.body.name, genre: req.body.genre, album: req.body.album });
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
      res.json('Artist does not exist');
    }
    const myAlbum = new Album({
      artist,
      name: req.body.name,
      year: req.body.year,
    });

    myAlbum.save((createErr, createdAlbum) => {
      if (createErr) {
        res.json('Could not create an album');
      }
      res.json(createdAlbum);
    });
  });
};

exports.getAlbums = (req, res) => {
  Album.find({}, (err, albums) => {
    if (err) {
      res.json('Something went wrong');
    }
    res.json(albums);
  });
};

exports.postSong = (req, res) => {
  Artist.findById(req.params.artistId, (errArtist, artist) => {
    if (errArtist) {
      res.json('Artist does not exist');
    }
    Album.findById(req.params.albumId, (errAlbum, album) => {
      if (errAlbum) {
        res.json('Album does not exist');
      }
      const mySong = new Song({
        artist,
        album,
        name: req.body.name,
      });

      mySong.save((createErr, createdSong) => {
        if (createErr) {
          res.json('Could not create a song');
        }
        res.json(createdSong);
      });
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
