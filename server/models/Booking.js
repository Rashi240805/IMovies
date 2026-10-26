const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: [true, 'Showtime reference is required']
    },
    seats: {
      type: [String],
      required: [true, 'At least one seat must be selected'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Seats array cannot be empty'
      }
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required']
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
