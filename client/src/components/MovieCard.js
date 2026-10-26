import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <img
          src={movie.poster}
          className="card-img-top movie-poster-card"
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x600?text=No+Poster';
          }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold text-truncate" title={movie.title}>
            {movie.title}
          </h5>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-secondary">{movie.genre}</span>
            <span className="text-light-50 small">
              <i className="bi bi-clock me-1"></i>
              {movie.duration} mins
            </span>
          </div>
          <p className="card-text text-light-50 small flex-grow-1 line-clamp-2">
            {movie.description?.substring(0, 85)}...
          </p>
          <Link
            to={`/movies/${movie._id}`}
            className="btn btn-warning w-100 fw-semibold mt-auto"
          >
            Showtimes & Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
