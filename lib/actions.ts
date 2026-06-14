'use server';

import { pool } from './db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');
  const icNumber = formData.get('icNumber');
  const bloodType = formData.get('bloodType');
  const email = formData.get('email');
  const phoneNumber = formData.get('phoneNumber');
  const age = formData.get('age');

  
  try {
    const [result] = await pool.query(
      `INSERT INTO users (username, password, ic_number, blood_type, email, phone_number, age) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, password, icNumber, bloodType, email, phoneNumber, age]
    );

    return { success: true, message: "Registration successful!" };
  } catch (error: any) {
    console.error("Database Error:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, message: "Email or IC Number already registered." };
    }
    
    return { success: false, message: "Database connection failed. Is XAMPP running?" };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const cookieStore = await cookies();

  // --- AUTOMATIC CLEAN SLATE ---
  cookieStore.delete('user_id');
  cookieStore.delete('role');

  try {
    const [adminRows]: any = await pool.query(
      'SELECT id FROM admin WHERE email = ? AND password = ?',
      [email, password]
    );

    if (adminRows.length > 0) {
      const adminId = adminRows[0].id.toString();
      cookieStore.set('user_id', adminId, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 });
      cookieStore.set('role', 'admin', { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 });
      
      return { success: true, message: "Admin Login Successful!", redirectTo: '/admin/dashboard' };
    }

    const [doctorRows]: any = await pool.query(
      'SELECT id FROM doctors WHERE email = ? AND password = ?',
      [email, password]
    );

    if (doctorRows.length > 0) {
      const doctorId = doctorRows[0].id.toString();
      cookieStore.set('user_id', doctorId, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 });
      cookieStore.set('role', 'doctor', { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 });
      
      return { success: true, message: "Doctor Login Successful!", redirectTo: '/doctor/dashboard' };
    }

    // 3. THIRD CHECK: Users (Patients) Table
    const [userRows]: any = await pool.query(
      'SELECT id, username FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (userRows.length > 0) {
      const userId = userRows[0].id.toString();
      cookieStore.set('user_id', userId, { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 });
      cookieStore.set('role', 'patient', { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 });

      return { success: true, message: "Login Successful! Redirecting...", redirectTo: '/dashboard' };
    }

    return { success: false, message: "Invalid email or password." };

  } catch (error: any) {
    console.error("Login error:", error);
    if (error.code === 'ECONNREFUSED') {
      return { success: false, message: "Database connection failed. Is XAMPP running?" };
    }
    return { success: false, message: "An error occurred during login." };
  }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    
    cookieStore.delete({ name: 'user_id', path: '/' });
    cookieStore.delete({ name: 'role', path: '/' });
    
    return { success: true };
}

export async function bookAppointment(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id');

    if (!userId?.value) {
      return { success: false, message: "Session expired. Please login again." };
    }


    const appoint_date = formData.get('appoint_date'); 
    const department = formData.get('department');
    const doctor_id = formData.get('doctor_id'); // Make sure you grab this too!
    let appoint_time = formData.get('appoint_time') as string;
    const appoint_status = 1; 

    if (appoint_time && appoint_time.length === 5) {
        appoint_time = `${appoint_time}:00`;
    }

    // Check if  user already has an appointment at this exact date and time
    const [existing]: any = await pool.query(
      'SELECT id FROM appointment WHERE user_id = ? AND appoint_date = ? AND appoint_time = ? AND appoint_status != 3',
      [userId.value, appoint_date, appoint_time]
    );

    if (existing.length > 0) {
      return { 
        success: false, 
        message: "You already have another appointment scheduled for this time slot. Please choose a different time." 
      };
    }

    await pool.query(
      `INSERT INTO appointment 
       (user_id, doctor_id, appoint_date, appoint_time, appoint_status, department) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId.value, doctor_id, appoint_date, appoint_time, appoint_status, department]
    );

    revalidatePath('/dashboard');
    
    return { success: true, message: "Appointment booked successfully!" };
  } catch (error: any) {
    console.error("Booking Error:", error);
    return { success: false, message: "Database error: " + error.message };
  }
}

// Add patient
export async function addPatient(formData: FormData) {
  const username = formData.get('username');
  const ic_number = formData.get('ic_number');
  const password = 'password123';
  const blood_type = formData.get('blood_type');
  const phone_number = formData.get('phonenumber');
  const email = formData.get('email');
  const age = formData.get('age');

  await pool.query(
      'INSERT INTO users (username, password, email,ic_number,blood_type,phone_number,age) VALUES (?,?,?,?,?,?,?)',
      [username, password, email, ic_number, blood_type, phone_number, age]
  );
  return { success: true };
}


//Delete Patient
export async function deletePatient(id:number) {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return { success: true };
}


// Update Patient
export async function updatePatientInfo(id: number, age: string, blood: string) {
    await pool.query('UPDATE users SET age = ?, blood_type = ? WHERE id = ?', [age, blood, id]);
    return { success: true };
}

// register new doctor
export async function addDoctor(formData: FormData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const defaultPassword = 'password123';
    const dept = formData.get('department');
    const spec = formData.get('specialism');

    await pool.query(
        'INSERT INTO doctors (name, email, password, department, specialism) VALUES (?, ?, ?, ?, ?)',
        [name, email, defaultPassword, dept, spec]
    );
    return { success: true };
}

export async function updateDoctor(formData: FormData) {
    const id = formData.get('id');
    const name = formData.get('name');
    const dept = formData.get('department');
    const status = formData.get('status');

    await pool.query(
        'UPDATE doctors SET name = ?, department = ?, status = ? WHERE id = ?',
        [name, dept, status, id]
    );
    return { success: true };
}
// Delete doctor
export async function deleteDoctor(id: number) {
    await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
    return { success: true };
}

export async function updateDoctorStatus(id: number, status: string) {
    try {
        await pool.query(
            'UPDATE doctors SET status = ? WHERE id = ?',
            [status, id]
        );
        
        return { success: true, message: "Status updated!" };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "Failed to update status" };
    }
}

export async function updateBookingStatus(id: number, status: number) {
  try {
    await pool.query(
      'UPDATE appointment SET appoint_status = ? WHERE id = ?',
      [status, id]
    );
    return { success: true }; 
  } catch (error) {
    console.error(error);
    return { success: false, message: "Update failed" };
  }
}


export async function claimAppointment(appointmentId: number, doctorId: string) {
    try {
        await pool.query(
            'UPDATE appointment SET doctor_id = ?, appoint_status = 1 WHERE id = ?',
            [doctorId, appointmentId]
        );
        return { success: true, message: "Appointment claimed successfully" };
    } catch (error: any) {
        console.error(error);
        return { success: false, message: "Database update failed." };
    }
}

export async function createBooking(formData: FormData) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const department = formData.get('department');
    const doctorId = formData.get('doctor_id');
    const date = formData.get('appoint_date');
    let time = formData.get('appoint_time') as string;

    if (time && time.length === 5) {
        time = `${time}:00`; 
    }

    if (!userId) return { success: false, message: "Please login." };

    try {
        await pool.query(
            `INSERT INTO appointment (user_id, doctor_id, department, appoint_date, appoint_time, appoint_status) 
             VALUES (?, ?, ?, ?, ?, 1)`,
            [userId, doctorId, department, date, time]
        );
        return { success: true };
    } catch (error: any) {
        console.error("Database Error:", error.message);
        return { success: false, message: error.message };
    }
}

export async function applyDoctorLeave(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const doctorId = cookieStore.get('doctor_id')?.value;

    if (!doctorId) return { success: false, message: "Unauthorized." };

    const leaveDate = formData.get('leave_date') as string;
    const reason = formData.get('reason') as string;

    // Check if a leave request already exists for this date
    const [existing]: any = await pool.query(
      'SELECT id FROM doctor_leaves WHERE doctor_id = ? AND leave_date = ?',
      [doctorId, leaveDate]
    );

    if (existing.length > 0) {
      return { success: false, message: "You already applied for leave on this date." };
    }

    await pool.query(
      'INSERT INTO doctor_leaves (doctor_id, leave_date, reason) VALUES (?, ?, ?)',
      [doctorId, leaveDate, reason]
    );

    return { success: true, message: "Leave request submitted to Admin!" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function submitFeedback(formData: FormData) {
    try {
        const cookieStore = await cookies();
        
        const sessionUserId = cookieStore.get('user_id')?.value;
        const sessionUsername = cookieStore.get('username')?.value || 'Anonymous Patient';

        const doctorId = formData.get('doctorId') as string;
        const rating = formData.get('rating') as string;
        const comments = formData.get('comments') as string;

        if (!sessionUserId) {
            return { success: false, message: "Session expired. Please log in again." };
        }

        if (!doctorId || !rating || rating === '0') {
            return { success: false, message: "Missing doctor selection or rating." };
        }
        await pool.query(
            `INSERT INTO feedback (user_id, username, doctor_id, rating, comments) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                parseInt(sessionUserId),
                sessionUsername, 
                parseInt(doctorId),      
                parseInt(rating), 
                comments
            ]
        );

        revalidatePath('/feedback'); 
        return { success: true, message: "Thank you! Your feedback has been submitted." };
    } catch (error: any) {
        console.error("Submit Feedback Error:", error);
        return { success: false, message: error.message || "Failed to submit data." };
    }
}

