import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/authStore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }

        // Try forwarding to Spring Boot backend if running
        try {
            const backendRes = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                signal: AbortSignal.timeout(1500),
            });
            if (backendRes.ok) {
                const data = await backendRes.json();
                return NextResponse.json(data);
            }
        } catch (e) {
            // Spring Boot not running, proceed with built-in auth store
        }

        const authResult = authenticateUser(email, password);
        return NextResponse.json(authResult);
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 401 });
    }
}
