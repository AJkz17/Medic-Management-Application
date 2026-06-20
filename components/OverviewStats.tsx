'use client';

import React from 'react';

const OverviewStats = () => {
  const stats = [
    { label: "Active Platform Users", value: "1.2k", subtitle: "Patients this month", icon: "bi-people text-primary" },
    { label: "Top 1% Patient Choice", value: "99%", subtitle: "Doctor satisfaction rate", icon: "bi-graph-up-arrow text-success" },
    { label: "Daily Appointments", value: "85+", subtitle: "Consultations handled", icon: "bi-check2-circle text-info" },
    { label: "Retention Rate", value: "4.8", subtitle: "Average star rating", icon: "bi-star text-warning" }
  ];

  return (
    <div className="row g-0 mb-4 rounded shadow-sm bg-white overflow-hidden">
      {stats.map((item, idx) => (
        <div 
          key={idx} 
          className="col-6 col-md-3 p-3 d-flex flex-column align-items-center justify-content-center text-center"
        >
          <div className="mb-2 fs-4">
            <i className={`bi ${item.icon}`}></i>
          </div>
          
          <div 
            className="d-flex align-items-center justify-content-center fw-bold text-dark mb-2 fs-5 rounded-circle"
            style={{ 
              width: '65px', 
              height: '65px',
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 2px rgba(108, 117, 125, 0.25)'
            }}
          >
            {item.value}
          </div>

          <span className="text-dark small fw-bold d-block mb-1">{item.label}</span>
          <span className="text-secondary opacity-75" style={{ fontSize: '0.75rem' }}>{item.subtitle}</span>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;