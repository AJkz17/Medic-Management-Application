import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    // 1. Security Check First
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. AUTO-DELETE: Clean up appointments from YESTERDAY and older
    await pool.query(
      'DELETE FROM appointment WHERE appoint_date < CURDATE()'
    );

    // 3. FETCH: Corrected JOIN statement to link directly with the doctors table
    const [rows] = await pool.query(
      `SELECT 
        a.id, 
        a.appoint_date, 
        a.appoint_time, 
        a.appoint_status, 
        a.department, 
        d.name AS doctor_name --  Correctly pulling doctor name from doctors table
       FROM appointment a
       LEFT JOIN doctors d ON a.doctor_id = d.id --  Swapped from users to doctors
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await pool.query('DELETE FROM appointment WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: "Appointment cancelled" });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}