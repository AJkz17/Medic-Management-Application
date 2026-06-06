import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id');
    const role = cookieStore.get('role')?.value;

    if (userId?.value) {
      // 1. ADMIN CHECK
      if (role === 'admin') {
        const [adminRows] = await pool.query(
          'SELECT id, email FROM admin WHERE id = ?',
          [userId.value]
        );
        if (adminRows.length > 0) {
          return NextResponse.json({ ...adminRows[0], role: 'admin' });
        }
      } 

      // 2. DOCTOR CHECK
      if (role === 'doctor') {
        const [docRows] = await pool.query(
          'SELECT id, name, email, department, specialism FROM doctors WHERE id = ?',
          [userId.value]
        );
        if (docRows.length > 0) {
          // Mapping 'name' to 'username' so the Navbar UI stays consistent
          return NextResponse.json({ 
            ...docRows[0], 
            username: docRows[0].name, 
            role: 'doctor' 
          });
        }
      }
      
      // 3. PATIENT CHECK (Users Table)
      const [userRows] = await pool.query(
        'SELECT id, username, email, ic_number, blood_type, phone_number, age FROM users WHERE id = ?',
        [userId.value]
      );
      
      if (userRows.length > 0) {
        return NextResponse.json({ ...userRows[0], role: 'patient' });
      }
    }

    return NextResponse.json({ error: "No active session" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, email, password, ic_number, blood_type, phone_number, age } = await request.json();
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, ic_number, blood_type, phone_number, age) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, email, password, ic_number, blood_type, phone_number, age]
    );
    return NextResponse.json({ message: 'Success', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}