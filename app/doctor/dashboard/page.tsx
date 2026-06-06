'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DoctorDashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, today: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const res = await fetch('/api/doctor/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
            setLoading(false);
        }
        fetchStats();
    }, []);

    return (
        <div className="container py-5">
            <div className="mb-4">
                <h2 className="fw-bold text-primary">Doctor Workspace</h2>
                <p className="text-muted">Welcome back! Here is your schedule overview for today.</p>
            </div>

            {/* Statistics Row */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-primary text-white p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-uppercase small">Today's Tasks</h6>
                                <h2 className="fw-bold mb-0">{stats.today}</h2>
                            </div>
                            <i className="bi bi-calendar-check fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-warning text-dark p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-uppercase small">Pending Requests</h6>
                                <h2 className="fw-bold mb-0">{stats.pending}</h2>
                            </div>
                            <i className="bi bi-clock-history fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-dark text-white p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-uppercase small">Total Patients</h6>
                                <h2 className="fw-bold mb-0">{stats.total}</h2>
                            </div>
                            <i className="bi bi-people fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Shortcut */}
            <div className="row">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-4">Quick Navigation</h5>
                        <div className="row g-3">
                            <div className="col-6">
                                <Link href="/doctor/bookings" className="btn btn-outline-primary w-100 py-3 text-start">
                                    <i className="bi bi-list-check me-2"></i> View All Bookings
                                </Link>
                            </div>
                            <div className="col-6">
                                <Link href="/doctor/leaveApply" className="btn btn-outline-danger w-100 py-3 text-start">
                                    <i className="bi bi-calendar-x me-2"></i> Manage My Leave
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-info-subtle">
                        <h5 className="fw-bold text-info-emphasis">System Note</h5>
                        <p className="small text-info-emphasis">
                            Please ensure all pending appointments are accepted or rescheduled 24 hours before the date to maintain hospital service standards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}