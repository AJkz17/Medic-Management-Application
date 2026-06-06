'use client';
import { useState, useEffect } from 'react';
import { createBooking } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    const historyRes = await fetch('/api/users/my-bookings');
    if (historyRes.ok) {
        const historyData = await historyRes.json();
        console.log("My Bookings Data:", historyData); // CHECK THIS IN BROWSER CONSOLE
        setHistory(historyData);
    }
  };

  useEffect(() => { fetchData(); }, []);

  async function handleSubmit(formData: FormData) {
    const result = await createBooking(formData);
    if (result.success) {
      alert("Booking successful!");
      fetchData(); // Refresh history list after booking
    } else {
      alert(result.message || "Something went wrong.");
    }
  }

  // Helper for Status Badges
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1: return <span className="badge bg-warning text-dark">Pending</span>;
      case 2: return <span className="badge bg-success">Accepted</span>;
      case 3: return <span className="badge bg-danger">Rejected</span>;
      default: return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* LEFT COLUMN: BOOKING FORM */}
        <div className="col-lg-5">
          <div className="card shadow border-0 p-4">
            <h3 className="text-primary fw-bold mb-4">Book Appointment</h3>
            <form action={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Select Doctor</label>
                <select name="doctor_id" className="form-select" required defaultValue="">
                  <option value="" disabled>Choose a specialist...</option>
                  {doctors.map((doc: any) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.department})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Preferred Date</label>
                <input type="date" name="appoint_date" className="form-control" min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Preferred Time</label>
                <input type="time" name="appoint_time" className="form-control" required />
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold">Confirm Booking</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: APPOINTMENT HISTORY */}
        <div className="col-lg-7">
          <div className="card shadow border-0 p-4 h-100">
            <h4 className="fw-bold mb-4">My Appointments</h4>
            <div className="table-responsive" style={{ maxHeight: '450px' }}>
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? (
                    history.map((item: any) => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-bold">{item.doctor_name || 'TBD'}</div>
                          <small className="text-muted fw-bold">Booking Ref: BK{item.id.toString().padStart(4, '0')}</small>
                        </td>
                        <td>
                          <div>{new Date(item.appoint_date).toLocaleDateString('en-GB')}</div>
                          <small className="text-muted">{item.appoint_time}</small>
                        </td>
                        <td>{getStatusBadge(item.appoint_status)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted">No appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}