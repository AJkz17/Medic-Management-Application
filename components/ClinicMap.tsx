'use client';

import React from 'react';

const Location = () => {
  return (
    <div className="card shadow border-0 p-3" style={{ height: '350px' }}>
      <h5 className="fw-bold text-dark mb-3 fs-6">📍 Locate Our Clinic</h5>
      
      {/* NATIVE IFRAME VISUAL CONTAINER BOUNDARY */}
      <div className="w-100 h-100 rounded" style={{ overflow: 'hidden' }}>
        <iframe
          src="https://maps.google.com/maps?q=3.0555033617724265,101.7006050844801&z=16&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </div>
  );
};

export default Location;