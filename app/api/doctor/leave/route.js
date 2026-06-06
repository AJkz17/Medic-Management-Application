import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET: Fetch personal history for the logged-in doctor
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const role = cookieStore.get('role')?.value;

    if (!userId || role !== 'doctor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await pool.query(
      'SELECT id, leave_date, reason, status FROM doctor_leaves WHERE doctor_id = ? ORDER BY leave_date DESC',
      [userId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Submit a new leave request
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    const username = cookieStore.get('username')?.value || 'Doctor';
    const role = cookieStore.get('role')?.value;

    if (!userId || role !== 'doctor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leave_date, reason } = await request.json();
    if (!leave_date || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO doctor_leaves (doctor_id, doctor_name, leave_date, reason) VALUES (?, ?, ?, ?)',
      [userId, username, leave_date, reason]
    );

    return NextResponse.json({ success: true, message: "Leave applied successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}