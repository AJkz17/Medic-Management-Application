import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, password, department, specialism, status FROM doctors ORDER BY id ASC'
        );

        // Return the rows directly as JSON so the frontend can map them
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}