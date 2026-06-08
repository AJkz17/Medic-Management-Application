'use client';

import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AppointmentModal from "./appointmentModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Chatbot from "@/components/Chatbot"; // Import Chatbot Component
import Advertise from "@/components/AdvertisingSlider"; //Import advertise component

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchAppointments();
  }, []);

  // HELPER: Convert any date object to a "YYYY-MM-DD" string without timezone shifting
  const formatDateString = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Filter: Shows all bookings for the clicked date
  const dailyAgenda = appointments.filter(app => {
    if (!app || !app.appoint_date) return false;
    return formatDateString(app.appoint_date) === formatDateString(selectedDate);
  });

  // Highlight Logic
  const getTileClass = ({ date, view }: { date: Date, view: string }) => {
    if (view !== 'month') return '';
    
    const dateStr = formatDateString(date);
    const dayApps = appointments.filter(a => 
      a?.appoint_date && formatDateString(a.appoint_date) === dateStr
    );

    if (dayApps.length === 0) return '';

    if (dayApps.some(a => a.appoint_status === 3)) return 'status-rejected';
    if (dayApps.some(a => a.appoint_status === 1)) return 'status-pending';
    if (dayApps.some(a => a.appoint_status === 2)) return 'status-accepted';
    
    return '';
  };

  return (
    <div className="container py-4 position-relative">
      
      <Advertise />

      <h2 className="mb-4 text-primary fw-bold">Patient Dashboard</h2>
      
      {/* Calendar and Appointment List */}
      <div className="row g-4 mb-5">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold text-secondary mb-3">Select a Date</h5>
            <div className="d-flex justify-content-center">
              {isMounted && (
                <Calendar 
                  onChange={(val: any) => setSelectedDate(val)} 
                  value={selectedDate}
                  className="border-0 shadow-sm rounded w-100 text-dark"
                  tileClassName={getTileClass}
                />
              )}
            </div>
            
            <div className="d-flex justify-content-between mt-3 small px-2">
              <span><i className="bi bi-circle-fill text-success me-1"></i> Accepted</span>
              <span><i className="bi bi-circle-fill text-warning me-1"></i> Pending</span>
              <span><i className="bi bi-circle-fill text-danger me-1"></i> Rejected</span>
            </div>

            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary w-100 mt-4 fw-bold shadow-sm">
              Book New Appointment
            </button>
          </div>
        </div>


        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-secondary m-0">
                Agenda: {selectedDate.toLocaleDateString('en-GB')}
              </h5>
              <span className="badge bg-primary px-3">{dailyAgenda.length} Bookings</span>
            </div>

            <div className="agenda-list" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              {loading ? (
                <p className="text-center py-5 text-muted small">Loading records...</p>
              ) : dailyAgenda.length > 0 ? (
                dailyAgenda.map((app) => (
                  <div key={app.id} 
                       className={`d-flex align-items-center p-3 mb-3 rounded border-start border-4 shadow-sm ${
                         app.appoint_status === 2 ? 'border-success bg-success-subtle' : 
                         app.appoint_status === 3 ? 'border-danger bg-danger-subtle' : 
                         'border-warning bg-warning-subtle'
                       }`}>
                    <div className="me-3 text-center" style={{ minWidth: '80px' }}>
                      <div className="fw-bold text-dark">
                        {/* DISPLAY FIX: Remove the :00 seconds for the user */}
                        {app.appoint_time ? app.appoint_time.substring(0, 5) : 'TBD'}
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Time Slot</small>
                    </div>
                    <div className="grow border-start ps-3 border-secondary border-opacity-25">
                      <div className="fw-bold text-dark">{app.department || 'General'}</div>
                      <small className="text-muted d-block">
                        {app.doctor_name ? `${app.doctor_name}` : 'Assigning Doctor...'}
                      </small>
                    </div>
                    <div className="ms-2">
                      <span className={`badge rounded-pill ${
                        app.appoint_status === 2 ? 'bg-success' : 
                        app.appoint_status === 3 ? 'bg-danger' : 'bg-warning text-dark'
                      }`}>
                        {app.appoint_status === 2 ? 'Accepted' : 
                         app.appoint_status === 3 ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-calendar2-x fs-1 opacity-25"></i>
                  <p className="mt-2">No appointments scheduled for this date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AppointmentModal onClose={() => {
          setIsModalOpen(false);
          fetchAppointments(); 
        }} />
      )}
    </div>
  );
}