import { NextResponse } from 'next/server';
import { createStore } from '@/lib/authStore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, username, description, email, contact, userId } = body;

        const store = createStore({ name, username, description, email, contact, userId });
        return NextResponse.json({
            success: true,
            message: 'Store submitted for approval',
            store
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    }
}
