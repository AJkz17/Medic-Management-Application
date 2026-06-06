'use client';

import { useState, useEffect } from 'react';

export default function DoctorLeavePage() {
  const [leaveDate, setLeaveDate] = useState('');
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaveHistory = async () => {
    try {
      const res = await fetch('/api/doctor/leave', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaveHistory(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/doctor/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leave_date: leaveDate, reason })
      });

      if (res.ok) {
        alert("Leave application sent to Admin!");
        setLeaveDate('');
        setReason('');
        fetchLeaveHistory();
      }
    } catch (error) {
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-primary fw-bold mb-4">🩺 Apply Medical Leave</h2>
      
      <div className="row g-4">
        {/* Form Column */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light">
            <h5 className="fw-bold text-dark mb-3">Request Time Off</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Target Date</label>
                <input type="date" className="form-control" value={leaveDate} required onChange={(e) => setLeaveDate(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Reason / Coverage Details</label>
                <textarea className="form-control" rows={3} placeholder="State reason..." value={reason} required onChange={(e) => setReason(e.target.value)}></textarea>
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-bold">
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>

        {/* History Column */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold text-dark mb-3">Your Application History</h5>
            <div className="table-responsive">
              {loading ? <p className="text-muted small">Loading past logs...</p> : (
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item: any) => (
                      <tr key={item.id}>
                        <td className="small fw-semibold">{new Date(item.leave_date).toLocaleDateString('en-GB')}</td>
                        <td className="small text-muted">{item.reason}</td>
                        <td>
                          {item.status === 1 && <span className="badge bg-warning text-dark">Pending</span>}
                          {item.status === 2 && <span className="badge bg-success">Approved</span>}
                          {item.status === 3 && <span className="badge bg-danger">Rejected</span>}
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && <tr><td colSpan={3} className="text-center text-muted py-3 small">No applications found.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}