import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/firebase-admin';
import { Project } from '@/types/Project';
import axios from 'axios';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getFirestoreDb();
    const docRef = db.collection("projects").doc(params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = docSnap.data() as Project;
    if (project.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Add activity log for manual run
    await db.collection('activity').add({
      projectId: params.id,
      type: 'automation_manual_run',
      title: 'Manual automation run',
      description: `Manual execution triggered for ${project.repo.name}`,
      time: new Date().toISOString(),
      status: 'started'
    });

    // Update project with lastRun
    await docRef.update({
      'automation.lastRun': new Date().toISOString()
    });

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL not configured" }, { status: 500 });
    }
    await axios.get(webhookUrl+`/${params.id}`);

    return NextResponse.json({ 
      message: "Automation started successfully",
      lastRun: new Date().toISOString()
    });
  } catch (error) {
    console.error('Manual run error:', error);
    return NextResponse.json({ error: "Failed to start automation" }, { status: 500 });
  }
}