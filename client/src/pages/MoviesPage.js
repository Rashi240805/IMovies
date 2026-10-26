import React, { useEffect, useState } from 'react';
import api from '../api';
import MovieCard from '../components/MovieCard';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies');
        setMovies(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movies.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="p-4 p-md-5 mb-4 rounded bg-primary bg-gradient text-white shadow-sm">
        <div className="col-md-8 px-0">
          <h1 className="display-5 fw-bold">Experience Cinema Like Never Before</h1>
          <p className="lead my-3">
            Book your favorite movies, pick your preferred seats, and enjoy real-time reservations.
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div className="row align-items-center mb-4 g-3">
        <div className="col-12 col-md-6">
          <h2 className="fw-bold mb-0">Now Showing</h2>
        </div>
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-secondary border-0 text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search by title or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h4>No movies found</h4>
          <p>Try searching for something else or check back later.</p>
        </div>
      ) : (
        <div className="row">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
