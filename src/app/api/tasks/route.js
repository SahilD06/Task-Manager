import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const db = await getDb();
    const tasks = await db.collection('Tasks').find({}).toArray();
    
    // Map _id out to match our frontend UI's expectation of using `id`
    const formattedTasks = tasks.map(t => ({ ...t, id: t.id || t._id.toString() }));
    
    return NextResponse.json(formattedTasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve tasks from MongoDB.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json({ error: 'Task title is required.' }, { status: 400 });
    }

    const newTask = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    const db = await getDb();
    
    // Insert directly into the 'Tasks' collection
    await db.collection('Tasks').insertOne(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task in MongoDB.' }, { status: 500 });
  }
}
