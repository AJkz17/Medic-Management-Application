'use client';
import { useState, useEffect } from 'react';
import { addPatient, deletePatient } from '@/lib/actions';

export default function ManagePatients() {
    const [patients, setPatients] = useState<any[]>([]);

    const fetchPatients = async () => {
        const res = await fetch('/api/patients', { cache: 'no-store' });
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : []);
    };

    useEffect(() => { fetchPatients(); }, []);

    const handleAction = async (promise: Promise<any>) => {
        const res = await promise;
        if (res.success) {
            fetchPatients();
            alert("Patient records updated!");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 fw-bold text-primary">Patient Database Management</h2>
        
        {/* ADD PATIENT FORM */}
            <div className="card p-4 mb-4 border-0 shadow-sm bg-light">
                <h5 className="mb-3">Register New Patient</h5>
                <form action={async (fd) => await handleAction(addPatient(fd))}>
                    <div className="row g-2 align-items-end">
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Name</label>
                            <input name="username" className="form-control" placeholder="Name" required />
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Email</label>
                            <input name="email" type="email" className="form-control" placeholder="Email" required />
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">IC Number</label>
                            <input name="ic_number" className="form-control" placeholder="IC Number" required />
                        </div>
                        <div className="col-md-2">
                            <label className="small fw-bold text-muted">Phone</label>
                            <input name="phone_number" className="form-control" placeholder="Phone" required />
                        </div>
                        <div className="col-md-1">
                            <label className="small fw-bold text-muted">Blood</label>
                            <select name="blood_type" className="form-select">
                                <option value="A+">A+</option><option value="B+">B+</option>
                                <option value="O+">O+</option><option value="AB+">AB+</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <label className="small fw-bold text-muted">Age</label>
                            <input name="age" type="number" className="form-control" placeholder="Age" />
                        </div>
                        <div className="col-md-2 text-end">
                            <button className="btn btn-primary w-100">Add Patient</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="table-responsive bg-white p-3 rounded shadow-sm">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th><th>Patient</th><th>IC Number</th><th>Blood</th><th>Age</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p: any) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td><strong>{p.username}</strong><br/><small>{p.email}</small></td>
                                <td>{p.ic_number}</td>
                                <td><span className="badge bg-danger">{p.blood_type}</span></td>
                                <td>{p.age}</td>
                                <td>
                                    <button onClick={() => handleAction(deletePatient(p.id))} className="btn btn-sm btn-outline-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}