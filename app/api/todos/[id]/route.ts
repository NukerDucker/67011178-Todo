import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const runtime = 'nodejs'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: idStr } = await params
    const id = parseInt(idStr)

    try {
        const { task, status, target_date } = await request.json()

        // Verify ownership
        const todo = await prisma.todo.findUnique({ where: { id } })
        if (!todo || todo.authorId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: {
                task: task,
                status: status,
                target_date: target_date ? new Date(target_date) : undefined
            }
        })
        return NextResponse.json(updatedTodo)
    } catch (error) {
        console.error("PUT Error:", error)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: idStr } = await params
    const id = parseInt(idStr)

    try {
        // Verify ownership
        const todo = await prisma.todo.findUnique({ where: { id } })
        if (!todo || todo.authorId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        await prisma.todo.delete({ where: { id } })
        return NextResponse.json({ message: "Deleted" })
    } catch (error) {
        console.error("DELETE Error:", error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}