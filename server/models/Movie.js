const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration in minutes is required']
    },
    poster: {
      type: String,
      required: [true, 'Poster image URL is required']
    },
    releaseDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
