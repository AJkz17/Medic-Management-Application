'use client';

import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { bookAppointment } from "@/lib/actions";

export default function AppointmentModal({ onClose }: { onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [department, setDepartment] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [allDoctors, setAllDoctors] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDoctors() {
      const res = await fetch('/api/doctor');
      if (res.ok) {
        const data = await res.json();
        setAllDoctors(data.doctors || []);
      }
    }
    fetchDoctors();
  }, []);

  const filteredDoctors = allDoctors.filter(doc => 
    department === "" || doc.department === department
  );

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
      
      <div className="card shadow-lg border-0 p-4" style={{ width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary fw-bold mb-0">Book Appointment</h4>
          <button onClick={onClose} className="btn-close shadow-none"></button>
        </div>

        <form 
          action={async (formData) => {
            // FIX 1: Format date correctly to prevent the "Malaysia Timezone Slide"
            // Using local date parts instead of toISOString ensures "April 15" stays "April 15"
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            // Append the fixed date to formData
            formData.set('appoint_date', formattedDate);

            // FIX 2: Ensure the doctor_id and department from state are definitely in the formData
            formData.set('doctor_id', doctorId);
            formData.set('department', department);

            const result = await bookAppointment(formData);

            if (result.success) {
              alert("Appointment confirmed!");
              onClose();
            } else {
              alert(result.message || "Failed to book appointment.");
            }
          }}
        >
          {/* 1. Department Selection */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Department</label>
            <select 
              name="department" 
              className="form-select shadow-none" 
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorId(""); 
              }}
              required
            >
              <option value="">Select a Department</option>
              <option value="General Physician">General Physician</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dental">Dental</option>
            </select>
          </div>

          {/* 2. Doctor Selection */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Select Doctor</label>
            <select 
              name="doctor_id" 
              className="form-select shadow-none"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              disabled={!department}
            >
              <option value="">{department ? "Select a Doctor" : "Pick a department first"}</option>
              {filteredDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.name} ({doc.specialism})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Time Selection - This name must match your database insert code */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Preferred Time</label>
            <input 
              type="time" 
              name="appoint_time" 
              className="form-control shadow-none" 
              required 
            />
            <small className="text-muted mt-1 d-block">Available slots: 9:00 AM - 5:00 PM</small>
          </div>

          {/* 4. Calendar */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Select Appointment Date</label>
            <div className="d-flex justify-content-center border rounded p-2 bg-white text-dark">
              <Calendar 
                onChange={(value) => setSelectedDate(value as Date)} 
                value={selectedDate}
                minDate={new Date()} 
                className="border-0 w-100"
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-light w-100">Cancel</button>
            <button type="submit" className="btn btn-primary w-100 shadow-none">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
}