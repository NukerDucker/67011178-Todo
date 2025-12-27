import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch todos for a specific user
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const todos = await prisma.todo.findMany({
            where: { userId: userId },
            orderBy: { target_date: 'asc' }
        });

        return NextResponse.json(todos);
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Create a new todo
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, task, target_date } = body;

        const newTodo = await prisma.todo.create({
            data: {
                userId,
                task,
                target_date: new Date(target_date),
                status: 'TODO',
            },
        });

        return NextResponse.json(newTodo);
    } catch (error) {
        console.error("Create error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}