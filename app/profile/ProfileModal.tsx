'use client';

import { useRouter } from 'next/navigation';

export default function ProfileModal({ user, onClose, onLogout }: { user: any; onClose: () => void; onLogout: () => Promise<void> }) {
  const router = useRouter();

  // Logic: If there's no username or the email contains 'admin', treat as Admin
  const isAdmin = !user?.username || user?.role === 'admin';

  const handleLogout = async () => {
    try {
      await onLogout();

      document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      onClose();
      window.location.href = '/login'; 
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="position-fixed top-0 inset-s-0-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
      
      <div className="card shadow-lg border-0 p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className={`${isAdmin ? 'text-danger' : 'text-primary'} fw-bold mb-0`}>
            {isAdmin ? "Admin Profile" : "User Profile"}
          </h4>
          <button onClick={onClose} className="btn-close shadow-none"></button>
        </div>

        <div className="text-center mb-4">
          <div className={`${isAdmin ? 'bg-danger-subtle' : 'bg-light'} rounded-circle d-inline-flex align-items-center justify-content-center mb-2`} style={{ width: '70px', height: '70px' }}>
            <i className={`bi ${isAdmin ? 'bi-shield-lock-fill text-danger' : 'bi-person-fill text-primary'}`} style={{ fontSize: '2.2rem' }}></i>
          </div>
          <h5 className="fw-bold mb-0">{isAdmin ? "System Administrator" : user?.username}</h5>
          {isAdmin && <p className="text-muted small mb-0">{user?.email}</p>}
        </div>

        <div className="row g-3">
          {/* Email: Always shown for both */}
          <div className="col-12 border-bottom pb-2">
            <label className="text-muted small fw-bold d-block text-uppercase">Email Address</label>
            <span className="text-dark">{user?.email}</span>
          </div>

          {/* Conditional Rendering: Only show medical info for Patients */}
          {!isAdmin ? (
            <>
              <div className="col-6 border-bottom pb-2">
                <label className="text-muted small fw-bold d-block text-uppercase">IC Number</label>
                <span className="text-dark">{user?.ic_number}</span>
              </div>
              <div className="col-6 border-bottom pb-2">
                <label className="text-muted small fw-bold d-block text-uppercase">Blood Type</label>
                <span className="text-danger fw-bold">{user?.blood_type}</span>
              </div>
              <div className="col-6 border-bottom pb-2">
                <label className="text-muted small fw-bold d-block text-uppercase">Phone</label>
                <span className="text-dark">{user?.phone_number || 'Not Set'}</span>
              </div>
              <div className="col-6 border-bottom pb-2">
                <label className="text-muted small fw-bold d-block text-uppercase">Age</label>
                <span className="text-dark">{user?.age}</span>
              </div>
            </>
          ) : (
            /* Admin Specific Content */
            <div className="col-12">
              <div className="p-3 bg-light rounded border border-danger-subtle">
                <small className="text-danger d-flex align-items-center gap-2 fw-bold">
                  <i className="bi bi-info-circle"></i> Administrative Account
                </small>
                <p className="small text-muted mb-0 mt-1">You have full access to manage appointments, patients, and system settings.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 d-grid gap-2">
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout Account
          </button>
          <button className="btn btn-light" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}