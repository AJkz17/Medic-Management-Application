'use client';

import { useState, useEffect } from 'react';

export default function Wallet() {
  const [points, setPoints] = useState(0);

  // Fetch points from your new membership API route on load
  useEffect(() => {
    async function fetchPoints() {
      try {
        const res = await fetch('/api/membership/points');
        const data = await res.json();
        if (data.success) setPoints(data.points);
      } catch (err) {
        console.error("Failed to load points", err);
      }
    }
        fetchPoints();
    }, []);
  return (
    <div className="card bg-white p-4 rounded shadow-sm border-0">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="fw-bold mb-0 text-dark">My Member Wallet</h5>
        <span className="fs-4">🪙</span>
      </div>
      <p className="text-muted small mb-1">Available Balance</p>
      <div className="fs-3 fw-bold text-primary">{points} Points</div>
      <div className="mt-3 bg-light p-2 rounded small text-muted">
        ⭐ Tier Status: <span className="text-success fw-bold">Silver Member</span>
      </div>
    </div>
  );
}