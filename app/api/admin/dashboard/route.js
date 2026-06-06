import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetches all appointments for the Admin Dashboard management table
 * URL: http://localhost:3000/api/admin/dashboard
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('role')?.value;

    // 1. Security Gate: Guard the route so only admins can read all patient data
    if (role !== 'admin') {
      return NextResponse.json({ error: "Access Denied: Unauthorized Admin view" }, { status: 403 });
    }

    // 2. Fetch all appointments across the system
    const [rows] = await pool.query(
      `SELECT id, user_id, department, appoint_date, appoint_status 
       FROM appointment 
       ORDER BY appoint_date DESC, appoint_time DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Admin Bookings Fetch Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to load system bookings data" }, 
      { status: 500 }
    );
  }
}