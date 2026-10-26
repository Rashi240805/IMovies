const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { _id: false }
);

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required']
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    screen: {
      type: String,
      required: [true, 'Screen name is required'],
      default: 'Screen 1'
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      default: 12
    },
    seats: [seatSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Showtime', showtimeSchema);
