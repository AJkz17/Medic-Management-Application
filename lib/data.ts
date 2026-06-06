import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

export async function getUpcoming() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) return null;

    // Matches your table columns: user_id, appoint_date, appoint_status, department
    const [rows]: any = await pool.query(
      `SELECT id, appoint_date, appoint_status, department 
       FROM appointment 
       WHERE user_id = ? 
       ORDER BY id DESC LIMIT 1`, 
      [userId]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return null;
  }
}