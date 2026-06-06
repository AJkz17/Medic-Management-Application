import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        d.name as doctor_name, 
        a.appoint_date, 
        a.appoint_time, 
        a.appoint_status
      FROM appointment a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.user_id = ?
      ORDER BY a.appoint_date DESC
    `, [userId]);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}