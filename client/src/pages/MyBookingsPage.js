import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/me');
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will release your seats.')) {
      return;
    }

    setCancellingId(bookingId);
    setError('');
    setActionMessage('');

    try {
      await api.delete(`/bookings/${bookingId}`);
      setActionMessage('Booking successfully cancelled and seats freed.');
      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="bi bi-ticket-perforated me-2 text-warning"></i>
          My Bookings
        </h2>
        <Link to="/" className="btn btn-outline-light btn-sm">
          Browse Movies
        </Link>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading bookings...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-5 border-secondary">
          <i className="bi bi-calendar-x text-muted display-4 mb-3"></i>
          <h4>No bookings found</h4>
          <p className="text-light-50">You haven't made any cinema reservations yet.</p>
          <div className="mt-3">
            <Link to="/" className="btn btn-warning">Explore Movies</Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => {
            const movie = b.showtime?.movie || {};
            const showDate = b.showtime?.startTime ? new Date(b.showtime.startTime) : null;
            const isCancelled = b.status === 'cancelled';

            return (
              <div key={b._id} className="col-12 col-md-6">
                <div className={`card h-100 p-4 border ${isCancelled ? 'border-danger opacity-75' : 'border-secondary'}`}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="fw-bold mb-1">{movie.title || 'Movie'}</h4>
                      <span className="text-light-50 small">
                        {b.showtime?.screen || 'Screen 1'} &bull;{' '}
                        {showDate
                          ? `${showDate.toLocaleDateString()} at ${showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : 'Showtime TBD'}
                      </span>
                    </div>
                    <span className={`badge ${isCancelled ? 'bg-danger' : 'bg-success'}`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-dark p-3 rounded mb-3 border border-secondary border-opacity-50">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-light-50">Seats:</span>
                      <span className="fw-bold text-warning">{b.seats.join(', ')}</span>
                    </div>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-light-50">Total:</span>
                      <span className="fw-bold">${b.totalAmount}</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-light-50">Booked on:</span>
                      <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-auto d-flex justify-content-end">
                    {!isCancelled ? (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="btn btn-sm btn-outline-danger"
                      >
                        {cancellingId === b._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    ) : (
                      <span className="text-danger small fw-semibold">Seats Released</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
