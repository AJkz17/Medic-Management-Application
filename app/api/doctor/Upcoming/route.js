import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT 
        DATE_FORMAT(a.appoint_date, '%Y-%m-%d') AS appoint_date, 
        a.appoint_time, 
        d.name AS doctor_name 
       FROM appointment a 
       JOIN doctors d ON a.doctor_id = d.id 
       WHERE a.appoint_date >= CURDATE() 
         AND a.appoint_status = 2
       ORDER BY a.appoint_date ASC, a.appoint_time ASC`
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Doctor Upcoming Route Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}