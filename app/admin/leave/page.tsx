'use client';

import { useState, useEffect } from 'react';

export default function AdminLeaveApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRequests = async () => {
    try {
      const res = await fetch('/api/admin/leave-approval', { cache: 'no-store' });
      if (res.ok) setRequests(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllRequests(); }, []);

  const handleAction = async (id: number, statusCommand: number) => {
    try {
      const res = await fetch('/api/admin/leave-approval', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: statusCommand })
      });
      if (res.ok) {
        fetchAllRequests();
      }
    } catch (e) {
      alert("Action failed");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-danger fw-bold mb-4">📋 Staff Leave Approvals Control</h2>
      
      <div className="card shadow-sm border-0 p-4">
        <div className="table-responsive">
          {loading ? <p className="text-center py-3">Loading submissions...</p> : (
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Doctor Name</th>
                  <th>Requested Date</th>
                  <th>Reason Given</th>
                  <th>Current Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req: any) => (
                  <tr key={req.id}>
                    <td className="fw-bold text-dark">Dr. {req.doctor_name}</td>
                    <td className="small">{new Date(req.leave_date).toLocaleDateString('en-GB')}</td>
                    <td className="small text-secondary">{req.reason}</td>
                    <td>
                      {req.status === 1 && <span className="badge bg-warning text-dark">Pending</span>}
                      {req.status === 2 && <span className="badge bg-success">Approved</span>}
                      {req.status === 3 && <span className="badge bg-danger">Rejected</span>}
                    </td>
                    <td>
                      {req.status === 1 ? (
                        <>
                          <button onClick={() => handleAction(req.id, 2)} className="btn btn-sm btn-success me-2 fw-semibold">Approve</button>
                          <button onClick={() => handleAction(req.id, 3)} className="btn btn-sm btn-outline-danger fw-semibold">Reject</button>
                        </>
                      ) : (
                        <span className="text-muted small italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">No leave requests found in system queue.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}                        