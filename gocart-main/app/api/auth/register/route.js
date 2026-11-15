import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/authStore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 });
        }

        // Try forwarding to Spring Boot backend if running
        try {
            const backendRes = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
                signal: AbortSignal.timeout(1500),
            });
            if (backendRes.ok) {
                const data = await backendRes.json();
                return NextResponse.json(data);
            }
        } catch (e) {
            // Spring Boot not running, proceed with built-in auth store
        }

        const newUser = registerUser({ name, email, password, role });
        return NextResponse.json({
            success: true,
            message: 'User registered successfully!',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    }
}
