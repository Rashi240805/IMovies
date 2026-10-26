import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';

const SeatSelectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [seatNotice, setSeatNotice] = useState('');

  const selectedSeatsRef = useRef(selectedSeats);
  selectedSeatsRef.current = selectedSeats;

  const fetchShowtime = useCallback(async (isPolling = false) => {
    try {
      const res = await api.get(`/showtimes/${id}`);
      const latestData = res.data;

      // If polling, check if any currently selected seat just got booked
      if (isPolling) {
        const currentlySelected = selectedSeatsRef.current;
        const newlyBooked = [];
        latestData.seats.forEach((seat) => {
          if (currentlySelected.includes(seat.seatNumber) && seat.isBooked) {
            newlyBooked.push(seat.seatNumber);
          }
        });

        if (newlyBooked.length > 0) {
          setSelectedSeats((prev) => prev.filter((s) => !newlyBooked.includes(s)));
          setSeatNotice(`Note: Seat(s) ${newlyBooked.join(', ')} were just reserved by another user.`);
        }
      }

      setShowtime(latestData);
    } catch (err) {
      if (!isPolling) {
        setError(err.response?.data?.message || 'Failed to load showtime details');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShowtime(false);

    // Poll seat availability every 4 seconds (Task 12: real-time polling without sockets)
    const interval = setInterval(() => {
      fetchShowtime(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchShowtime]);

  const handleSeatClick = (seatNumber) => {
    setError('');
    setSeatNotice('');
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/showtime/${id}` } });
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to continue.');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const res = await api.post('/bookings', {
        showtimeId: id,
        seats: selectedSeats
      });

      navigate(`/confirmation/${res.data.booking._id}`, {
        state: { booking: res.data.booking }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Some seats may have already been booked.');
      fetchShowtime(false); // Refresh seats immediately
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading seats...</span>
        </div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Showtime not found'}</div>
        <Link to="/" className="btn btn-outline-light">Back to Movies</Link>
      </div>
    );
  }

  const movie = showtime.movie || {};
  const showDate = new Date(showtime.startTime);
  const totalAmount = selectedSeats.length * showtime.ticketPrice;

  return (
    <div className="container py-4">
      {/* Header Info */}
      <div className="d-flex flex-wrap justify-content-between align-items-center pb-3 border-bottom border-secondary mb-4 gap-2">
        <div>
          <Link to={`/movies/${movie._id}`} className="text-secondary small text-decoration-none">
            &larr; {movie.title}
          </Link>
          <h2 className="fw-bold mb-0 text-white">{movie.title}</h2>
          <span className="text-light-50 small">
            {showtime.screen} &bull; {showDate.toLocaleDateString()} at {showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-end">
          <span className="badge bg-secondary p-2 me-2">Ticket: ${showtime.ticketPrice}</span>
          <span className="badge bg-success p-2">Live Availability</span>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {seatNotice && <div className="alert alert-warning">{seatNotice}</div>}

      <div className="row g-4">
        {/* Seats Visual Column */}
        <div className="col-12 col-lg-8">
          <div className="card p-3 border-secondary">
            <SeatGrid
              seats={showtime.seats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          </div>
        </div>

        {/* Booking Summary Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card p-4 border-secondary sticky-top" style={{ top: '80px' }}>
            <h4 className="fw-bold text-warning mb-3">Booking Summary</h4>
            <div className="mb-2 d-flex justify-content-between">
              <span className="text-light-50">Movie:</span>
              <span className="fw-semibold text-truncate ms-2" style={{ maxWidth: '180px' }}>{movie.title}</span>
            </div>
            <div className="mb-2 d-flex justify-content-between">
              <span className="text-light-50">Screen:</span>
              <span className="fw-semibold">{showtime.screen}</span>
            </div>
            <div className="mb-2 d-flex justify-content-between">
              <span className="text-light-50">Price per seat:</span>
              <span className="fw-semibold">${showtime.ticketPrice}</span>
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <span className="text-light-50">Selected Seats:</span>
              <span className="fw-bold text-success">
                {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'None'}
              </span>
            </div>

            <hr className="border-secondary" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fs-5 fw-bold">Total Price:</span>
              <span className="fs-4 fw-bold text-warning">${totalAmount}</span>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || bookingLoading}
              className="btn btn-warning btn-lg w-100 fw-bold"
            >
              {bookingLoading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Confirming...
                </span>
              ) : isAuthenticated ? (
                `Book ${selectedSeats.length} Seat${selectedSeats.length === 1 ? '' : 's'}`
              ) : (
                'Login to Book'
              )}
            </button>
            <p className="text-muted small text-center mt-2 mb-0">
              Real-time synchronization ensures no double bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
