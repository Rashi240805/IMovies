const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

// GET /api/movies - List all movies
router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

// GET /api/movies/:id - Get single movie
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

// GET /api/movies/:id/showtimes - Get showtimes for a specific movie
router.get('/:id/showtimes', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const showtimes = await Showtime.find({ movie: req.params.id }).sort({ startTime: 1 });
    res.json(showtimes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
