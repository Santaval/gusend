import GithubService from "@/app/backend/Services/Github.service";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { Project } from "@/types/Project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getFirestoreDb();
  const docRef = db.collection("projects").doc((await params).id);
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

  const commits = await GithubService.getRepoCommits(
    data.userToken,
    data.repo.owner.login,
    data.repo.name
  );

  const projectData = {
    receivers: data.automation.recipients,
    type: data.automation.type,
  }

  return NextResponse.json({ commits, projectData });
}

