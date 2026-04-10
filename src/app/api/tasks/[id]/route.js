import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const db = await getDb();
    
    const updateDocs = {};
    if (body.completed !== undefined) updateDocs.completed = body.completed;
    if (body.title !== undefined) updateDocs.title = body.title.trim();

    if (Object.keys(updateDocs).length > 0) {
      await db.collection('Tasks').updateOne({ id }, { $set: updateDocs });
    }
    
    // Fetch the updated task from the database
    const updatedTask = await db.collection('Tasks').findOne({ id });

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    const { _id, ...cleanTask } = updatedTask;
    return NextResponse.json(cleanTask);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task in MongoDB.' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    
    const db = await getDb();
    const result = await db.collection('Tasks').deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task from MongoDB.' }, { status: 500 });
  }
}
