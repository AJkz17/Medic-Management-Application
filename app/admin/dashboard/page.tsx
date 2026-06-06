'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0); // New state for doctor count
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch Bookings
        const resBookings = await fetch('/api/admin/dashboard');
        const bookingsData = await resBookings.json();
        setAppointments(bookingsData);

        // 2. Fetch Doctor Stats (from the route we just updated)
        const resDocs = await fetch('/api/doctors');
        if (resDocs.ok) {
          const docsData = await resDocs.json();
          setTotalDoctors(docsData.totalDoctors); // Set the count from API
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Admin Control Panel</h2>
        <span className="badge bg-danger p-2 px-3">Administrator Mode</span>
      </div>

      <div className="row g-4">
        {/* Statistics Card: Total Bookings */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3 bg-primary text-white text-center">
            <h6 className="text-uppercase small fw-bold opacity-75">Total Bookings</h6>
            <h2 className="fw-bold mb-0">{appointments.length}</h2>
          </div>
        </div>

        {/* Statistics Card: Total Doctors (NEW BOX) */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3 bg-success text-white text-center">
            <h6 className="text-uppercase small fw-bold opacity-75">Medical Staff</h6>
            <h2 className="fw-bold mb-0">{totalDoctors}</h2>
          </div>
        </div>
      </div>

      {/* Management Table */}
      <div className="card shadow-sm border-0 mt-5">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">All Patient Appointments</h5>
        </div>
        <div className="table-responsive p-3">
          {loading ? (
            <p className="text-center py-3">Loading records...</p>
          ) : (
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Patient ID</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app: any) => (
                  <tr key={app.id}>
                    <td>User #{app.user_id}</td>
                    <td><span className="badge bg-info text-dark">{app.department}</span></td>
                    <td>{new Date(app.appoint_date).toLocaleDateString()}</td>
                    <td>
                      {app.appoint_status === 1 ? 
                        <span className="text-warning">● Pending</span> : 
                        <span className="text-success">● Confirmed</span>
                      }
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">Approve</button>
                      <button className="btn btn-sm btn-outline-danger">Cancel</button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-3">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}