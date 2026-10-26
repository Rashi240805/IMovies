require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const User = require('./models/User');
const Booking = require('./models/Booking');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';

const generateSeats = (rows = ['A', 'B', 'C', 'D', 'E'], cols = 8) => {
  const seats = [];
  rows.forEach((row) => {
    for (let c = 1; c <= cols; c++) {
      seats.push({
        seatNumber: `${row}${c}`,
        isBooked: false
      });
    }
  });
  return seats;
};

const sampleMovies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: 'Sci-Fi / Action',
    duration: 148,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: 'Action / Crime',
    duration: 152,
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: 'Adventure / Sci-Fi',
    duration: 169,
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genre: 'Action / Sci-Fi',
    duration: 166,
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clean old data
    await Booking.deleteMany({});
    await Showtime.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash('password123', salt);
    await User.create({
      name: 'Demo Cinephile',
      email: 'demo@imovies.com',
      password: demoPassword
    });
    console.log('Created demo user: demo@imovies.com / password123');

    // Insert movies
    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`Seeded ${createdMovies.length} movies.`);

    // Insert showtimes
    const now = new Date();
    const showtimes = [];

    createdMovies.forEach((movie) => {
      // 2 showtimes per movie: Today afternoon and evening
      const time1 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0);
      const time2 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 30);
      const time3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0);

      showtimes.push({
        movie: movie._id,
        startTime: time1,
        screen: 'IMAX Screen 1',
        ticketPrice: 15,
        seats: generateSeats()
      });

      showtimes.push({
        movie: movie._id,
        startTime: time2,
        screen: 'Dolby Cinema 2',
        ticketPrice: 18,
        seats: generateSeats()
      });

      showtimes.push({
        movie: movie._id,
        startTime: time3,
        screen: 'Screen 3',
        ticketPrice: 12,
        seats: generateSeats()
      });
    });

    await Showtime.insertMany(showtimes);
    console.log(`Seeded ${showtimes.length} showtimes with 40 seats each.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
