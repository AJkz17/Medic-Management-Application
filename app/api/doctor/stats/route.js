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
        if (decoded.role !== 'doctor') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const docId = decoded.userId;

        const [total] = await pool.query(
            'SELECT COUNT(*) as count FROM appointment WHERE doctor_id = ?', [docId]
        );
        const [pending] = await pool.query(
            'SELECT COUNT(*) as count FROM appointment WHERE doctor_id = ? AND appoint_status = 1', [docId]
        );
        const [today] = await pool.query(
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