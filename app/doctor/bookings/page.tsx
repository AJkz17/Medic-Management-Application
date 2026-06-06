'use client';
import { useState, useEffect } from 'react';
import { updateBookingStatus, claimAppointment } from '@/lib/actions'; 

export default function DoctorBookings() {
  const [bookings, setBookings] = useState([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(null);

  const fetchMyBookings = async () => {
    try {
      const res = await fetch('/api/doctor/my-bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) { console.error("Fetch failed", err); }
  };

  // NEW: Fetch doctor identity from your existing users session API
  const fetchIdentity = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const user = await res.json();
      if (user.role === 'doctor') {
        setCurrentDoctorId(user.id);
      }
    }
  };

  useEffect(() => { 
    fetchIdentity();
    fetchMyBookings(); 
  }, []);

  const handleStatusUpdate = async (id: number, status: number) => {
    setProcessingId(id);
    try {
      const result = await updateBookingStatus(id, status);
      if (result.success) await fetchMyBookings();
    } finally { setProcessingId(null); }
  };

  const handleClaim = async (appointmentId: number) => {
    if (!currentDoctorId) return alert("Session loading... please try again in a second.");

    setProcessingId(appointmentId);
    try {
      // Passes the doctor ID we got from the session
      const result = await claimAppointment(appointmentId, currentDoctorId) as {
        success: boolean; 
        message: string
      };
      if (result.success) {
        await fetchMyBookings();
      } else {
        alert(result.message);
      }
    } finally { setProcessingId(null); }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Appointment Management</h2>
        <span className="badge bg-primary px-3 py-2">{bookings.length} Total Found</span>
      </div>

      <div className="table-responsive bg-white p-4 rounded shadow-sm border">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Patient Name</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b: any) => (
                <tr key={b.id} className={!b.doctor_id ? "table-warning" : ""}>
                  <td>
                    <div className="fw-bold text-primary">{b.patient_name}</div>
                    {!b.doctor_id ? (
                      <span className="badge bg-dark text-white">UNASSIGNED</span>
                    ) : (
                      <small className="text-muted">ID: #{b.id}</small>
                    )}
                  </td>
                  <td>
                    <div>{new Date(b.appoint_date).toLocaleDateString('en-GB')}</div>
                    <small className="badge bg-light text-dark border">{b.appoint_time || 'TBD'}</small>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-3 ${
                      !b.doctor_id ? 'bg-secondary' :
                      b.appoint_status === 2 ? 'bg-success' : 
                      b.appoint_status === 3 ? 'bg-danger' : 'bg-warning text-dark'
                    }`}>
                      {!b.doctor_id ? 'Open' : 
                       b.appoint_status === 2 ? 'Confirmed' : 
                       b.appoint_status === 3 ? 'Declined' : 'Pending'}
                    </span>
                  </td>
                  <td className="text-end">
                    {!b.doctor_id ? (
                      <button
                        disabled={processingId === b.id}
                        onClick={() => handleClaim(b.id)}
                        className="btn btn-sm btn-primary px-4 shadow-sm"
                      >
                        {processingId === b.id ? 'Claiming...' : 'Claim Appointment'}
                      </button>
                    ) : (
                      b.appoint_status === 1 && (
                        <div className="btn-group">
                          <button 
                            disabled={processingId === b.id}
                            onClick={() => handleStatusUpdate(b.id, 2)} 
                            className="btn btn-sm btn-success px-3"
                          >Accept</button>
                          <button 
                            disabled={processingId === b.id}
                            onClick={() => handleStatusUpdate(b.id, 3)} 
                            className="btn btn-sm btn-outline-danger"
                          >Decline</button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-5 text-muted">No appointments available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}