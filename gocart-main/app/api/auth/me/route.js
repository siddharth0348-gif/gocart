import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/authStore';

export async function GET(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const token = authHeader.substring(7);
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        const user = findUserByEmail(decoded.email);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (e) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }
}
