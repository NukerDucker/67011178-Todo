// app/api/todos/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

  try {
    const todos = await prisma.todo.findMany({
      where: { username },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: "DB Connection Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { username, task } = await request.json();
  const newTodo = await prisma.todo.create({
    data: {
        username,
        task,
        done: false // Explicitly set for Postgres boolean
    }
  });
  return NextResponse.json(newTodo);
}