import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.userId;

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

    // Convert appoint_date to a plain local YYYY-MM-DD string
    // before it gets JSON-serialized (which would otherwise UTC-shift it).
    const safeRows = rows.map((row) => ({
      ...row,
      appoint_date:
        row.appoint_date instanceof Date
          ? `${row.appoint_date.getFullYear()}-${String(row.appoint_date.getMonth() + 1).padStart(2, '0')}-${String(row.appoint_date.getDate()).padStart(2, '0')}`
          : row.appoint_date,
    }));

    return NextResponse.json(safeRows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}