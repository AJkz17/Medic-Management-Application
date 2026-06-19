'use client';
import { useState, useEffect } from 'react';
import { createBooking } from '@/lib/actions';
import { useRouter } from 'next/navigation';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/themes/material_blue.css"; 

import DoctorUpComing from '@/components/DoctorUpComing'; 

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const doctorsRes = await fetch('/api/doctor'); 
      if (doctorsRes.ok) {
        const doctorsData = await doctorsRes.json();
        const list = Array.isArray(doctorsData.doctors) ? doctorsData.doctors : Array.isArray(doctorsData) ? doctorsData : [];
        setDoctors(list);
        
        if (list.length > 0 && !selectedDoctor) {
          setSelectedDoctor(list[0].id.toString());
        }
      }

      const historyRes = await fetch('/api/users/my-bookings');
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // FIXED: Formats local dates to YYYY-MM-DD string without UTC shifting
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  async function handleSubmit(formData: FormData) {
    if (selectedDate) {
      // FIXED: Use local calendar string instead of selectedDate.toISOString()
      const cleanLocalDate = getLocalDateString(selectedDate);
      formData.set('appoint_date', cleanLocalDate);
    }
    const result = await createBooking(formData);
    if (result.success) {
      alert("Booking successful!");
      fetchData(); 
    } else {
      alert(result.message || "Something went wrong.");
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1: return <span className="badge bg-warning text-dark">Pending</span>;
      case 2: return <span className="badge bg-success">Accepted</span>;
      case 3: return <span className="badge bg-danger">Rejected</span>;
      default: return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  // FIXED: Parses incoming DB strings directly into DD/MM/YYYY format safely
  const renderTimezoneSafeDate = (dateVal: string | Date) => {
    if (!dateVal) return '';
    if (typeof dateVal === 'string') {
      const cleanString = dateVal.split('T')[0];
      if (cleanString.includes('-')) {
        const [year, month, day] = cleanString.split('-');
        return `${day}/${month}/${year}`;
      }
      return cleanString;
    }
    return dateVal.toLocaleDateString('en-GB');
  };

  return (
    <div className="container-fluid px-lg-5 py-5">
      <div className="row g-4">
        
        {/* LEFT & CENTER COMBINED SECTION (Expanded to col-lg-10) */}
        <div className="col-12 col-lg-10">
          <div className="row g-4">
            
            {/* BOOKING FORM COLUMN */}
            <div className="col-12 col-md-5">
              <div className="card shadow border-0 p-4 h-100">
                <h3 className="text-primary fw-bold mb-4 fs-5">Book Appointment</h3>
                <form action={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Doctor</label>
                    <select 
                      name="doctor_id" 
                      className="form-select form-select-sm" 
                      required 
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <option value="" disabled>Choose a specialist...</option>
                      {doctors.map((doc: any) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.department || 'General'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Preferred Date</label>
                    <Flatpickr
                      value={selectedDate || undefined}
                      onChange={([date]) => setSelectedDate(date || null)}
                      options={{ minDate: "today", dateFormat: "d-m-Y", disableMobile: true }}
                      className="form-control form-control-sm bg-white cursor-pointer"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Preferred Time</label>
                    <input type="time" name="appoint_time" className="form-control form-control-sm" required />
                  </div>
                  <button type="submit" className="btn btn-success btn-sm w-100 fw-bold">Confirm Booking</button>
                </form>
              </div>
            </div>

            {/* MY APPOINTMENTS HISTORY COLUMN */}
            <div className="col-12 col-md-7">
              <div className="card shadow border-0 p-4 h-100">
                <h4 className="fw-bold mb-4 fs-5">My Appointments</h4>
                <div className="table-responsive" style={{ maxHeight: '380px' }}>
                  <table className="table table-hover align-middle table-sm">
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
                              <div className="fw-bold text-dark small">{item.doctor_name || 'TBD'}</div>
                              <small className="text-muted text-xs">Dept: {item.department || 'General'}</small>
                            </td>
                            <td className="small">
                              <div>{renderTimezoneSafeDate(item.appoint_date)}</div>
                              <small className="text-muted">{item.appoint_time}</small>
                            </td>
                            <td>{getStatusBadge(item.appoint_status)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-4 text-muted small">No appointments found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT HAND COLUMN (Shrunk to col-lg-2) */}
        <div className="col-12 col-lg-2">
          <DoctorUpComing />
        </div>

      </div>
    </div>
  );
}