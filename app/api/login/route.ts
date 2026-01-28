import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path to your prisma helper

export async function POST(request: Request) {
    try {
        const { username } = await request.json();

        if (!username || username.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Username is required' },
                { status: 400 }
            );
        }


        return NextResponse.json({
            success: true,
            message: 'Login successful',
            username: username
        });
        
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}