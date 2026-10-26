import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api';

const ConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await api.get('/bookings/me');
          const found = res.data.find((b) => b._id === id);
          if (found) {
            setBooking(found);
          } else {
            setError('Booking not found');
          }
        } catch (err) {
          setError('Failed to load booking details');
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id, booking]);

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading confirmation...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error || 'Booking details unavailable'}</div>
        <Link to="/my-bookings" className="btn btn-warning">View My Bookings</Link>
      </div>
    );
  }

  const movie = booking.showtime?.movie || {};
  const showDate = new Date(booking.showtime?.startTime);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card text-center border-success shadow-lg p-4 p-md-5">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success display-1"></i>
            </div>
            <h2 className="fw-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-light-50 mb-4">
              Your tickets are reserved. Please show this confirmation at the cinema counter.
            </p>

            <div className="bg-dark p-4 rounded text-start border border-secondary mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light-50">Booking ID:</span>
                <span className="font-monospace text-warning">{booking._id}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light-50">Movie:</span>
                <span className="fw-bold text-white">{movie.title || 'Movie'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light-50">Screen:</span>
                <span>{booking.showtime?.screen || 'Screen 1'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light-50">Date & Time:</span>
                <span>
                  {showDate.toLocaleDateString()} at {showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light-50">Seats:</span>
                <span className="badge bg-warning text-dark fs-6">
                  {booking.seats.join(', ')}
                </span>
              </div>
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total Paid:</span>
                <span className="fs-5 fw-bold text-success">${booking.totalAmount}</span>
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/my-bookings" className="btn btn-warning px-4">
                View My Bookings
              </Link>
              <Link to="/" className="btn btn-outline-light px-4">
                Browse More Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
