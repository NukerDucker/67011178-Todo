// app/api/todos/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // <--- Use this instead of 'new PrismaClient()'
import { TrainTrack } from 'lucide-react';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    // In Next.js 15, params is a Promise
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    try {
        const { task, status, target_date } = await request.json();

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                task: task,
                status: status,
                target_date: target_date ? new Date(target_date) : undefined
            }
        });
        return NextResponse.json(updatedTodo);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    try {
        await prisma.todo.delete({ where: { id } });
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}