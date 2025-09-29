import { getFirestoreDb } from "@/lib/firebase-admin";
import { Project } from "@/types/Project";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const db = getFirestoreDb();

  // update proejct status 
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

  const body = await request.json();
  const { status } = body;

  await docRef.update({ status });

  return NextResponse.json({ message: "Project updated successfully" });
}

