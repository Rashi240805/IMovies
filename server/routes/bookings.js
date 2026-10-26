const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const authMiddleware = require('../middleware/auth');

// All booking routes require authentication
router.use(authMiddleware);

// POST /api/bookings - Create new booking
router.post('/', async (req, res, next) => {
  try {
    const { showtimeId, seats } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'showtimeId and at least one seat are required' });
    }

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if any selected seat is already booked
    const unavailableSeats = [];
    for (const seatNum of seats) {
      const existingSeat = showtime.seats.find((s) => s.seatNumber === seatNum);
      if (!existingSeat || existingSeat.isBooked) {
        unavailableSeats.push(seatNum);
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats unavailable or already booked: ${unavailableSeats.join(', ')}`
      });
    }

    // Atomically update seats in showtime
    // Using findOneAndUpdate with condition that none of these seats are booked
    const updateResult = await Showtime.findOneAndUpdate(
      {
        _id: showtimeId,
        seats: {
          $not: {
            $elemMatch: {
              seatNumber: { $in: seats },
              isBooked: true
            }
          }
        }
      },
      {
        $set: {
          ...seats.reduce((acc, seatNum) => {
            // Find index of seat in document
            const idx = showtime.seats.findIndex((s) => s.seatNumber === seatNum);
            if (idx !== -1) {
              acc[`seats.${idx}.isBooked`] = true;
              acc[`seats.${idx}.bookedBy`] = req.user.id;
            }
            return acc;
          }, {})
        }
      },
      { new: true }
    );

    if (!updateResult) {
      return res.status(400).json({
        message: 'Could not reserve seats. One or more seats were just booked by someone else.'
      });
    }

    const totalAmount = seats.length * showtime.ticketPrice;

    const booking = await Booking.create({
      user: req.user.id,
      showtime: showtimeId,
      seats,
      totalAmount,
      status: 'confirmed'
    });

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'showtime',
      populate: { path: 'movie' }
    });

    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/me - Get current user's bookings
router.get('/me', async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'showtime',
        populate: { path: 'movie' }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/bookings/:id - Cancel a booking and free seats
router.delete('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Free up seats in Showtime
    const showtime = await Showtime.findById(booking.showtime);
    if (showtime) {
      booking.seats.forEach((seatNum) => {
        const seat = showtime.seats.find((s) => s.seatNumber === seatNum);
        if (seat) {
          seat.isBooked = false;
          seat.bookedBy = null;
        }
      });
      await showtime.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
