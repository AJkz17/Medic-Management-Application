import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET: Fetch all doctor leave applications
export async function GET() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('role')?.value !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [rows] = await pool.query('SELECT id, doctor_name, leave_date, reason, status FROM doctor_leaves ORDER BY status ASC, leave_date ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Process approvals or rejections
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('role')?.value !== 'admin') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, status } = await request.json(); // status values: 2 = Approve, 3 = Reject
    await pool.query('UPDATE doctor_leaves SET status = ? WHERE id = ?', [status, id]);

    return NextResponse.json({ success: true, message: "Status updated successfully!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}