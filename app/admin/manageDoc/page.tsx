'use client';   // enable interaction and browser APIs; placed at very top 

import { useState, useEffect } from 'react';   
import { addDoctor, deleteDoctor } from '@/lib/actions';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState<any[]>([]);

    const fetchDoctors = async () => {
        const res = await fetch('/api/admin/manageDoc', { cache: 'no-store' });
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleAction = async (promise: Promise<any>) => {
        const res = await promise;
        if (res.success) {
            fetchDoctors();
            alert(res.message || "Doctor records updated!");
        } else {
            alert("Error: " + res.message);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold text-primary">Medical Staff Management</h2>

            <div className="card p-4 mb-4 border-0 shadow-sm bg-light">
                <h5 className="mb-3">Register New Doctor</h5>
                <form action={async (fd) => await handleAction(addDoctor(fd))}>
                    <div className="row g-2 align-items-end">
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Full Name</label>
                            {/* name="username" will be processed by addDoctor server action */}
                            <input name="username" className="form-control" placeholder="Dr. Name" required />
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Email</label>
                            <input name="email" type="email" className="form-control" placeholder="email@hosp.com" required />
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Department</label>
                            <select name="department" className="form-select" required>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General">General Medicine</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Specialization</label>
                            <input name="specialization" className="form-control" placeholder="e.g. Surgeon" required />
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Phone</label>
                            <input name="phone_number" className="form-control" placeholder="Contact No." required />
                        </div>
                        <div className="col-md-2 text-end">
                            <button className="btn btn-primary w-100 fw-bold">Add Doctor</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="table-responsive bg-white p-3 rounded shadow-sm">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Doctor Detail</th>
                            <th>Department</th>
                            <th>Specialization</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.length > 0 ? (
                            doctors.map((d: any) => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td>
                                        <strong>{d.name}</strong><br/>
                                        <small className="text-muted">{d.email}</small>
                                    </td>
                                    <td>
                                        <span className="badge bg-info text-dark">{d.department}</span>
                                    </td>
                                    <td>{d.specialism}</td>
                                    <td>
                                        <span className={`badge ${d.status === 'Available' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            onClick={() => {
                                                if(confirm("Delete this doctor?")) handleAction(deleteDoctor(d.id))
                                            }} 
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-muted">No doctors found in database.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}