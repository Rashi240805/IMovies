import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/movies/${id}/showtimes`)
        ]);
        setMovie(movieRes.data);
        setShowtimes(showtimesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Movie not found'}</div>
        <Link to="/" className="btn btn-outline-light">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link to="/" className="btn btn-sm btn-outline-secondary mb-4">
        &larr; Back to Movies
      </Link>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="img-fluid rounded shadow-lg w-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
            }}
          />
        </div>
        <div className="col-12 col-md-8">
          <h1 className="fw-bold mb-2">{movie.title}</h1>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge bg-warning text-dark fs-6">{movie.genre}</span>
            <span className="badge bg-secondary fs-6">
              <i className="bi bi-clock me-1"></i> {movie.duration} minutes
            </span>
          </div>

          <h5 className="text-warning mt-4 mb-2">Synopsis</h5>
          <p className="lead fs-6 text-light-50 lh-base">{movie.description}</p>
        </div>
      </div>

      <div className="border-top border-secondary pt-4">
        <h3 className="fw-bold mb-4">
          <i className="bi bi-calendar-event me-2 text-warning"></i>
          Select a Showtime
        </h3>

        {showtimes.length === 0 ? (
          <div className="alert alert-info bg-dark text-light border-secondary">
            No showtimes currently scheduled for this movie. Please check back later.
          </div>
        ) : (
          <div className="row g-3">
            {showtimes.map((st) => {
              const date = new Date(st.startTime);
              const formattedDate = date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              });
              const formattedTime = date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              });

              const availableCount = st.seats?.filter((s) => !s.isBooked).length || 0;

              return (
                <div key={st._id} className="col-12 col-sm-6 col-lg-4">
                  <div className="card h-100 p-3 border-secondary">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-warning">{formattedDate}</span>
                      <span className="badge bg-dark border border-secondary text-light">
                        {st.screen}
                      </span>
                    </div>
                    <h4 className="fw-bold text-white mb-2">{formattedTime}</h4>
                    <div className="d-flex justify-content-between text-muted small mb-3">
                      <span>Price: ${st.ticketPrice}</span>
                      <span className={availableCount < 5 ? 'text-danger fw-bold' : 'text-success'}>
                        {availableCount} seats left
                      </span>
                    </div>
                    <Link
                      to={`/showtime/${st._id}`}
                      className="btn btn-outline-warning w-100 mt-auto"
                    >
                      Pick Seats &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
