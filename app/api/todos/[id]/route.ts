import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Define params as a Promise
) {
    try {
        const body = await request.json();

        // 1. You MUST await params in Next.js 15+ for dynamic routes [id]
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // 2. Update the record
        const updatedTodo = await prisma.todo.update({
            where: { id: id },
            data: {
                task: body.task,
                status: body.status,
                // updated_at is handled automatically if using @updatedAt in schema
            },
        });

        return NextResponse.json(updatedTodo);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Fixed DELETE route as well
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        await prisma.todo.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}