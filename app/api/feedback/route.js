import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET: Retrieve all doctors for dropdown selectors
 * URL: http://localhost:3000/api/doctors
 */
export async function GET() {
  try {
    // We select id, name, and department to match your frontend TypeScript interface
    const [rows] = await pool.query(
      'SELECT id, name, department FROM doctors ORDER BY name ASC'
    );

    // Return the array directly as clean JSON
    return NextResponse.json(rows);
    
  } catch (error) {
    console.error("Database Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch doctors for feedback selection" }, 
      { status: 500 }
    );
  }
}