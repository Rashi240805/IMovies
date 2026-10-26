import React from 'react';

const SeatGrid = ({ seats = [], selectedSeats = [], onSeatClick }) => {
  // Group seats by row (e.g. 'A', 'B', 'C')
  const rows = {};
  seats.forEach((seat) => {
    const rowChar = seat.seatNumber.charAt(0);
    if (!rows[rowChar]) rows[rowChar] = [];
    rows[rowChar].push(seat);
  });

  // Sort rows and columns
  const sortedRowKeys = Object.keys(rows).sort();

  return (
    <div className="d-flex flex-column align-items-center w-100 my-4">
      {/* Screen Visualization */}
      <div className="screen-container text-center w-75 mb-4">
        <div className="cinema-screen mb-2"></div>
        <small className="text-secondary text-uppercase tracking-wider">Screen</small>
      </div>

      {/* Seat Rows */}
      <div className="seat-layout d-flex flex-column gap-2 mb-4">
        {sortedRowKeys.map((rowKey) => (
          <div key={rowKey} className="d-flex align-items-center gap-2">
            <span className="text-muted fw-bold me-2" style={{ width: '16px' }}>
              {rowKey}
            </span>
            <div className="d-flex gap-2">
              {rows[rowKey].map((seat) => {
                const isSelected = selectedSeats.includes(seat.seatNumber);
                const isBooked = seat.isBooked;

                let seatClass = 'seat-available';
                if (isBooked) {
                  seatClass = 'seat-booked';
                } else if (isSelected) {
                  seatClass = 'seat-selected';
                }

                return (
                  <button
                    key={seat.seatNumber}
                    type="button"
                    disabled={isBooked}
                    onClick={() => onSeatClick(seat.seatNumber)}
                    className={`seat ${seatClass}`}
                    title={isBooked ? `Seat ${seat.seatNumber} (Booked)` : `Seat ${seat.seatNumber}`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="d-flex flex-wrap justify-content-center gap-4 p-3 bg-secondary bg-opacity-10 rounded border border-secondary border-opacity-25">
        <div className="d-flex align-items-center gap-2">
          <span className="legend-box" style={{ backgroundColor: '#334155', border: '1px solid #475569' }}></span>
          <span className="small text-light-50">Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="legend-box" style={{ backgroundColor: '#22c55e' }}></span>
          <span className="small text-light-50">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="legend-box" style={{ backgroundColor: '#dc2626' }}></span>
          <span className="small text-light-50">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
