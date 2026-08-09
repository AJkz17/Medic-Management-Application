import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${process.env.APP_URL}/login?error=google_auth_failed`);
    }

    // 1. Exchange the authorization code for an access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Google token exchange failed:', tokenData);
      return NextResponse.redirect(`${process.env.APP_URL}/login?error=google_auth_failed`);
    }

    // 2. Fetch the user's Google profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    const { email, name } = profile;

    if (!email) {
      return NextResponse.redirect(`${process.env.APP_URL}/login?error=no_email`);
    }

    // 3. Find the matching patient account, or create one
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    let userId;
    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      // Google users don't set a password, so store a random unusable one
      const randomPassword = Math.random().toString(36).slice(-16);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const [result] = await pool.query(
        'INSERT INTO users (username, email, password, ic_number, blood_type, phone_number, age) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name || email.split('@')[0], email, hashedPassword, null, null, null, null]
      );
      userId = result.insertId;
    }

    // 4. Issue the same auth_token JWT your normal login uses
    const token = jwt.sign(
      { userId: userId.toString(), role: 'patient' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.redirect(`${process.env.APP_URL}/dashboard`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.APP_URL}/login?error=google_auth_failed`);
  }
}