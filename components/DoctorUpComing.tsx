'use client';

import React, { useEffect, useRef, useState } from 'react';

const DoctorUpcoming: React.FC = () => {
  const [busySlots, setBusySlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const slotsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      setLoading(true);

      try {
        const res = await fetch('/api/doctor/Upcoming');

        if (res.ok) {
          const data = await res.json();
          setBusySlots(data);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorSchedule();
  }, []);

  // Automatically move the scrollbar to the bottom
  useEffect(() => {
    const container = slotsContainerRef.current;

    if (container && busySlots.length > 0) {
      container.scrollTop = container.scrollHeight;
    }
  }, [busySlots]);

  const displayFormattedDate = (dateStr: string) => {
    if (!dateStr) return '';

    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }

    return dateStr;
  };

  return (
    <div>
      <h6
        className="fw-bold text-dark mb-2 text-uppercase tracking-wider text-muted"
        style={{ fontSize: '11px' }}
      >
        Upcoming Booked Slots
      </h6>

      {loading ? (
        <div
          className="text-center py-3 text-muted"
          style={{ fontSize: '11px' }}
        >
          Loading...
        </div>
      ) : busySlots.length > 0 ? (
        <div
          ref={slotsContainerRef}
          className="d-flex flex-column gap-2"
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {busySlots.map((slot: any, idx: number) => (
            <div key={idx} className="row g-1 flex-column">
              <div className="col-12 mb-1">
                <div className="p-1 bg-light rounded text-center border border-primary">
                  <span className="text-primary fw-bold text-xs d-block text-truncate">
                    {slot.doctor_name || 'Doctor'}
                  </span>
                </div>
              </div>

              <div className="col-12">
                <div className="p-1 bg-light rounded text-center border border-danger">
                  <span
                    className="text-danger fw-bold text-xs d-block"
                    style={{ fontSize: '10px' }}
                  >
                    {displayFormattedDate(slot.appoint_date)} @{' '}
                    {slot.appoint_time?.slice(0, 5)}
                  </span>
                </div>
              </div>

              <hr className="my-1 text-muted opacity-25" />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-3 bg-light rounded text-muted border"
          style={{ fontSize: '11px' }}
        >
          Fully Available
        </div>
      )}
    </div>
  );
};

export default DoctorUpcoming;