import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const cookieStore = await cookies();
    const docId = cookieStore.get('user_id')?.value;

    if (!docId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetches appointments for this doctor OR unassigned ones
    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        u.username as patient_name, 
        a.appoint_date, 
        a.appoint_time, 
        a.appoint_status, 
        a.doctor_id
      FROM appointment a
      JOIN users u ON a.user_id = u.id
      WHERE a.doctor_id = ? OR a.doctor_id IS NULL
      ORDER BY a.appoint_date ASC, a.appoint_time ASC
    `, [docId]);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}