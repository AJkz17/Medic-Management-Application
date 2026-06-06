import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import Link from 'next/link';

export default async function Profile() {
    // 1. Session Protection
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id');
    
    if (!userId) {
        redirect('/login');
    }

    try {
        // 2. Database Query with Error Handling
        // Fetches username, email, IC, blood type, phone, and age
        const [rows]: any = await pool.query(
            'SELECT username, email, ic_number, blood_type, phone_number, age FROM users WHERE id = ?',
            [userId.value]
        );

        if (rows.length === 0) {
            redirect('/login');
        }

        const user = rows[0];

        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-primary text-white py-3">
                                <h4 className="mb-0">My Health Profile</h4>
                            </div>
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '80px', height: '80px' }}>
                                        <i className="bi bi-person-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                    <h3 className="fw-bold">{user.username}</h3>
                                </div>

                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="text-muted small fw-bold">Email Address</label>
                                        <p className="border-bottom pb-2 text-truncate">{user.email}</p>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small fw-bold">IC Number</label>
                                        <p className="border-bottom pb-2">{user.ic_number}</p>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small fw-bold">Phone Number</label>
                                        <p className="border-bottom pb-2">{user.phone_number || 'Not Set'}</p>
                                    </div>
                                    <div className="col-3">
                                        <label className="text-muted small fw-bold">Blood Type</label>
                                        <p className="border-bottom pb-2 text-danger fw-bold">{user.blood_type || 'N/A'}</p>
                                    </div>
                                    <div className="col-3">
                                        <label className="text-muted small fw-bold">Age</label>
                                        <p className="border-bottom pb-2">{user.age || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="mt-4 d-flex gap-2">
                                    <button className="btn btn-primary w-100 shadow-none">Edit Profile</button>
                                    {/* Using Link component for better performance over <a> tags */}
                                    <Link href="/dashboard" className="btn btn-outline-secondary w-100 shadow-none">
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Profile Load Error:", error);
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger">
                    Unable to load profile. Please ensure XAMPP MySQL is running.
                </div>
            </div>
        );
    }
}