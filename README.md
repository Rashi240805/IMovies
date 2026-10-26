# IMovies - Online Cinema Booking Platform

IMovies is a modern, responsive online cinema platform where users can browse movies, view showtimes, and reserve seats with real-time seat availability synchronization.

## 🚀 Tech Stack

- **Frontend**: React.js, React Router v6, Bootstrap 5, Axios, Bootstrap Icons
- **Backend**: Node.js (>=16), Express.js, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs
- **API Testing**: Postman Collection (`server/imovies.postman_collection.json`)

---

## 📁 Project Structure

```
imovies/
├── server/
│   ├── models/            # User, Movie, Showtime, Booking Mongoose models
│   ├── routes/            # auth, movies, showtimes, bookings API routes
│   ├── middleware/        # JWT auth verification middleware
│   ├── seed.js            # Database seeding script with sample movies & seats
│   ├── server.js          # Express app entry point
│   ├── .env.example       # Example environment variables
│   └── imovies.postman_collection.json
├── client/
│   ├── public/            # index.html & static assets
│   └── src/
│       ├── components/    # Navbar, SeatGrid, MovieCard, ProtectedRoute
│       ├── context/       # AuthContext (JWT management & session)
│       ├── pages/         # Movies, MovieDetail, SeatSelection, Confirmation, MyBookings, Login, Register
│       ├── api.js         # Axios instance with auth interceptor
│       ├── App.js         # Routing configuration
│       └── App.css        # Custom cinema styling & screen visuals
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (>= 16)
- MongoDB running locally on port 27017 or a MongoDB Atlas URI

### 1. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (or copy `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=your_jwt_secret_key_here
```

Seed initial movie catalog and showtimes with 40 seats each:
```bash
npm run seed
```
> Demo account created: `demo@imovies.com` / `password123`

Start the server:
```bash
# Production mode
npm start

# Or development mode (with nodemon)
npm run dev
```
The server will run at `http://localhost:5000`.

---

### 2. Client Setup

```bash
cd client
npm install
npm start
```
The React application will open at `http://localhost:3000`.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate user & return JWT
- `GET /api/auth/me` - Get profile (Protected)

### Movies
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/:id/showtimes` - Get showtimes for movie

### Showtimes & Seats
- `GET /api/showtimes/:id` - Get showtime details with live seat matrix (polled in real time)

### Bookings (Protected)
- `POST /api/bookings` - Atomically reserve selected seats & confirm booking
- `GET /api/bookings/me` - List user's booked tickets
- `DELETE /api/bookings/:id` - Cancel booking and free up reserved seats

---

## 🎟️ Key Features
- **Real-Time Seat Availability**: Polls seat status periodically to prevent double bookings.
- **Atomic Booking Operations**: Prevents race conditions when multiple users attempt to reserve the same seat.
- **Seat Cancellation**: Automatically releases seats back to the pool when a reservation is cancelled.
- **Protected Routes**: Smooth client-side redirect to login when guest attempts to book, returning after authentication.
