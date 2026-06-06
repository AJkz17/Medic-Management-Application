import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const docId = cookieStore.get('user_id')?.value;
    const role = cookieStore.get('role')?.value;

    // --- CASE 1: LOGGED IN DOCTOR FETCHING OWN PROFILE ---
    if (docId && role === 'doctor') {
      const [rows] = await pool.query(
        'SELECT name, email, department, specialism, status FROM doctors WHERE id = ?',
        [docId]
      );
      
      if (rows.length > 0) {
        return NextResponse.json(rows[0]);
      }
    }

    // --- CASE 2: ADMIN FETCHING ALL DOCTORS ---
    // 1. Fetch all doctors in Ascending order
    const [rows] = await pool.query('SELECT * FROM doctors ORDER BY id ASC');
    
    // 2. Fetch the total count
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM doctors');
    const totalCount = countResult[0].total;

    // 3. Return the combined object
    return NextResponse.json({
      doctors: rows,
      totalDoctors: totalCount
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}