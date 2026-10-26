const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');

// GET /api/showtimes/:id - Get showtime details with seats
router.get('/:id', async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movie');
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    res.json(showtime);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
