import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const activeUserId = decoded.userId;
    const role = decoded.role;

    if (role === 'admin') {
      const [adminRows]: any = await pool.query(
        'SELECT id, email FROM admin WHERE id = ?',
        [activeUserId]
      );
      if (adminRows.length > 0) {
        return NextResponse.json({ ...adminRows[0], role: 'admin' });
      }
    } 

    if (role === 'doctor') {
      const [docRows]: any = await pool.query(
        'SELECT id, name, email, department, specialism FROM doctors WHERE id = ?',
        [activeUserId]
      );
      if (docRows.length > 0) {
        return NextResponse.json({ 
          ...docRows[0], 
          username: docRows[0].name, 
          role: 'doctor' 
        });
      }
    }
    
    if (role === 'patient') {
      const [userRows]: any = await pool.query(
        'SELECT id, username, email, ic_number, blood_type, phone_number, age FROM users WHERE id = ?',
        [activeUserId]
      );
      if (userRows.length > 0) {
        return NextResponse.json({ ...userRows[0], role: 'patient' });
      }
    }

    return NextResponse.json({ error: "No active session" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, email, password, ic_number, blood_type, phone_number, age } = await request.json();
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result]: any = await pool.query(
      'INSERT INTO users (username, email, password, ic_number, blood_type, phone_number, age) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, ic_number, blood_type, phone_number, age]
    );
    
    return NextResponse.json({ message: 'Success', id: result.insertId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}