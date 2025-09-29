import CronJobService from "@/app/backend/Services/CronJob.service";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { Project } from "@/types/Project";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const db = getFirestoreDb();

  // update project status
  const docRef = db.collection("projects").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const data = docSnap.data() as Project;
  if (!data) {
    return NextResponse.json(
      { error: "No data found for this project" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { status } = body;

  await docRef.update({ status });

  if (status === 'active') {
    // register cron job
    await CronJobService.register(id, data.automation.cronSchedule!);
  } else {
    // unregister cron job
    await CronJobService.unregister(id);
  }

  return NextResponse.json({ message: "Project updated successfully" });
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get projectId from query parameters
    const { id: projectId } = await params;

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const db = getFirestoreDb();
    const docRef = db.collection("projects").doc(projectId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify project belongs to user
    const projectData = docSnap.data();
    if (projectData?.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await docRef.delete();


    // unregister cron job
    await CronJobService.unregister(projectId);

    // Log deletion activity
    await db.collection('activity').add({
      projectId,
      type: 'project_deleted',
      title: 'Project deleted',
      description: `Project automation removed`,
      time: new Date().toISOString(),
      status: 'success'
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
