import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const docId = cookieStore.get('user_id')?.value;

    try {
        // 1. Total Appointments assigned to this doctor
        const [total]= await pool.query(
            'SELECT COUNT(*) as count FROM appointment WHERE doctor_id = ?', [docId]
        );
        // 2. Pending Appointments (Status 1)
        const [pending] = await pool.query(
            'SELECT COUNT(*) as count FROM appointment WHERE doctor_id = ? AND appoint_status = 1', [docId]
        );
        // 3. Today's Appointments
        const [today]= await pool.query(
            'SELECT COUNT(*) as count FROM appointment WHERE doctor_id = ? AND appoint_date = CURDATE()', [docId]
        );

        return NextResponse.json({
            total: total[0].count,
            pending: pending[0].count,
            today: today[0].count
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}