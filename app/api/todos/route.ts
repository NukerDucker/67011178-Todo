import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const todos = await prisma.todo.findMany({
      where: { authorId: session.user.id },
      orderBy: { target_date: 'desc' },
    })
    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json({ error: "DB Connection Failed" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { task, target_date } = await request.json()

    if (!task || !target_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newTodo = await prisma.todo.create({
      data: {
        username: (session.user.name || session.user.email?.split('@')[0] || 'User').substring(0, 20),
        task: task,
        target_date: new Date(target_date),
        status: 'TODO',
        authorId: session.user.id
      }
    })

    return NextResponse.json(newTodo)
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}