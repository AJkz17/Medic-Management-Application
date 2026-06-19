import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctor_id');

    if (doctorId) {
      const [rows] = await pool.query(
        `SELECT 
          DATE_FORMAT(a.appoint_date, '%Y-%m-%d') AS appoint_date, 
          a.appoint_time, 
          d.name AS doctor_name 
         FROM appointment a 
         JOIN doctors d ON a.doctor_id = d.id 
         WHERE a.doctor_id = ? 
           AND a.appoint_status = 2
         ORDER BY a.appoint_date ASC, a.appoint_time ASC`,
        [doctorId]
      );
      return NextResponse.json(rows);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await pool.query(
      'DELETE FROM appointment WHERE appoint_date < CURDATE()'
    );

    const [rows] = await pool.query(
      `SELECT 
        a.id, 
        DATE_FORMAT(a.appoint_date, '%Y-%m-%d') AS appoint_date, 
        a.appoint_time, 
        a.appoint_status, 
        d.department,       
        d.name AS doctor_name 
       FROM appointment a
       LEFT JOIN doctors d ON a.doctor_id = d.id 
       WHERE a.user_id = ? 
       ORDER BY a.appoint_date ASC`, 
      [userId]
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Database Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}