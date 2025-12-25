// app/api/todos/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Tagesschrift } from 'next/font/google';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

  try {
    const todos = await prisma.todo.findMany({
      where: { username },
      orderBy: { target_date: 'desc' },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: "DB Connection Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, task, target_date } = await request.json();

    if (!username || !task || !target_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTodo = await prisma.todo.create({
      data: {
        username: username,
        task: task,
        target_date: new Date(target_date), // Ensure this is a Date object
        status: 'TODO'
      }
    });

    return NextResponse.json(newTodo);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}